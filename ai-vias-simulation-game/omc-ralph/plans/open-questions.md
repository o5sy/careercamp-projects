# Open Questions

Tracked across all plans in `.omc/plans/`. Append; do not rewrite history.

## ralplan-ai-vias-simulation-game (PENDING APPROVAL) — 2026-09-12

Source: `.omc/plans/ralplan-ai-vias-simulation-game.md` §6 and §11. Every item below is routed through **S0.2** with a named owner, channel and deadline. Nothing engineering or arithmetic remains open; these all need a PRD author, a human content writer, or a playtest reading.

### Blocks the plan itself

- [ ] **Human approval of the plan.** — Both round-5 reviewers approved; implementation (ralph / team / start-work) must not begin until a human signs off.

### PRD-author decisions

- [ ] **OQ-12(ii) — should a run containing any raw send be eligible for `AI 네이티브`?** — The largest remaining gap between the letter of the thesis and the feel of it. Discriminators, cheapest first: run 14a (업무 72 / 보안 67, reached with only **two** bulk tool applications on card 2), run 14b (72 / 60, exactly on the shipped threshold), run 14 (72 / 68, the class maximum). Three closures written out: (α) structural rule R-h — the only one holding at every card count; (β) a score-only flat 보안 **69** at the default 6-card set; (γ) a per-card-count threshold triple. Owner: PRD author. Deadline: v0.4.
- [ ] **OQ-2 / OQ-3 / OQ-8 — the missing Day-9 slide content** (자료 13·15·16·20쪽). — Blocking before card authoring (S3.1a); the plan proposes all four bottom-up and marks them `// ASSUMPTION — 자료 미확인`, but OQ-2's risk taxonomy is now also R-g's coverage denominator.
- [ ] **OQ-12(i) — ratify R-f′ + R-g + θ = 0.7.** — Working resolution in place; the author is confirming the register, plus the one alternative the Planner cannot take (charging 거절, which breaks the PRD literal 전부 거절 → 보안 100).
- [ ] **OQ-10 — the exact firing condition of 「검증 없이 답변 제출」.** — Ships as reading (a) with (a′) evaluated and declined on stated arithmetic; run 10 is the discriminator; one predicate to reverse.
- [ ] **OQ-1 — do both gauges start at 0 (G2) or at a 100-point baseline (G1)?** — PRD §5 line 128 vs the 설계 의도. Proceeding on G2; reversal is a display-layer change.
- [ ] **OQ-6 / OQ-7 / OQ-9 — card ordering, boomerang ownership, and the 0-based index readings of "2회차 중반" / "3장째부터".** — Working assumptions ship; non-blocking.
- [ ] **Ratify the v0.1.5 부메랑 스파이크 stage** as a deliberate deviation from PRD §12's stage table.
- [ ] **Ratify §10's scope reduction:** "공유 가능하게" is not implementable on `file://`; save-as-PNG only.

### Human content decisions

- [ ] **OQ-4 — the full Korean copy set, 18 items.** — ~30 new lines plus ~29 inline replacement values and ~5–7 요약 sentences. Boot assertions catch *absence* but never *badness* (wrong order of magnitude, duplicate aliases, summaries that do not summarize). Needs a named content owner; estimated 3–3.5 person-days. Acceptance rubric: S5.5's four read-through questions.

### Playtest readings

- [ ] **OQ-5 — the 보안 ending threshold and θ's register.** — Threshold proposed at a flat 60, bounded below by the machine-computed admissible region; note that 69 would close the whole one-card class at N = 6 (OQ-12(ii) option β). θ = 0.7 is decided; only its *feel* is deferred — "2개까지는 봐주고 3개부터는 그대로 처리, 맞나?" Deadline: v0.4 gate steps 12(a)/12(b).
- [ ] **OQ-11 — six cards or four.** — PRD §13's own question; needs round-1-inclusive timing that does not exist until v0.4. Promoting any sub-6-card set costs §11 rows 11 and 14 (13/15) with named sign-offs, and re-running `auditCardSet()` clauses B, C and F. Note a trim also moves both frontiers and breaks the literal reproducibility of the PRD's 「전부 그대로 → 업무 90」 figure (75 at N = 5, 60 at N = 4).

### Known, accepted, not closed

- [ ] **Phone-width scroll depth on 200-token cards** — mitigated (stacked panes, line-per-clause layout, 44px targets) but not solved. Recorded honestly rather than claiming PRD §13's mobile item is retired.
