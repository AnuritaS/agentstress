# AgentStress

AgentStress investigates how the frequency and scope of human approval affect AI agent performance and oversight effectiveness.

This repository contains the research website and the analysis of the initial 21-response Ollama pilot. The trial explorer filters the seven scenarios by approval policy. All website assets are local; no analytics, model API keys, or server are required.

## Evidence

The recorded model tag is `qwen2.5:1.5b`. Seven synthetic scenarios were evaluated under three policies, with one response per pairing. The pilot measures single-step choices, not completed workflows or human review quality. Original exact-match scores are preserved; two autonomous answer keys require methodological review. See `evidence/evidence-report.md` for details.

The initial benchmark runner is not included in this source set. `evidence/analyze.py` reanalyzes the preserved log; it does not invoke models or execute agent actions.

## Reproduce the descriptive analysis

Run `python3 evidence/analyze.py` from the repository root. It uses only the standard library and generates `evidence/metrics.json` and `evidence/trial-audit.csv`. The original JSONL is in `evidence/data/`.

## Preview the website

Run `python3 -m http.server 8000` from the repository root, then visit http://localhost:8000. Opening index.html directly also works. No build is needed.

## GitHub Pages

Publish the `main` branch from `/ (root)` in repository Settings, Pages. `.nojekyll` enables direct static hosting. Relative asset paths support a project Pages URL. The website is intended for https://anuritas.github.io/agentstress/ once Pages has been enabled and its deployment completes.

## Planned next phase

An eight-week evaluation will expand toward 20 scenarios and three models, with six controlled workflow extensions and independent scholarly review. Human-participant research is outside the current funded scope. The selective-oversight hypothesis is a research question, not an established result.
