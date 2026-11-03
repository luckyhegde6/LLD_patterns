# LLD Patterns — Interview Learning Repository

A hands-on catalogue of Low-Level Design patterns and systems in TypeScript and Python. The repository helps engineers model a problem, explain design decisions, implement core behaviour, and evolve solutions toward production concerns.

## Start here

1. **[LLD Interview Problem-Solving Playbook](docs/LLD_INTERVIEW_PROBLEM_SOLVING.md)** — clarifying questions, entity discovery, relationships, class design, SOLID, patterns, edge cases, class and sequence diagrams.
2. **[Interview Guide](INTERVIEW_GUIDE.md)** — interview signals, communication strategy, and system-specific talking points.
3. **[60-minute Mock Interview](GUIDE.md)** — a sample senior-level interview flow.
4. **[Master Cheat Sheet](MASTER_LLD_CHEAT_SHEET_ONE_PAGE.md)** — rapid revision.

## Repository structure

- `Typescript/`: TypeScript implementations and tests.
- `Python/`: Python implementations, tests, design notes, and interview notes.
- `docs/`: reusable interview method, diagram source files, and visual assets.

## Universal LLD flow

Clarify → Model entities → Draw relationships → Walk the use case → Design classes → Apply SOLID → Add patterns when justified → Test edge cases → Explain trade-offs.

## Working principles

- Model domain rules before choosing frameworks.
- Keep domain logic independent from IO where practical.
- Prefer explicit invariants and intent-focused methods.
- Treat concurrency, retries, and partial failure as first-class design concerns.
- Use diagrams as communication aids, not substitutes for explaining trade-offs.
- Keep examples simple enough to understand and test.

See the TypeScript root scripts and `Python/README.md` for setup and test commands.

## Interview learning guides

## New senior-level implementation exercises

- [Workflow Orchestrator](Typescript/workflow-orchestrator/README.md) — sequential saga execution, checkpoints and reverse compensation (TypeScript + Python).
- [Webhook Delivery](Typescript/webhook-delivery/README.md) — HMAC signatures, retries, idempotent delivery and DLQ boundaries (TypeScript + Python).



- [LLD problem-solving playbook](docs/LLD_INTERVIEW_PROBLEM_SOLVING.md) — clarification, entities, relationships, class design, SOLID, patterns and edge cases.
- [Pattern-by-pattern interview guides](docs/pattern-guides/README.md) — all 16 systems with Mermaid class/sequence diagrams, questions, design rationale and edge-case checklists.

## Agentic coding and AI-assisted design

- [Agentic Coding, LLD Prompting and Fine-Tuning Guide](docs/AGENTIC_CODING_GUIDELINES.md) — coding harness workflow, safe tool use, prompt templates for adapting LLDs, and evaluation-first fine-tuning guidance.
- [Agent Platform: Scheduler, Tool Runtime and MCP](docs/AGENT_PLATFORM.md) — matching Python and TypeScript implementations with tests and documented production boundaries.


## Modern platform LLD exercises

See [Modern Platform LLD Catalog](docs/MODERN_PLATFORM_LLD_CATALOG.md) for TypeScript and Python exercises covering YouTube, WhatsApp, Twitter/X, Instagram, Uber/Rapido, food delivery, Netflix, Google Drive, Google Maps, search autocomplete, distributed logging and notification delivery. Each exercise includes a domain model, state lifecycle, patterns, implementation direction and test scenarios.
