<!-- Sync Impact Report
Version change: template placeholders -> 1.0.0
Modified principles: template placeholders -> Encounter Constitution principles
Added sections: Engineering Standards; Delivery Workflow
Removed sections: none
Templates updated: ✅ .specify/templates/plan-template.md; ✅ .specify/templates/spec-template.md; ✅ .specify/templates/tasks-template.md
Follow-up TODOs: none
-->

# Encounter Constitution

## Core Principles

### I. Code Quality First

All production changes MUST be readable, maintainable, and locally coherent. Code MUST use the smallest
reasonable abstraction, avoid duplicated logic when a shared helper clearly reduces risk, and preserve the
existing architecture unless there is a documented reason to change it. New behavior MUST include concise
comments only when the intent is not obvious from the code itself.

### II. Test-Driven Verification

Behavioral changes MUST be covered by automated tests before they are considered complete. Bug fixes MUST
include a regression test that fails before the fix and passes after it. The default test strategy is the
cheapest test that can prove the behavior, escalating to integration or end-to-end coverage when a change
crosses module boundaries, affects contracts, or carries user-visible risk.

### III. User Experience Consistency

User-facing work MUST match the product's existing interaction patterns, terminology, visual language, and
error handling unless a deliberate, reviewed change is required. New UI states, copy, and workflows MUST be
consistent across surfaces, and any deviation MUST be justified with a documented user benefit and validated
with the same rigor as the underlying code change.

### IV. Performance Budgets Are Mandatory

Every feature that can affect responsiveness, throughput, rendering, memory, or bundle size MUST define a
measurable target before implementation. Implementations MUST stay within agreed budgets or explicitly record
the tradeoff and mitigation. If a feature lacks a stated performance target, the default expectation is that
it must not regress existing behavior under normal usage.

### V. Scope Discipline and Simplicity

Choose the simplest solution that fully satisfies the requirement. New dependencies, abstraction layers, and
cross-cutting patterns MUST be justified by a concrete reduction in complexity, risk, or repeated effort.
Speculative generalization is not acceptable; every addition must earn its place through a current need.

## Engineering Standards

All implementation work MUST pass the repository's configured lint, formatting, type-check, and automated test
gates before merge. User-facing changes MUST preserve accessibility and interaction consistency where those
concerns exist in the product. Any new public API, data shape, or persistent state MUST include explicit
validation, compatibility notes, or a migration plan when backward compatibility is at risk.

## Delivery Workflow

Each feature spec MUST state the intended test approach, relevant user experience expectations, and any
measurable performance constraint that applies. Implementation plans MUST include a constitution check that
confirms code quality, testing coverage, UX consistency, and performance budgets are addressed. Reviewers MUST
reject work that depends on undocumented assumptions, lacks a regression test for changed behavior, or leaves
an explicit performance concern unresolved.

## Governance

This constitution supersedes conflicting project guidance. Amendments require a documented rationale, a
version bump, and updates to dependent templates when the change affects authored workflow. Versioning follows
semantic versioning: MAJOR for breaking principle or governance changes, MINOR for new principles or materially
expanded guidance, and PATCH for clarifications or wording-only changes. Every plan, spec, and task set MUST
be reviewed against the current constitution before it is considered ready.

**Version**: 1.0.0 | **Ratified**: 2026-06-02 | **Last Amended**: 2026-06-02
