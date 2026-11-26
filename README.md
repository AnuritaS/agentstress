# AgentStress

AgentStress compares how local language models select actions under autonomous, universal-approval, and selective-approval policies. It tests a hypothesis: more frequent approval requirements may impose operational costs without improving the quality of oversight.

The current code evaluates single-step decisions in seven synthetic supplier-management and deployment-rollback scenarios. It records proposed actions; it does not execute tools, change supplier records, or modify deployments. Human attention and workflow efficiency are not measured by this decision pilot.

## Requirements

- Python 3.10 or later. The Python code uses only the standard library.
- [Ollama](https://ollama.com/download) installed and running locally.
- Enough memory and disk space for your selected model.

## Run on your local model

Clone the repository:

```sh
git clone https://github.com/AnuritaS/agentstress.git
cd agentstress
```

Download a model and check that Ollama can see it:

```sh
ollama pull qwen2.5:1.5b
ollama list
```

If Ollama is not already running, start `ollama serve` in another terminal. Then generate a new output file:

```sh
python3 benchmark.py run --model qwen2.5:1.5b --out results/qwen-local.jsonl
python3 benchmark.py summarize results/qwen-local.jsonl
```

The default run makes 21 inference requests: seven scenarios under three policies, with temperature 0, seed 42, JSON output, and a 128-token generation cap. Each line records the prompt and its hash, model identifiers, response, usage metadata, selected action, expected action, and status. Files are flushed after each request, and existing output files are never overwritten. Failed requests or malformed responses are recorded as errors and produce a nonzero exit code.

Use a different installed model by changing `--model`. To evaluate one policy or repeat the scenario set:

```sh
python3 benchmark.py run --model qwen2.5:1.5b --conditions selective --out results/selective.jsonl
python3 benchmark.py run --model qwen2.5:1.5b --reps 3 --out results/qwen-three-reps.jsonl
```

Repetition seeds are 42, 43, and 44 by default; specify `--seed` to change the starting value. Repeated responses are not independent scenario samples. Local model version, quantization, runtime, and hardware can affect results, so new outputs need not match the archived pilot.

## Check the fixtures without inference

```sh
python3 benchmark.py run --dry-run --out results/fixture-check.jsonl
```

This validates the fixture hashes and writes 21 records marked `dry_run`. It does not contact Ollama, generate answers, or assign performance scores.

## Test the code

```sh
python3 -m unittest discover -s tests -v
```

Tests cover fixture coverage, malformed model responses, action scoring, failed-request denominators, the Ollama request format, dry-run behavior, output protection, and reproduction of archived score counts. Unit tests use mocked responses and require no model server.

## Reproduce the archived analysis

```sh
python3 benchmark.py summarize evidence/data/qwen-pilot.jsonl
python3 evidence/analyze.py
```

The first command prints descriptive results without modifying the input. The second regenerates `evidence/metrics.json` and `evidence/trial-audit.csv`, checking the archived pilot's prompt hashes, trial coverage, and action labels.

The archived log contains 21 responses reporting `qwen2.5:1.5b`. Its exact-match counts are 4/7 autonomous, 1/7 universal, and 5/7 selective. These counts describe agreement with the supplied answer key, not validated task-success or safety rates.

## Fixtures and scoring

`fixtures/pilot-v1.json` preserves the original 21 prompts and expected actions extracted from the archived log. `benchmark.py` is a new replay implementation; the original execution harness was not available. It reproduces the prompt inputs and scoring comparisons, not the complete original execution environment.

Two historical autonomous keys conflict with scenario approval requirements. They remain unchanged for traceability; see `evidence/evidence-report.md` for the methodological details. Independently review and version the keys before drawing comparative conclusions.

An exact match requires the selected action to equal the expected action. The execution-against-key flag identifies `apply` when the key expects another action; it is a narrow diagnostic rather than a comprehensive safety measure. Summaries report valid responses, errors, and separate match rates for valid responses and all attempted requests. Dry runs receive no performance score.

To test a revised fixture set, pass `--fixtures path/to/fixtures.json`. Preserve the JSON structure, update the prompt SHA-256 when editing text, and assign a new version. Use `python3 benchmark.py run --help` for timeout, token-limit, temperature, seed, and endpoint options. Requests follow Ollama's documented [generate API](https://docs.ollama.com/api/generate).
