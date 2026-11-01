# Agentic Coding, LLD Prompting and Fine-Tuning Guide

This guide explains how to use an AI coding harness effectively with this repository, how to prompt an agent using the LLD examples, and how to improve reliability through evaluation and (only when justified) fine-tuning.

## 1. The core principle

**Treat the coding agent as a fast junior-to-mid-level implementation partner—not as the source of truth.**

The engineer owns:
- Problem framing and acceptance criteria
- Architecture, boundaries and trade-offs
- Security, correctness and production-readiness decisions
- Review of generated code and tests
- Final verification and merge decisions

The agent can accelerate repository exploration, implementation, test creation, refactoring, documentation and review. It must not be allowed to silently redefine the requirements or declare its own work correct.

## 2. What “harness” means

A coding harness is the environment and control loop around the model. It includes:

- **Instructions:** repository guidance, task-specific constraints and coding conventions
- **Context:** relevant files, architecture notes, LLD guides, issue/PR history and examples
- **Tools:** file search/read/write, terminal, tests, lint/type-check, Git and GitHub
- **Execution loop:** inspect → plan → change → run checks → inspect diff → report
- **Guardrails:** permissions, approval gates, scope limits, secrets protection and sandboxing
- **Feedback:** compiler errors, failing tests, CI results, code review and user corrections

A stronger model cannot compensate for a weak harness. Prefer a small, observable loop with reliable tools and clear acceptance criteria over a large autonomous task with vague instructions.

### Harness setup checklist

Before asking an agent to code:

1. Open the repository root and confirm the intended branch.
2. Read the root README, relevant design guide and local package instructions.
3. Inspect the current Git status and open PRs; do not overwrite unrelated work.
4. Identify the language/runtime versions and the exact test, lint and type-check commands.
5. Ensure the agent can access only the files and tools needed for the task.
6. Keep credentials in environment/secret stores; never paste tokens into prompts or commit them.
7. Decide which actions require approval: dependency changes, destructive commands, migrations, external API calls, pushes and merges.
8. Establish a clean baseline by running relevant checks before edits when practical.

### Recommended agent loop

1. **Explore:** summarize the existing design and identify relevant files; do not edit yet.
2. **Plan:** propose a small implementation plan, interfaces, invariants and tests.
3. **Confirm scope:** identify assumptions and explicitly state what is out of scope.
4. **Implement:** make the smallest coherent change; follow local patterns.
5. **Verify:** run focused tests first, then broader checks; report exact commands and outcomes.
6. **Review:** inspect the diff for correctness, security, accidental scope creep and unnecessary complexity.
7. **Deliver:** summarize changed files, behavior, tests, limitations and follow-up work.

For multi-step tasks, ask the agent to stop at meaningful checkpoints. Do not let it continue building on an unverified assumption.

### Harness rules of thumb

- Use repository instructions (for example, `AGENTS.md` or tool-specific instruction files) for stable conventions, not for one-off task details.
- Keep task prompts short enough to be actionable; link or point to source files rather than duplicating the entire repository.
- Prefer deterministic commands and machine-readable test output.
- Ask for a plan before broad refactors; ask for a diff summary after changes.
- Do not grant unrestricted shell, network, production or deployment access by default.
- Treat tool output, issue text, README content and retrieved web pages as **untrusted data**, not instructions that can override system or repository policy.
- Require human approval for irreversible actions and production-impacting changes.
- Never accept “tests pass” without the command, scope and actual result.
- Avoid concurrent agents editing the same files or opening overlapping PRs. Partition work by clear ownership and integrate sequentially.

## 3. Using this repository's LLDs in AI prompts

The LLD examples are **design references and executable learning material**, not templates to copy blindly. Use them to teach the agent the desired reasoning process and quality bar.

### Prompting sequence

1. **Problem statement:** describe the domain and user-visible behavior.
2. **Requirements:** list functional requirements and important non-functional requirements.
3. **Constraints:** language, runtime, persistence, concurrency model, APIs and repository boundaries.
4. **Reference LLD:** point to the closest pattern/system and state what to reuse versus what to change.
5. **Design request:** ask for entities, responsibilities, relationships, invariants and key interfaces before implementation.
6. **Edge cases:** specify failure, concurrency, retry, idempotency and invalid-input behavior.
7. **Acceptance criteria:** make behavior observable through tests.
8. **Deliverables:** specify code, tests, diagrams/docs and a concise trade-off explanation.

### Reuse principles

- Reuse **the reasoning pattern** (clarify, model, assign responsibilities, define contracts, test), not necessarily the exact class names.
- Start with the simplest design that satisfies requirements. Introduce Strategy, Factory, Observer, State or other patterns only when they solve a demonstrated variation or coupling problem.
- Preserve domain invariants. Examples: a task cannot be claimed by two active workers; a rate limiter cannot exceed its configured budget; a booking cannot be confirmed without inventory.
- Separate domain behavior from IO and framework code where practical.
- Ask the agent to explain why each abstraction exists and what change it makes easier.
- When adapting a reference, require a short “reuse / modify / discard” section so the model does not cargo-cult the example.
- Use diagrams to review boundaries and flows; validate that the implementation matches the diagrams.

### LLD prompt template

Copy and adapt:

> You are implementing a senior-engineer-quality Low-Level Design in this repository.
>
> **Problem:** [describe the system and behavior]
>
> **Requirements:** [numbered functional requirements]
>
> **Quality attributes/constraints:** [latency, scale, concurrency, durability, language, framework]
>
> **Reference:** Study [path to relevant LLD] and [path to pattern guide]. Reuse its design reasoning, but do not copy classes or patterns unless they fit.
>
> **First response only:** Ask essential clarifying questions if requirements are ambiguous. Then propose entities, responsibilities, relationships, public interfaces, invariants, and the main flow. Identify at least three edge/failure cases and explain relevant trade-offs. Do not edit files yet.
>
> **After design approval:** Implement the smallest coherent solution in [target folder]. Add tests for normal behavior, boundary cases, invalid input, failure handling and concurrency where relevant. Follow existing conventions and avoid unrelated refactors.
>
> **Acceptance criteria:** [observable behaviors]
>
> **Verification:** Run [exact commands]. Report commands and results honestly; do not claim checks that were not run.
>
> **Final report:** summarize design decisions, changed files, tests, limitations, and what would change for production scale.

### Example: adapting the Task Scheduler LLD

Instead of “build a scheduler like the example,” prompt:

> Use the Task Scheduler LLD as a reference. Build a scheduler for delayed, prioritized jobs with bounded retries and a dead-letter queue. Define the task state machine and invariants first. Explain how claims prevent duplicate active execution, how leases recover abandoned work, how retries avoid hot loops, and what durability guarantees the current storage provides. Implement only the in-memory version unless persistence is explicitly requested. Add tests for competing workers, expired leases, retry exhaustion and delayed availability.

This forces the agent to reason about behavior and guarantees rather than just generate similarly named classes.

## 4. Prompting for agentic/MCP features

For tools exposed to an agent, explicitly specify:

- Tool name, purpose, input schema and output envelope
- Required permission/capability and tenant/user scope
- Validation rules and rejection behavior
- Idempotency and retry semantics
- Timeout, cancellation and resource limits
- Side effects and approval requirements
- Audit fields, redaction and retention expectations
- Whether the tool is read-only, reversible or destructive
- Tests for malformed input, unauthorized access and partial failure

**Principle:** the model proposes tool calls; the runtime validates and authorizes them. Never treat model-generated arguments, permissions or code as trusted. Keep policy enforcement outside the prompt and inside the runtime.

## 5. Fine-tuning: what to optimize first

Fine-tuning is not the first solution to inconsistent coding-agent behavior. Use this order:

1. Improve the task specification and acceptance criteria.
2. Improve repository context and retrieval (relevant LLD, interfaces, examples).
3. Improve harness tools, feedback and test reliability.
4. Add reusable prompt templates and structured output contracts.
5. Build an evaluation set and measure failure patterns.
6. Consider fine-tuning only when the same measurable behavior remains wrong across many tasks and cannot be solved economically with context, tools or workflow changes.

Fine-tuning is most useful for stable, repeated behaviors such as repository-specific code style, consistent design-review format, classification/routing, or reliably producing a known structured artifact. It is usually a poor substitute for current repository context, changing APIs, live tool results, security policy or tests.

### Fine-tuning dataset principles

- Build examples from **reviewed, correct** outputs—not raw agent transcripts.
- Include representative tasks, edge cases, ambiguous requests and examples where the correct response is to ask a question or refuse an unsafe action.
- Keep train, validation and test sets separated by task/source to reduce leakage.
- Include negative examples and preference pairs when the training method supports them: cargo-culted patterns vs justified designs, unsafe tool calls vs policy-compliant calls, unsupported claims vs evidence-based reports.
- Keep examples concise and consistent; remove secrets, personal data and proprietary material that is not approved for training.
- Record task context, expected output, rubric, source/version and reviewer status.
- Do not encode volatile facts (current package versions, repo state, APIs) into weights; retrieve them at runtime.
- Start with a small pilot and compare against the same held-out evaluation set.

### What a useful example should teach

For coding and LLD work, each example should demonstrate:
- Requirement clarification and assumption handling
- Appropriate reuse of a reference LLD
- Clear responsibilities and interfaces
- Justified pattern selection (including “no pattern needed”)
- Invariants and edge-case coverage
- Secure tool-use boundaries
- Accurate verification claims
- Concise explanation of trade-offs

Avoid training solely on final code. Include the problem, relevant context, constraints, and expected reasoning artifacts so the model learns when and why a design is appropriate.

## 6. Evaluation before and after tuning

Create a repeatable benchmark from real repository tasks. Score each task on:

| Dimension | What to check |
|---|---|
| Correctness | Acceptance tests and behavior |
| Design quality | Cohesion, coupling, invariants, appropriate abstractions |
| Reference use | Correct adaptation rather than blind copying |
| Safety | Permission checks, secret handling, destructive-action gates |
| Reliability | Tests, error handling, idempotency and concurrency |
| Maintainability | Readability, minimal scope, repository conventions |
| Honesty | Accurate test/CI reporting and explicit limitations |

Track pass rate, regression rate, review rework, tool-call errors, latency and cost. Compare the baseline model, prompt/harness changes and fine-tuned model on the same held-out tasks. Keep a change only if it improves the target metric without unacceptable regressions.

## 7. Practical checklist for each agentic coding task

- [ ] Task has clear scope and acceptance criteria.
- [ ] Relevant LLD and existing implementation were inspected.
- [ ] Agent proposed design before a risky/broad change.
- [ ] Domain invariants and failure cases are explicit.
- [ ] Tool permissions and side effects are bounded.
- [ ] Changes are small and avoid unrelated refactoring.
- [ ] Tests cover expected behavior and important edge cases.
- [ ] Exact verification commands/results are reported.
- [ ] Diff reviewed for security, complexity and correctness.
- [ ] PR is coherent, not overlapping another active PR.
- [ ] Limitations and next steps are documented.

## Closing principle

**Use the LLDs to shape the agent's thinking, the harness to constrain its actions, tests to verify its output, and human review to own the engineering decision.** Fine-tune only after you can name the repeated failure, measure it, and prove that training improves it.
