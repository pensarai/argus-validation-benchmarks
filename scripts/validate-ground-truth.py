#!/usr/bin/env python3
"""
Validate benchmarks/threat-model/apps/*/ground-truth.json files.

Two checks run against every TM-APP ground-truth.json:

1. **Path resolution.** Every `planted_vulnerabilities[].file` and
   `endpoints[].input.file` must resolve to a real file under the
   benchmark's `src/` source root.

2. **Type uniformity.** Every leaf field path (e.g.
   `endpoints[].input.method`) must hold the same primitive type at every
   occurrence across every benchmark. Catches schema drift like a field
   that's a `str` everywhere except in one entry where it's a `list[str]`.

Exits 0 on success, 1 if either check fails.
"""

from __future__ import annotations

import json
import os
import sys
from collections import defaultdict
from glob import glob
from typing import Any, Iterator

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GLOB_PATTERN = "benchmarks/threat-model/apps/*/ground-truth.json"


# ---------------------------------------------------------------------------
# Check 1: path resolution
# ---------------------------------------------------------------------------

def iter_path_fields(data: dict) -> Iterator[tuple[str, str]]:
    """Yield (jsonpath, value) pairs for every path-bearing field we validate."""
    for i, v in enumerate(data.get("planted_vulnerabilities") or []):
        if isinstance(v, dict):
            file_field = v.get("file")
            if isinstance(file_field, str) and file_field:
                yield f"planted_vulnerabilities[{i}].file", file_field

    for i, ep in enumerate(data.get("endpoints") or []):
        if isinstance(ep, dict):
            inp = ep.get("input") or {}
            file_field = inp.get("file")
            if isinstance(file_field, str) and file_field:
                yield f"endpoints[{i}].input.file", file_field


def check_paths(benchmarks: list[tuple[str, str, dict]]) -> tuple[int, list[tuple[str, str, str, str]]]:
    """Return (checked_count, issues). Each issue: (benchmark_id, jsonpath, value, resolved_rel)."""
    issues: list[tuple[str, str, str, str]] = []
    checked = 0
    for benchmark_id, gt_path, data in benchmarks:
        src_root = os.path.join(os.path.dirname(gt_path), "src")
        for jsonpath, value in iter_path_fields(data):
            checked += 1
            resolved = os.path.join(src_root, value)
            if not os.path.exists(resolved):
                rel_resolved = os.path.relpath(resolved, REPO_ROOT)
                issues.append((benchmark_id, jsonpath, value, rel_resolved))
    return checked, issues


# ---------------------------------------------------------------------------
# Check 2: type uniformity
# ---------------------------------------------------------------------------

def type_of(v: Any) -> str | None:
    """Return a printable type tag for a JSON value. None values return None (skipped)."""
    if v is None:
        return None
    if isinstance(v, bool):  # bool is a subclass of int — handle first
        return "bool"
    if isinstance(v, int):
        return "int"
    if isinstance(v, float):
        return "float"
    if isinstance(v, str):
        return "str"
    if isinstance(v, list):
        elem_types = sorted({t for t in (type_of(x) for x in v) if t is not None})
        if not elem_types:
            return "list[?]"
        return f"list[{'|'.join(elem_types)}]"
    if isinstance(v, dict):
        return "dict"
    return type(v).__name__


def walk_for_types(
    obj: Any,
    path: str,
    observations: dict[str, list[tuple[str, str]]],
    location: str,
) -> None:
    """Walk a JSON object and record (type, location) at every leaf path."""
    t = type_of(obj)
    if t is None:
        return
    if t == "dict":
        for k, v in obj.items():
            walk_for_types(v, f"{path}.{k}" if path else k, observations, location)
    elif t.startswith("list[") and t != "list[?]":
        if any(isinstance(x, dict) for x in obj):
            for x in obj:
                if isinstance(x, dict):
                    walk_for_types(x, f"{path}[]", observations, location)
        else:
            observations[path].append((t, location))
    else:
        observations[path].append((t, location))


def check_type_uniformity(
    benchmarks: list[tuple[str, str, dict]],
) -> tuple[int, list[tuple[str, list[str], dict[str, list[str]]]]]:
    """Return (observation_count, issues). Each issue: (path, sorted_unique_types, locations_by_type)."""
    observations: dict[str, list[tuple[str, str]]] = defaultdict(list)
    for benchmark_id, _gt_path, data in benchmarks:
        for top_key, val in data.items():
            if isinstance(val, list):
                for i, item in enumerate(val):
                    if isinstance(item, dict):
                        walk_for_types(item, f"{top_key}[]", observations, f"{benchmark_id} {top_key}[{i}]")
                    else:
                        t = type_of(item)
                        if t is not None:
                            observations[top_key].append((t, benchmark_id))
            elif isinstance(val, dict):
                walk_for_types(val, top_key, observations, benchmark_id)
            else:
                t = type_of(val)
                if t is not None:
                    observations[top_key].append((t, benchmark_id))

    issues = []
    total = sum(len(v) for v in observations.values())
    for path, entries in sorted(observations.items()):
        types_seen = sorted({t for t, _ in entries})
        # `list[?]` (empty list) is compatible with any concrete `list[<T>]`
        # because the empty list doesn't constrain the element type. It is NOT
        # compatible with scalar types — `[]` vs `"hello"` is real drift.
        others = [t for t in types_seen if t != "list[?]"]
        if "list[?]" in types_seen and others and all(t.startswith("list[") for t in others):
            effective_types = others  # ignore the empty-list observations
        else:
            effective_types = types_seen
        if len(set(effective_types)) > 1:
            by_type: dict[str, list[str]] = defaultdict(list)
            for t, loc in entries:
                if loc not in by_type[t]:
                    by_type[t].append(loc)
            issues.append((path, types_seen, dict(by_type)))
    return total, issues


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    pattern = os.path.join(REPO_ROOT, GLOB_PATTERN)
    benchmarks: list[tuple[str, str, dict]] = []
    for gt_path in sorted(glob(pattern)):
        benchmark_id = os.path.basename(os.path.dirname(gt_path))
        with open(gt_path) as f:
            benchmarks.append((benchmark_id, gt_path, json.load(f)))

    paths_checked, path_issues = check_paths(benchmarks)
    types_checked, type_issues = check_type_uniformity(benchmarks)

    if path_issues:
        print(f"FAIL: {len(path_issues)} unresolved path(s)\n")
        for benchmark_id, jsonpath, value, resolved in path_issues:
            print(f"  {benchmark_id}  {jsonpath}")
            print(f"    value:   {value}")
            print(f"    missing: {resolved}")
        print()

    if type_issues:
        print(f"FAIL: {len(type_issues)} field path(s) with non-uniform types\n")
        for path, types_seen, by_type in type_issues:
            print(f"  {path}")
            print(f"    types: {types_seen}")
            for t in types_seen:
                locs = by_type.get(t, [])
                sample = ", ".join(sorted(set(locs))[:3])
                extra = f" (+{len(set(locs)) - 3} more)" if len(set(locs)) > 3 else ""
                print(f"      {t}: {sample}{extra}")
        print()

    if path_issues or type_issues:
        return 1

    print(
        f"OK: checked {paths_checked} path field(s) and {types_checked} typed field(s) "
        f"across {len(benchmarks)} benchmarks"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
