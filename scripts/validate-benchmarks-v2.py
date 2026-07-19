#!/usr/bin/env python3
"""Validate defense-enabled v2 benchmark manifests without third-party packages."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
BENCHMARKS = ROOT / "benchmarks"
ID_PATTERN = re.compile(r"^(?:APEX|ARGUS)-\d{3}-\d{2}$")
FIDELITY_TIERS = {"behavioral", "protocol", "product", "boundary"}
DEFENSE_MODES = {"none", "observe", "detect", "block", "respond"}
EXPECTED_RESULTS = {"exploitable", "detectable", "blocked", "patched"}
RESETS = {"container", "compose", "cluster", "microvm"}


def nonempty(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def require_object(data: dict[str, Any], key: str, errors: list[str]) -> dict[str, Any]:
    value = data.get(key)
    if not isinstance(value, dict):
        errors.append(f"{key}: expected object")
        return {}
    return value


def require_strings(data: dict[str, Any], key: str, errors: list[str], *, allow_empty: bool = False) -> list[str]:
    value = data.get(key)
    if not isinstance(value, list) or (not allow_empty and not value) or not all(nonempty(item) for item in value):
        errors.append(f"{key}: expected {'an' if allow_empty else 'a non-empty'} array of strings")
        return []
    return value


def validate_manifest(path: Path) -> list[str]:
    errors: list[str] = []
    try:
        data = json.loads(path.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        return [f"invalid JSON: {exc}"]

    if data.get("schema_version") != "2.0":
        return []

    benchmark_id = data.get("id")
    if not isinstance(benchmark_id, str) or not ID_PATTERN.fullmatch(benchmark_id):
        errors.append("id: expected APEX-NNN-YY or ARGUS-NNN-YY")
    if benchmark_id != path.parents[1].name:
        errors.append(f"id: {benchmark_id!r} does not match directory {path.parents[1].name!r}")
    for key in ("name", "description", "objective"):
        if not nonempty(data.get(key)):
            errors.append(f"{key}: expected non-empty string")
    if not isinstance(data.get("difficulty"), int) or data["difficulty"] not in (1, 2, 3):
        errors.append("difficulty: expected integer 1, 2, or 3")
    require_strings(data, "tags", errors)

    fidelity = require_object(data, "fidelity", errors)
    if fidelity.get("tier") not in FIDELITY_TIERS:
        errors.append("fidelity.tier: invalid tier")
    if not nonempty(fidelity.get("rationale")):
        errors.append("fidelity.rationale: expected non-empty string")
    real = require_strings(fidelity, "real_components", errors, allow_empty=True)
    simulated = require_strings(fidelity, "simulated_components", errors, allow_empty=True)
    require_strings(fidelity, "protocols", errors, allow_empty=True)
    if fidelity.get("tier") != "behavioral" and simulated:
        errors.append("fidelity: non-behavioral tiers cannot declare simulated components")
    if not real and not simulated:
        errors.append("fidelity: at least one real or simulated component is required")

    isolation = require_object(data, "isolation", errors)
    for key in ("attacker_boundary", "target_boundary", "success_boundary", "outer_boundary"):
        if not nonempty(isolation.get(key)):
            errors.append(f"isolation.{key}: expected non-empty string")
    if isolation.get("reset") not in RESETS:
        errors.append("isolation.reset: invalid reset boundary")

    defenses = data.get("defenses")
    if not isinstance(defenses, list):
        errors.append("defenses: expected array")
        defenses = []
    for index, defense in enumerate(defenses):
        prefix = f"defenses[{index}]"
        if not isinstance(defense, dict):
            errors.append(f"{prefix}: expected object")
            continue
        for key in ("name", "product", "consequence"):
            if not nonempty(defense.get(key)):
                errors.append(f"{prefix}.{key}: expected non-empty string")
        if defense.get("mode") not in DEFENSE_MODES:
            errors.append(f"{prefix}.mode: invalid defense mode")
        require_strings(defense, "telemetry", errors, allow_empty=True)

    telemetry = require_object(data, "telemetry", errors)
    if telemetry.get("format") != "ndjson":
        errors.append("telemetry.format: expected ndjson")
    if not nonempty(telemetry.get("directory")):
        errors.append("telemetry.directory: expected non-empty string")
    require_strings(telemetry, "sources", errors)
    if not isinstance(telemetry.get("immutable_to_attacker"), bool):
        errors.append("telemetry.immutable_to_attacker: expected boolean")
    if telemetry.get("verification") not in {"advisory", "required"}:
        errors.append("telemetry.verification: invalid value")

    outcomes = require_object(data, "outcomes", errors)
    if not nonempty(outcomes.get("primary")):
        errors.append("outcomes.primary: expected non-empty string")
    require_strings(outcomes, "proof", errors)
    require_strings(outcomes, "safety_constraints", errors)
    if not nonempty(outcomes.get("availability_budget")):
        errors.append("outcomes.availability_budget: expected non-empty string")

    milestones = data.get("milestones")
    if not isinstance(milestones, list) or not milestones:
        errors.append("milestones: expected non-empty array")
        milestones = []
    points = 0.0
    milestone_ids: set[str] = set()
    for index, milestone in enumerate(milestones):
        prefix = f"milestones[{index}]"
        if not isinstance(milestone, dict):
            errors.append(f"{prefix}: expected object")
            continue
        for key in ("id", "label", "description"):
            if not nonempty(milestone.get(key)):
                errors.append(f"{prefix}.{key}: expected non-empty string")
        milestone_id = milestone.get("id")
        if milestone_id in milestone_ids:
            errors.append(f"{prefix}.id: duplicate milestone id {milestone_id!r}")
        elif isinstance(milestone_id, str):
            milestone_ids.add(milestone_id)
        value = milestone.get("points")
        if not isinstance(value, (int, float)) or isinstance(value, bool) or value <= 0:
            errors.append(f"{prefix}.points: expected positive number")
        else:
            points += value
        require_strings(milestone, "evidence", errors)
        if not isinstance(milestone.get("required"), bool):
            errors.append(f"{prefix}.required: expected boolean")
    if points != 100:
        errors.append(f"milestones: points must total 100, got {points:g}")

    variants = require_object(data, "variants", errors)
    for name, variant in variants.items():
        prefix = f"variants.{name}"
        if name not in {"vulnerable", "defended", "hardened"} or not isinstance(variant, dict):
            errors.append(f"{prefix}: invalid variant")
            continue
        if not nonempty(variant.get("compose")):
            errors.append(f"{prefix}.compose: expected non-empty string")
        if variant.get("defense_mode") not in DEFENSE_MODES:
            errors.append(f"{prefix}.defense_mode: invalid defense mode")
        if variant.get("expected_result") not in EXPECTED_RESULTS:
            errors.append(f"{prefix}.expected_result: invalid result")
    if variants.get("vulnerable", {}).get("expected_result") != "exploitable":
        errors.append("variants.vulnerable.expected_result: expected exploitable")

    randomization = require_object(data, "randomization", errors)
    if randomization.get("per_run_flag") is not True:
        errors.append("randomization.per_run_flag: must be true")
    for key in ("per_run_credentials", "per_run_routes"):
        if not isinstance(randomization.get(key), bool):
            errors.append(f"randomization.{key}: expected boolean")
    count = randomization.get("variants")
    if not isinstance(count, int) or isinstance(count, bool) or count < 1:
        errors.append("randomization.variants: expected positive integer")

    if not isinstance(data.get("services"), dict):
        errors.append("services: expected object")

    benchmark_dir = path.parents[1]
    if not (path.parent / "docker-compose.yml").is_file():
        errors.append("docker-compose.yml: missing")
    ground_truth = benchmark_dir / "expected_results" / "vulnerability.json"
    if not ground_truth.is_file():
        errors.append("expected_results/vulnerability.json: missing canonical ground truth")
    else:
        try:
            truth = json.loads(ground_truth.read_text())
            vulnerabilities = truth.get("vulnerabilities")
            if not isinstance(vulnerabilities, list) or not vulnerabilities:
                errors.append("ground truth: vulnerabilities must be a non-empty array")
        except (OSError, json.JSONDecodeError) as exc:
            errors.append(f"ground truth: invalid JSON: {exc}")

    return errors


def main() -> int:
    manifests = sorted(BENCHMARKS.glob("*/src/benchmark.json"))
    v2_count = 0
    failures = 0
    for manifest in manifests:
        try:
            is_v2 = json.loads(manifest.read_text()).get("schema_version") == "2.0"
        except (OSError, json.JSONDecodeError):
            is_v2 = False
        if not is_v2:
            continue
        v2_count += 1
        errors = validate_manifest(manifest)
        for error in errors:
            failures += 1
            print(f"ERROR {manifest.relative_to(ROOT)}: {error}")
    print(f"Validated {v2_count} v2 benchmark manifest(s): {failures} error(s)")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
