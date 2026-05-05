#!/usr/bin/env python3
"""
Validate that file-path fields in benchmarks/threat-model/apps/*/ground-truth.json
resolve to real files on disk.

Source root for each benchmark is `<benchmark>/src/`. The fields validated are:

  - planted_vulnerabilities[].file
  - endpoints[].input.file

Other path-shaped fields (e.g. features[].entry_points[]) are NOT validated;
those hold route strings or CLI args, not file paths.

Exits 0 on success, 1 if any path does not resolve.
"""

from __future__ import annotations

import json
import os
import sys
from glob import glob
from typing import Iterator

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GLOB_PATTERN = "benchmarks/threat-model/apps/*/ground-truth.json"


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


def main() -> int:
    issues: list[tuple[str, str, str, str]] = []
    checked = 0
    benchmarks = 0

    pattern = os.path.join(REPO_ROOT, GLOB_PATTERN)
    for gt_path in sorted(glob(pattern)):
        benchmarks += 1
        benchmark_dir = os.path.dirname(gt_path)
        src_root = os.path.join(benchmark_dir, "src")
        benchmark_id = os.path.basename(benchmark_dir)

        with open(gt_path) as f:
            data = json.load(f)

        for jsonpath, value in iter_path_fields(data):
            checked += 1
            resolved = os.path.join(src_root, value)
            if not os.path.exists(resolved):
                rel_resolved = os.path.relpath(resolved, REPO_ROOT)
                issues.append((benchmark_id, jsonpath, value, rel_resolved))

    if not issues:
        print(f"OK: checked {checked} path field(s) across {benchmarks} benchmarks")
        return 0

    print(f"FAIL: {len(issues)} unresolved path(s) across {benchmarks} benchmarks\n")
    for benchmark_id, jsonpath, value, resolved in issues:
        print(f"  {benchmark_id}  {jsonpath}")
        print(f"    value:   {value}")
        print(f"    missing: {resolved}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
