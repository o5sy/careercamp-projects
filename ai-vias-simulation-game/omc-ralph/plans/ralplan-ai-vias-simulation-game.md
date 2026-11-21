# RALPLAN — 「우리는 우리가 넣은 대로 된다」 구현 계획 (FINAL, PENDING APPROVAL)

> # ⚠ STATUS: **PENDING APPROVAL — AWAITING HUMAN REVIEW**
>
> **This is a planning artifact only. No implementation may begin from it.**
>
> - **Approval state:** approved *in substance* by **both** independent round-5 reviewers — the round-5 **Architect** review and the round-5 **Critic** review, each run without sight of the other. Both recommended approval; **neither found a blocking defect.** This file merges their accepted (non-blocking) improvement suggestions into the approved draft.
> - **Awaiting:** an explicit **human** approval decision. Until a human says so in writing, **`/oh-my-claudecode:ralph`, `/oh-my-claudecode:team`, `/oh-my-claudecode:start-work`, `/oh-my-claudecode:autopilot` and every other execution lane are OUT OF BOUNDS for this plan.** Do not create `index.html`. Do not write game code. Do not begin S0.1.
> - **Process:** produced by a **5-round OMC `ralplan` Planner → Architect → Critic consensus loop** (the 5-round cap was reached and used in full). Drafts v1–v5 are retained untouched under `.omc/drafts/` as the audit trail; this file is the filed successor to `.omc/drafts/ralplan-draft-v5.md`.
> - **What a human is being asked to approve:** (a) the build plan and its stage gates; (b) the **supplied rules** the PRD does not contain (they are marked as such throughout — R-f′, R-g/θ, the two-turn boomerang delay, the per-request security award, reading (a) of 검증없이제출); (c) the **disclosed, deliberately-unclosed residual** described in §0.4 and §2.6.6; and (d) the routed open questions in §6, several of which need the **PRD author**, not an engineer.
> - **Filed:** 2026-09-12. Owner of the approval decision: the project lead / PRD author.

> Planner phase output, **iteration 5 (final iteration of the 5-round consensus cap)**, for the consensus Planner/Architect/Critic loop.
> Supersedes `.omc/drafts/ralplan-draft-v4.md`, `-v3.md`, `-v2.md` and `-v1.md` (all kept untouched for the audit trail).
> Sources of truth (read in full, no paraphrase from elsewhere): `docs/PRD.md`, `docs/overview.md`.
> Revised in response to **two independent round-4 reviews** of v4 — an Architect review and a Critic review, run without sight of each other. **Both converged, independently and by exhaustive enumeration rather than spot-check, on the same root-cause diagnosis**, which is why this iteration's fix targets that root cause rather than patching around it again.
>
> **Mode: SHORT overall, with the gauge/grading/necessity model (§2.5–§2.6) at DELIBERATE.** §2.6.6 states the game's central thesis as a **normative necessity constraint** and discharges it by exhaustive enumeration over the whole outcome space, at every shippable card count, **now including the minimal-masking subspace v4's audit was structurally blind to**. §2.5–§2.6 therefore carry competing options, arithmetic recomputed from first principles for **fourteen** reference runs on **both** axes, **two** machine-checked frontiers, and a 3-scenario pre-mortem. Everything else stays SHORT.
>
> **What is different in v5, in one paragraph.** v4 closed a zero-masking exploit with **R-f′** (a raw send forfeits that turn's baseline award) and both round-4 reviewers confirmed that rule works *as far as it goes*. But both also found, independently, that R-f′ **relocated** the exploit rather than closing it: because R-f′ tied baseline-forfeiture to the same **existence test** (`neutralized.size === 0`) that decided the masking grade, a **single mask click on a single risk token anywhere in a card** was worth the whole forfeited baseline chunk (~29–37 points), even with 7 of that card's 8 risk tokens still sent in the clear. At **1–2 clicks** the target ending `AI 네이티브` was reachable at every shippable card count; at **3 clicks** a near-zero-effort run reached a *perfect displayed 보안 of 100*, visually indistinguishable from a careful player's ending. v4's own audit (`auditCardSet()` clause B) enumerated only the *strictly-zero-masking* subspace and would have passed green on that build. v5 fixes **the grade boundary itself**: `raw` vs `partial` is now a **coverage test** (`neutralized / riskKey < θ → raw`) with **θ = 0.7**, derived rather than guessed (§2.6.3). Both frontiers are recomputed from scratch at N = 6/5/4; the minimal-masking exploit now scores **identically to zero masking, by construction**, and is closed with margins **29 / 10 / 20**. Alongside that: `auditCardSet()` clause B's enumeration domain is stated completely and widened to the whole sub-θ space, a new clause B2 records the one-card frontier, and a new clause F machine-checks the coverage band; the undefined **직책 map** is deleted and 익명화 replacement text becomes mandatory inline authoring for *every* applicable risk type; the `129,000만원 → 약 10만원대 후반` worked example (off by ~4 orders of magnitude) is corrected. **Changelog against v4 is in §10.**

---

## 0. Summary for the approving human

*This section was added when the plan was filed. It exists so a reviewer who did not sit through the five consensus rounds can understand what they are approving in about five minutes. Everything below is a condensation of §§1–10; where the two disagree, §§1–10 are authoritative.*

### 0.1 What this plan builds

A **single, dependency-free `index.html`** — vanilla JS, inline CSS, no framework, no CDN, no build step, no npm — that runs correctly when double-clicked from disk (`file://`). It delivers a **~7-minute Korean-language educational browser game**, 「우리는 우리가 넣은 대로 된다」, teaching the Day-9 안전 3습관: **멈추기 · 가리기 · 확인하기**. Structurally it is modeled on *We Become What We Behold* (Nicky Case): the player's own careless actions feed a system, and the changed system comes back at them.

The game is **two rounds over the same six documents**:

- **Round 1 · 프롤로그 (≈2분).** No tools, no gauges, no warnings. The player drags four original documents wholesale into an AI window and is praised for being fast. Then the screen darkens, time passes, and **two boomerangs land**: a customer's name and phone number from card 1 surfaces in a *stranger's* AI window as `김OO 010-1234-XXXX`; and a statistic the AI fabricated on card 3 becomes a news article that the AI then cites back as a source. A 파국 visual floods every speech bubble, everything goes silent, and the screen freezes on one line: **"다시 해보시겠습니까?"**
- **Round 2 · 본편 「AI 안전 관제실」 (≈5분).** The same day repeats with the tools open: dual **업무 완수 / 보안** gauges, six request cards, four masking techniques (익명화 · 마스킹 · 요약 · 가상데이터), four verification tools, a 멈추기 confirmation modal, and a hidden ⚙ setting. The cards that blew up in round 1 return with **byte-identical AI answer text** — that recognition beat ("아, 이거 아까 그거다") is the actual learning moment. The run ends in a 2×2 ending (`AI 네이티브` / `유출 사고` / `안전한 무능` / `최악`) plus a personalized 내 직무 안전 카드 the player can save as a PNG, and a copyable four-line verification-prompt cheat sheet.

### 0.2 The staged build plan (v0.0 → v1.0)

Seven stages, each ending in a **human go/no-go gate** phrased as the PRD's own "확인할 것" question (§4 Implementation Steps, §7 Verification Steps). There is no test framework and none may be added, so verification is manual playthrough plus **in-file boot audits** for the claims no playthrough can check.

| Stage | Ships | Gate question |
| --- | --- | --- |
| **v0.0** | No code — everyone plays the reference game; the PRD-author escalation packet (S0.2) is sent | has everyone who will touch the boomerang played it? |
| **v0.1** | One round-2 card, click-toggle judgment, both gauges | 게이지 규칙이 재미있는가 |
| **v0.1.5** | **부메랑 스파이크** — the single riskiest beat, prototyped early | **부메랑 순간에 소름이 돋는가** (the PRD's 최대 관문, deliberately asked at stage 3 of 7 instead of stage 6) |
| **v0.2** | Masking editor, 4 tools, card 2 and a minimal card 4 | 클릭 토글 조작이 답답하지 않은가 |
| **v0.3** | All 6 cards, 환각 밑줄, verification tools, modal, hidden ⚙, the boot audit | 5분에 끝나는가 |
| **v0.4** | Round-1 prologue, the montage, both boomerangs, 파국, the interstitial | 부메랑이 쌓여서 설득력을 갖는가 |
| **v1.0** | Ending quadrants, safety card, PNG save, prompt copy, §11 대응표 audit | 다 하고 나서 뭘 얻었다는 느낌이 드는가 |

The one deliberate deviation from the PRD's own stage table is **v0.1.5**, inserted so the product's highest-risk element is answered while it is still cheap to change. It is flagged for ratification (§6, item 10).

### 0.3 An honest account of the 5-round consensus process

The plan went through five Planner → Architect → Critic rounds. It is worth stating plainly what that found, because the value of this artifact is mostly in what the early drafts got *wrong*.

**The PRD's central thesis is a claim that can be false.** PRD line 146 and `overview.md` line 51 assert that **masking is the only path to both gauges** — that you cannot get a high 업무 score and a high 보안 score without actually 가리기-ing (masking) the sensitive content. Three separate rounds found that the drafted rules made that assertion **false**, each time in a new place:

- **v3** — a player who masked *nothing at all* could reach the target `AI 네이티브` ending. Fixed in v4 by **R-f′**: a raw (unmasked) send forfeits that turn's security baseline award.
- **v4** — both round-4 reviewers independently showed, by exhaustive enumeration rather than spot-checking, that R-f′ had **relocated** the exploit rather than closed it. Because R-f′ keyed off the same *existence* test (`any token masked at all?`) that decided the masking grade, **one mask click on one token** was worth the entire forfeited baseline (~29–37 points) while 7 of that card's 8 risk tokens still went out in the clear. At 1–2 clicks the target ending was reachable at every card count; at **3 clicks** a near-zero-effort run reached a *perfect displayed 보안 of 100*, visually identical to a careful player's ending. Worse, **v4's own machine audit was structurally blind to the entire class** — it enumerated only the strictly-zero-masking case.
- **v5 (this plan)** — fixes the **grade boundary itself** rather than the payout: `raw` vs `partial` is now a **coverage test** (`neutralized ÷ riskKey < θ → raw`) with **θ = 0.7**, derived from the shipped content's own structure rather than guessed. In shipped terms: *3개 이상 놓치면 안 가린 것과 같다.* The minimal-masking exploit now scores **identically to zero masking by construction**, and both frontiers are closed at every shippable card count with margins **29 / 10 / 20**. The audit's enumeration domain is written out in full and widened; two new audit clauses (B2, F) were added; and the generalized lesson was recorded as **Principle 8** so the next iteration does not re-patch a reward instead of a predicate.

Two other classes of defect were found and fixed along the way: **content the plan assumed existed somewhere and did not** (v4 routed 익명화 through a derived transform referencing a "직책 map" that was defined nowhere, and designated it for two risk types it cannot handle — fixed by making every replacement string mandatory inline authoring, boot-asserted); and **worked examples that were arithmetically wrong** (a 가상데이터 example off by ~4 orders of magnitude — `129,000만원`, i.e. 1.29 billion won, replaced by a value meaning ~180,000 won).

**Round 5 approved.** Both reviewers re-derived the scoring arithmetic independently, confirmed the fourteen reference runs, confirmed both machine-checked frontiers, and recommended approval with no blocking defect. Their accepted non-blocking corrections — two prose/disclosure-accuracy corrections from the Critic and four minor additions from the Architect — are merged into this file and listed in §10's round-5 changelog.

### 0.4 What genuinely remains open — and who has to answer it

Nothing engineering or arithmetic is left open. What remains needs a **PRD author**, a **human content writer**, or a **playtest reading**. The complete routed list is §6 and §10's closing section; the items a human should actually decide before or during implementation are:

1. **OQ-12(ii) — the one real product judgment.** A run that masks **one** card properly, rejects two requests and sends **two documents wholesale** still reaches the top `AI 네이티브` ending. The plan **discloses** this rather than hiding it, records it mechanically in the boot audit (clause B2) so it cannot drift silently, and routes the decision. The cheapest known members of this class are worked out in §2.6.5 (two masking gestures on card 2 → 72/67; three on card 6 → 72/60, exactly on the boundary). The available closures — a structural rule **R-h** ("any run containing a raw send is ineligible for `AI 네이티브`"), or a score-based threshold that works at the default 6-card count but not as one flat number across all card counts — are written out with their costs. **Two defensible answers; this is not the Planner's call.**
2. **Missing slide content (OQ-2 / OQ-3 / OQ-8).** 자료 13쪽 (5대 위험 신호), 15쪽 (직무별 조심할 것), 16쪽 (Before/After 프롬프트), 20쪽 (환각 5대 위험지점) are not in this repo. The plan proposes all of them bottom-up from the cards themselves and marks each `// ASSUMPTION — 자료 미확인`, but they are **blocking before card authoring (S3.1a)** if the author wants the real taxonomies to ship.
3. **The Korean copy set (OQ-4, 18 items).** ~30 new lines plus **~29 inline replacement values** and ~5–7 요약 sentences. Absence is a boot error; **badness is not** — a replacement can be present and still be the wrong order of magnitude or a duplicate alias. Estimated **3–3.5 person-days of Korean writing**, the single largest work item in the build, and it needs a named human content owner.
4. **Two numbers deferred to real play (OQ-5).** The 보안 ending threshold (proposed 60, bounded below by the machine-computed admissible region) and whether R-g's register — *2개까지는 봐주고 3개부터는 그대로 처리* — feels fair in the hand.
5. **OQ-10 — the reading of 「검증 없이 답변 제출」.** The plan ships reading (a) with the alternative evaluated and declined on a stated arithmetic basis. One predicate to reverse.
6. **OQ-11 — six cards or four.** The PRD's own open question, decided at the v0.4 gate on real timing data; promoting any sub-6-card set costs two §11 rows and needs a named sign-off.

---

## 1. Requirements Summary

### 1.1 What is being built

A single, dependency-free HTML file that delivers a ~7 minute educational browser game teaching the Day 9 "안전 3습관 — 멈추기 · 가리기 · 확인하기". Structure is modeled on *We Become What We Behold* (Nicky Case): the player's own actions feed a system, and the changed system comes back at the player.

Two rounds:

- **Round 1 · 프롤로그 「그냥 붙여넣는 하루」 (2분)** — no tools, no gauges, no warnings. 4 requests (cards 1–4). Player drags originals wholesale into the AI window and is praised for speed. Screen darkens, time passes, then **two boomerangs**: (1) the customer name/number from card 1 appears in a stranger's AI window as `김OO 010-1234-XXXX`; (2) the fabricated statistic from card 3 becomes a news article, and the AI then cites that article back. The 파국 visual (every speech bubble on screen filling with AI-generated text) plays here. Screen freezes on one line: **"다시 해보시겠습니까?"**
- **Round 2 · 본편 「AI 안전 관제실」 (5분)** — same day repeats, tools now open. Dual gauges `업무 완수` / `보안`. 6 request cards (the 4 from round 1 + cards 5, 6). The requests that blew up in round 1 return **with byte-identical answer text** (AC-3.10) — that recognition ("아, 이거 아까 그거다") is the learning moment.

### 1.2 Hard constraints (PRD §12 기술 스택) — non-negotiable

- **One HTML file** (`index.html`). Vanilla JS. **Zero external dependencies**: no framework, no CDN library, no build step, no bundler, no npm. HTML + CSS + JS all inline in that one file.
- Must run correctly when opened directly from disk (`file://`), with no local server. This rules out ES-module cross-file imports, `fetch()` of sibling assets, and any external font/image/audio file.
- PRD §12 explicitly permits replacing drag-select with **단어 단위 클릭 토글** if drag is too costly — "학습 효과는 거의 동일하다". This plan takes that option **for the three graded mechanics only**; the ungraded round-1 paste gesture stays a real drag. See §2.3 Decision B.
- All UI text in Korean. Where the PRD gives exact wording, that wording ships verbatim — see AC-1.4.

### 1.3 Mechanics that must all be accounted for

| # | Mechanic | PRD source |
| --- | --- | --- |
| M1 | 위험 요소 클릭 — find and click risky items inside the prompt | §4 table row 1 (→ 5대 위험 신호, 자료 13쪽) |
| M2 | 마스킹 에디터 — 익명화 · 마스킹 · 요약 · 가상데이터 | §4 row 2 (→ 가리는 4기법, 14쪽) |
| M3 | 의심 구간 밑줄 — underline 수치 · 출처 · 고유명사 in the AI answer | §4 row 3 (→ 환각 5대 위험지점, 20쪽) |
| M4 | 검증 도구 카드 — 근거요구 · 원문대조 · 교차확인 · 자가검토, **턴당 2개만** | §4 row 4 (→ 4대 검증법, 22쪽) |
| G | 이중 게이지 with the exact §5 delta table | §5 |
| C | 6 request cards, each `[상황 · 원본 · 위험요소 · 1회차 결과 · 2회차 정답]` | §6 |
| B | 확신 배지 규칙 — 오답/환각은 **항상** `⭐ 확실합니다` 뒤에 숨김 (authoring rule, not a mechanism) | §8 |
| A1 | 멈추기 확인창 — round 2 only, before every send, `다시 묻지 않기` unlocks from the 3rd **card** | §9(1) |
| A2 | 무료 플랜 표시 + 숨겨진 ⚙ 설정 (`대화 내용을 학습에 사용`, default ON) → 끄면 보안 +10 | §9(2) |
| R | 요청 거절 — a first-class send outcome with its own UI affordance | §5 row 2 |
| E | 2×2 엔딩 + 내 직무 안전 카드 + 검증 프롬프트 복사 버튼 | §10 |
| L | 화면 구성 per the §7 ASCII wireframe | §7 |

> **Note on §4's "4 mechanisms in difficulty order".** §4's ordering is not four per-card tiers. It decomposes into **two orthogonal facts**:
>
> - **One unlock boundary.** Cards *before* card 3 expose **M1 + M2** only. Cards from card 3 (the 전환점) onward expose **M1 + M2 + M3 + M4**. This is a *position* rule, announced narratively at the 전환점, identical for every card after it.
> - **Two content tiers.** **Tier A** = the card's answer contains **no** genuine hallucination span (cards 1, 2, 4). **Tier B** = the answer contains **exactly 2** (cards 3, 5, 6). Tier is a property of authored content, drives grading only (AC-5.7, AC-5.9, AC-5.10), and **never** drives UI.
>
> The two are deliberately *not* aligned: card 4 is tier A but sits after the unlock, so it exposes the full toolbar while containing nothing genuine to find. That non-alignment is load-bearing — it is what stops "the verification toolbar is visible" from being a perfect tell for "this answer is fabricated" (AC-5.10, and see §2.9.3).

### 1.4 §5 scoring table — reproduced exactly (single source of truth for `SCORE`)

| 플레이어 행동 | 업무 완수 | 보안 |
| --- | --- | --- |
| 요청을 그대로 처리 | +15 | **-20** |
| 요청을 거절 | **0** | 0 |
| 가려서 처리 (정답) | **+15** | **0** |
| 가리다 일부 놓침 | +15 | -8 |
| 검증 없이 답변 제출 | +15 | 후반 **-25** (부메랑) |
| 검증 도구 1개 사용 | **-3** (시간 소모) | — |
| 환각을 잡아냄 | +5 | +5 |

Plus §9(2): 숨겨진 설정 끄기 → 보안 **+10**.

These numbers are frozen. No implementation step may alter, round, scale, or "balance" them without an explicit PRD change.

**Structural reading of this table.** The seven rows are not seven independent additive events. They are two different field types:

- **Rows 1–5 are a single mutually-exclusive `sendOutcome` per completed request.** Exactly one of them fires per turn, and exactly one 업무 completion award (+15, or 0 for 거절) is granted per turn.
- Row 5 (**검증 없이 답변 제출**) is not a sixth independent award. Its `+15` is a *restatement* of the same completion award already granted by row 1/3/4 — the row exists to say "you still get paid for the work." Its only distinct payload is the deferred **보안 -25**. Treating it as additive produces 업무 = 180 on a paste-everything run instead of the PRD's own stated 90.
- **Rows 6–7 and the §9(2) bonus are additive modifiers**, stacking on top of whichever send outcome fired: `검증 도구 1개 사용` (업무 −3, per tool, ≤2/turn), `환각을 잡아냄` (업무 +5 / 보안 +5, **per genuine span caught**, ≤2/turn via the tool cap), `숨겨진 설정 끄기` (보안 +10, once per game).

This exclusivity rule is normative (AC-4.2a) and `applyScore` must be **structurally incapable** of awarding two completion deltas in one turn (AC-4.2b).

> **A note the whole plan turns on.** §5 names four *send* outcomes but defines the boundary between only two of them by name — `가려서 처리 (정답)` vs `가리다 일부 놓침` vs `요청을 그대로 처리`. **Where exactly "가리다 일부 놓침" ends and "그대로 처리" begins is not in the PRD.** v2–v4 supplied an **existence test** ("at least one token neutralized → 일부 놓침"). Round 4 proved that reading makes the PRD's own 설계 의도 line 146 false, at one click. §2.6.3 replaces it with a **coverage test** and derives the threshold from the shipped content rather than choosing it by taste.

> **What row 5 means is settled in §2.6.1** (reading (a), unchanged since v3 and re-confirmed by every review round since). **What the table's own 설계 의도 line 146 means is settled in §2.6.6.**

### 1.5 §11 강의 자료 대응표 — completeness checklist (all 15 rows must be claimed by a step)

| Day 9 자료 | 게임 내 구현 위치 (PRD) | Covered by step |
| --- | --- | --- |
| 안전 3습관 (멈추기·가리기·확인하기) | 게임 전체 3층 구조 | 멈추기 = S3.4 (확인창); 가리기 = S2.1 (마스킹 에디터); 확인하기 = S3.3 (검증 도구); 요약 = S5.2 (엔딩 카드) |
| 데이터 흐름 — 입력은 남는다 (7쪽) | 붙여넣은 텍스트가 AI 안에 점으로 쌓이는 연출 | S1.5 (dot reservoir), S4.2; round-2 accumulation: AC-4.11 |
| 무료·유료·기업용 정책 차이 (8쪽) | 플랜 표시 + 숨겨진 설정 아이콘 | S3.5 |
| 사고는 이렇게 난다 (9쪽) | 1회차 프롤로그 전체 | S4.1 |
| "밖에 나가도 괜찮은 걸까?" (10쪽) | 2회차 전송 확인창 | S3.4 |
| 올려도 되는 것/안 되는 것 (12쪽) | 카드 1·2·3·4 판정 | S1.3, S2.2, S3.1a |
| 5대 위험 신호 (13쪽) | 위험 요소 클릭 메커니즘의 정답 키 | S1.3 (**OQ-2** — assumption) |
| 가리는 4기법 (14쪽) | 마스킹 에디터의 도구 4개 | S2.1, audited by **AC-9.3** (non-existence check) |
| 직무별 조심할 것 (15쪽) | 엔딩 직무 안전 카드 | S5.2 (**OQ-8** — slide content not in repo) |
| Before/After 프롬프트 (16쪽) | 각 카드의 피드백 문구 | S1.6 (card 1), S2.2 (card 2), S3.1c (cards 3–6, newly authored — AC-5.8) (**OQ-8**) |
| **O/X 판단 게임 (17쪽) — 2회차 요청 카드 6장** | 2회차 요청 카드 6장 | S3.1a/b — **breaks under R15 rungs ② and ③** |
| AI는 자신 있게 틀린다 (19쪽) | 확신 배지 규칙 | S3.2 |
| 환각 5대 위험지점 (20쪽) | 의심 구간 밑줄의 정답 키 | S3.2 (**OQ-3** — assumption) |
| **4대 검증법 (22쪽)** | 검증 도구 카드 4종 | S3.3, audited by **AC-9.3b** — **also breaks under R15 rungs ② and ③, because both drop card 5 and 자가검토 has no other home** |
| 검증 프롬프트 (23쪽) | 엔딩 복사 버튼 | S5.3 |

Step **S5.5** is a dedicated audit that walks this table row by row against the shipped build. A row whose only mapping is to a step that does not implement it counts as **미흡**, not 확인 — S5.5's rubric is stated in S5.5 so the audit cannot pass on assertion. Invoking R15 rung ② or ③ marks **two** rows 미흡 (11 and 14) → **13/15**, each with a named PRD-author sign-off.

---

## 2. RALPLAN-DR

### 2.1 Principles (8)

1. **연출이 규칙보다 앞선다.** The PRD's payload is an emotional beat ("부메랑 순간에 소름이 돋는가 ← 최대 관문", §12). Any technical choice that makes the boomerang staging harder is the wrong choice, even if it is cleaner. Correctness of the gauge arithmetic is necessary but not sufficient.
2. **PRD 수치와 문구는 상수다.** The §5 deltas and every Korean line the PRD spells out are data, not code, and live in one declarative block at the top of the script. An implementer must never retype them into logic.
3. **하나의 채점 문법.** Every *graded* interaction is one verb — click a token, click a tool, click send — so grading is exact set comparison. Ungraded, purely expressive gestures are exempt and may use whatever gesture carries the most affect (the round-1 drag).
4. **파일 하나가 제약이 아니라 설계 단위다.** Single-file means the internal structure must be legible by reading top to bottom: data → state → pure logic → render → fx → events → boot. No clever indirection; section banners and pure functions are the module system.
5. **각 단계는 독립적으로 플레이 가능해야 한다.** PRD §12 is explicit that each version is played before the next is planned. Every stage from v0.1 onward ends in something a human can open, play, and *finish*.
6. **불변식은 문서가 아니라 런타임이 지킨다.** An invariant that only a code reviewer enforces is an invariant that will be broken. Every structural invariant in this plan has a runtime self-report in `?debug=1` that throws at the moment of violation. See AC-1.8.
7. **기획의 주장은 검증 가능한 형태로 표현한다.** The PRD makes one falsifiable claim — 가려서 처리해야만 양쪽 모두 확보 (line 146) — and v3 encoded it as prose while its own rules made it false. A design claim the rules are supposed to guarantee must be written as a **property over the whole outcome space**, not as a sentence, and must be **discharged by enumeration**, not by tabulating a few favourable runs. See §2.6.6 and AC-8.1b.
8. **(new in v5) 보상 규칙을 고칠 때는, 그 보상이 매달려 있는 판정 경계부터 본다.** v4 closed a thesis hole by changing *what a `raw` grade costs* (R-f′) while leaving *what makes a grade `raw`* an existence test. The reward rule then inherited the boundary's blindness: one token's worth of masking bought a whole baseline chunk. **A reward that keys off a predicate can never be more discriminating than that predicate.** When an enumeration finds an exploit, the first question is which predicate the exploit is exploiting, not how much the predicate should pay. This is why v5 changes the boundary and leaves R-f′ untouched — and why the proportional-forfeiture variant **R-f″** (scale the baseline by fraction-neutralized) was *tried and discarded*: it re-tunes the payout around the same blind predicate and buys **zero** additional closure, because the exploit's maximizing profile fully masks the one card it touches (fraction = 1.0) and so is unaffected by proportionality. See §2.6.6, option (vi).

### 2.2 Decision Drivers

**Ranking:**

1. **D1 — 부메랑 연출 신뢰도 / 정서적 적중.** Round 1 has ~2 minutes to make the payoff feel earned rather than coincidental (PRD §13, first open item). The PRD calls this the 최대 관문. The renderer must make "information physically moving across the screen" (§7 아트 방향) cheap to stage and re-time, and the game's signature gestures must carry complicity.
2. **D2 — 텍스트 상호작용 채점 정확도.** Three of four mechanics (M1, M2, M3) are precise selection over Korean prose, then graded against an answer key. Hit-testing, selection state, and scoring must be exact and debuggable.
3. **D3 — 제로 의존성 · `file://` 실행 · 단일 파일.** A **gate, not a driver**: a pass/fail admissibility filter on every option, not something D1 or D2 can be traded against. It also implies no test framework, so verification is manual playthrough (PRD §12 "확인할 것") and the code must be structured so a human can verify behavior by playing.

**Reconciliation with the decisions.** v1 ranked D1 first and then settled Decisions A and B with "D2 dominates." For Decision A that phrasing was sloppy but the conclusion was right — DOM is *also* better for D1, because re-timing a beat means editing a CSS duration constant instead of rewriting a canvas timeline; A's rationale is stated on D1 grounds first, D2 second. For Decision B the tension was **real**: PRD §2's correspondence table maps "드래그해서 **촬영** → 찰칵" onto "드래그해서 **붙여넣기** → 딸깍", and PRD §12's permission to substitute click-toggle is granted on a **pedagogical** axis ("학습 효과는 거의 동일하다") — it says nothing about affect. v2 fixed the decision rather than the ranking, by splitting the interaction into an ungraded affect layer and a graded precision layer; v3 added the ergonomics gate; v4 added the idle-timeout fallback path. All retained.

> **A note on D3 that stays explicit.** D3 forbids a test framework, which is why §2.6.6's necessity property is discharged by an **in-file, boot-time enumerator** (`?debug=audit`, ~110 lines in v5, no dependencies) rather than by a test suite. The enumerator is not a test; it is a runtime assertion that the shipped content satisfies a design invariant, in exactly the spirit of Principle 6.

### 2.3 Viable options

#### Decision A — Rendering approach

**Option A1 — DOM/CSS primary, inline SVG for shape characters, CSS/WAAPI for the dot-flight FX (RECOMMENDED)**

- **D1 pros:** the boomerang is a handful of absolutely-positioned elements moving under CSS transforms with named duration constants. Re-timing the 최대 관문 is a one-line edit in the CSS `:root` block — the single most-repeated operation in the whole build. The 파국 beat ("모든 말풍선이 AI가 만든 문장으로 채워진다") is a class toggle plus a text swap over existing `.bubble` elements.
- **D2 pros:** text is already text — token `<span>`s give free layout, free hit-testing, free `:hover`/`:focus`, free Korean line-breaking, free accessibility. M1/M2/M3 reduce to `event.target.dataset.tok`. Scoring reads off `state`, never the DOM.
- **Cons:** many small nodes (≈200–450 spans on the largest card); a naive full re-render would kill in-flight CSS transitions and destroy accumulated FX state. Mitigated by Decision E's reservoir design and the AC-1.8 invariants.

**Option A2 — `<canvas>` for the office-world pane only, DOM for everything else (hybrid)** — frame-accurate control of the 파국 sequence, but introduces a second coordinate system and a render loop that must stay in sync with DOM state; the canvas pane must draw Korean speech-bubble text with manual line-breaking, which is exactly the work A1 gets free; two rendering models in one file undercuts Principle 4.

**Option A3 — Full canvas** — *INVALIDATED.* The reference game is a picture game; this game is a **text** game. Full canvas means hand-rolling text layout, per-word hit boxes, selection highlighting, scrollable long documents, and a modal — reimplementing the browser to gain an aesthetic the PRD never requires. It also makes the masking editor (M2), the highest-risk interaction, dramatically more expensive. Rejected.

**Decision: A1.** Primary rationale is **D1**; **D2** independently confirms the same choice; D3 admits A1 and A3 equally and A1 needs less code.

#### Decision B — Interaction gesture: drag vs click-toggle

**Option B1 — 단어 단위 클릭 토글 everywhere, including round 1's paste** — *superseded.* It silently deletes PRD §2's drag-complicity correspondence at the one place the PRD stages it, using a permission granted on a different axis. Against D1.

**Option B2 — Native drag selection snapped to token boundaries for all mechanics** — preserves the reference feel throughout and is fast for long spans, but needs `selectionchange` + `Range` → token-index mapping, plus touch/pointer handling, plus keeping click-toggle anyway as the fallback — two input paths to build, test and grade consistently, concentrated in v0.2, the stage the PRD already flags as risky. Against D2 and D3.

**Option B3 — Split by gradedness (RECOMMENDED)**

- **Round 1's paste gesture is a real, coarse, ungraded drag.** One `pointerdown` / `pointermove` / `pointerup` on the whole `[원본 문서]` element, dropped into the AI window. No token math, no answer key, no partial credit. This recovers PRD §2's "드래그해서 붙여넣기 → 딸깍" verbatim, at the exact narrative place where complicity matters, for roughly 40 lines of pointer-event code with zero grading surface.
- **Round 2's M1/M2/M3 stay 단어 단위 클릭 토글.** Grading is exact set comparison over derived token indices; no fuzzy range matching, no off-by-one on Korean 조사 boundaries; undo is a second click; touch works with no extra path.
- **Narrative bonus:** the shift from "one crude drag that dumps everything" to "precise clicks that select only what matters" *is* the PRD's own 잔소리 → 구원 arc rendered as an input-grammar change.
- Cons: two gestures exist in one game. One extra pointer-event code path, confined to a phase that never scores.

**Decision: B3.** B2 remains *deferred, not invalidated*, as a post-v1.0 additive enhancement for round 2 (a drag can simply set the same token-index set).

> **The drag is NOT yet ergonomically validated.** The v0.1.5 spike is an *affect* gate (3 testers, "소름이 돋는가") exercising **one** drag, not a drag-ergonomics gate. Round 1 contains **four** drags. The **v0.4 gate step 4** carries an explicit drag-ergonomics observation with a numeric pass criterion, and AC-3.3b re-scopes the click fallback so it is not a trivially available alternative to the complicity gesture — with **three** reveal conditions (failed, stalled, never-attempted) so no player can be stuck.

#### Decision C — Single-file script structure

**Option C1 — One IIFE, banner-delimited sections, pure-function boundaries (RECOMMENDED)**

- Sections in fixed order: `1. CONTENT DATA` → `2. STATE` → `3. PURE LOGIC` → `4. RENDER` → `5. FX` → `6. EVENTS` → `7. BOOT`. No globals escape. Content data (all Korean copy, all card objects, the `SCORE` table) is a frozen literal at the top so a non-programmer can proofread copy without scrolling through logic (Principle 2). This only works if card content is authored as prose, which is why Decision F exists.
- Cons: one long file.

**Option C2 — Several inline `<script>` blocks** — physically separates copy from code, but implies an implicit global namespace with no encapsulation, the same total length, and extra failure modes.

**Option C2b — Content in a `<script type="application/json">` block** — a genuinely inert, syntax-checkable content island, and the "parse failure silently blanks the game" objection is **mitigable to the same degree as Decision F's own `tokenize()` failure**, so it is not used as an argument. Rejected on the two **unmitigable** grounds only: (a) JSON forbids comments, and the badge-assignment audit table required by AC-6.2 lives in comments adjacent to the content it audits; (b) JSON forbids the multi-line template strings that annotated-string authoring (Decision F) is built on — and the `@@ summarize>` unit-header lines (F1c) are inherently line-oriented. Rejected on balance, not dismissed.

**Option C3 — `<script type="module">` with multiple files** — *INVALIDATED.* Violates the single-file constraint and is blocked by CORS on `file://` in Chrome. Rejected on D3.

**Decision: C1.**

#### Decision D — State machine / update model

**Option D1 — Single `state` object + region-scoped re-render + delegated `data-act` events (RECOMMENDED)**

- `state` holds everything: `phase`, `round`, `turnIndex`, `scores`, per-card interaction state, `pendingBoomerangs`, `flags`. Any interaction mutates `state` through one `dispatch(action)` and then re-renders the affected **regions**. All event handling is a single delegated `click`/`pointer` listener on `#app` reading `data-act` / `data-arg`, so re-rendering never orphans a listener.
- Pros: no DOM/state desync class of bug. A single `state` dump is a complete save state for manual QA, and `?phase=` / `?seed=` hooks can jump straight to any phase or seed a partial run — decisive for testing the v0.1.5 spike, the v0.4 boomerang, and the v1.0 endings without replaying 7 minutes each time.
- Cons: re-render can interrupt CSS transitions and *phase changes* can destroy accumulated FX state. Resolved by Decision E.

**Option D2 — Direct imperative DOM mutation per interaction** — animations are never interrupted, but every mechanic needs bespoke add/remove-class logic and its own undo path; state lives in the DOM, so grading must read the DOM. Highest long-tail bug cost, and reset is a core feature here.

**Option D3 — Formal transition table layered over D1** — makes the sequence auditable in one place, but is overkill for ~11 phases and adds indirection against Principle 4.

**Decision: D1**, with one concession borrowed from D3: the phase list is a single `const PHASES` enum and all phase changes go through `goPhase(next)`.

**Sub-decision D1a — round 1 is NOT a parameterization of round 2.** Describing round 2 as "literally `initRound(2)` re-running the same code" reads well but would splatter `if (round === 1)` through the render path that v0.3's gate certified. AC-3.1 alone lists four things absent in round 1, and B3 makes the input gesture differ too.

```
PHASES = TITLE
       | R1_TURN | R1_MONTAGE | R1_BOOMERANG | R1_FREEZE
       | INTERSTITIAL
       | R2_TURN
       | ENDING_RESULT | ENDING_CARD | ENDING_PROMPT
       | DEV_SPIKE            // ?phase=boomerang, v0.1.5 only
```

- `renderR1Turn()` and `renderR2Turn()` are separate functions.
- **Shared:** `CARDS`, `COPY`, `SCORE`, `#fxLayer`, `#dotReservoir`, `flyDot`/`settleDot`, `clickSound`, the office-pane renderer, the shape-character SVGs, the `.bubble` component.
- **Not shared:** gauges, toolbar, confirm modal, ⚙ panel, reject affordance, grading — none of which round 1 has.
- **AC-1.7** forbids any `state.round === 1` branch inside `renderR2Turn`, `gradeMasking`, `gradeUnderlines`, or `applyScore`. Verifiable by grep.

**Sub-decision D1b — the four R1 beats are ONE screen, not four.** `R1_TURN`, `R1_MONTAGE`, `R1_BOOMERANG` and `R1_FREEZE` are `data-beat` states on a single persistent `.screen--r1` element. Rationale is both structural and narrative: the montage, the boomerang and the 파국 all happen *in the same office, to the same characters and the same AI pane*. AC-3.11's "화면의 **모든** 말풍선이 채워진다" is only meaningful if those are the bubbles the player has been looking at for two minutes. It also removes four opportunities to destroy FX state.

#### Decision E — FX persistence, reservoir anchoring, and the render/phase invariants

**Options considered (retained for the record):**

- **E-a — reservoir outside `#app` entirely**, a boot-created sibling of `#fxLayer`. Structurally unreachable by both `render()` and `goPhase()`. Cost: viewport-positioned, must be re-anchored.
- **E-b — `goPhase()` lifts the reservoir out before a screen swap and re-adopts it after.** Makes correctness depend on every future `goPhase()` caller remembering to do it — the same class of convention-only invariant that already failed once.
- **E-c — declare the R1 beats as CSS-class overlays on one persistent screen.** Fixes the R1 case at its root and is narratively better, but does not by itself protect the round-2 reservoir across `INTERSTITIAL → R2_TURN → ENDING_*`.
- **E-d — re-create dots from `state.dots` on every render/phase.** Loses in-flight animation continuity and makes the boomerang's "that exact dot" identity a fiction rather than a fact.

**Decision: E-a + E-c together (both, not either)**, with these completions:

- The reservoir is **`#dotReservoir`**, created once at boot as a direct child of `<body>`, a sibling of `#app`, `#fxLayer` and `#modalRoot`. Nothing inside `#app` can reach it.
- It is **transform-anchored**, not per-dot-positioned. A screen supplies an empty placeholder `<div data-region="dotzone-anchor">`; `anchorReservoir()` reads that element's `getBoundingClientRect()` once and applies a single `transform: translate(x,y)` plus width/height to `#dotReservoir`. **Dots are laid out reservoir-local**, so a re-anchor moves one element, not N.
- `anchorReservoir()` runs on: boot, the tail of every `goPhase()`, the tail of every `render()`, `resize`, `orientationchange`, and the anchor `ResizeObserver`. It is idempotent and cheap.
- **E2a — no-anchor behavior.** If no `[data-region="dotzone-anchor"]` element exists on the current screen, `anchorReservoir()` **sets `#dotReservoir.hidden = true`, leaves the reservoir's children completely untouched, and returns cleanly. It never throws and never clears.** When an anchor next appears, the same function unhides and re-anchors, and every dot — with its `data-card-id` — is still there. **TITLE is the first screen at boot and has no anchor**, so a throwing implementation would break boot itself, and a clear-on-missing-anchor implementation would be a slower re-run of the bug this design exists to fix.
- **E2b — every screen an AC requires dots on must render its own named anchor.** `.screen--r1` and `.screen--r2` carry one inside `.pane-ai` (`.pane-ai__dotzone`). **`.screen--interstitial` carries `.screen-interstitial__dotzone`** so AC-3.12's ~2-second visible drain beat has a real target. **`.screen--ending` carries `.screen-ending__dotzone`** so AC-4.11's "readable at a glance at the ending" is literally true. `.screen--title` deliberately carries **none**, which is the normal, silent case of E2a. Deliverables: S4.4 (interstitial anchor), S5.1 and S1.7 (ending anchor).
- **E2c — observer re-attachment.** The `ResizeObserver` observes **the anchor element, not `.pane-ai`**, and `bindReservoirObserver()` is called from the tail of both `render()` and `goPhase()`, immediately before `anchorReservoir()`. It `disconnect()`s and re-`observe()`s the **current** anchor node every time, so a recreated node is picked up. In `?debug=1` it asserts `observedNode === document.querySelector('[data-region="dotzone-anchor"]')` after every phase change. Without this the observer silently stops firing after the very first screen transition. See AC-1.8 I-4.
- `#fxLayer` holds **only in-flight** elements. `settleDot()` *adopts* the flying element into `#dotReservoir` (`appendChild` moves it), converting viewport coordinates to reservoir-local layout at the moment of settling. `replayDot(cardId)` does the reverse: it sets `data-inflight` on the dot, lifts it out into `#fxLayer`, and flies it to the stranger's bubble.
- A `resize` / `orientationchange` handler re-anchors in-flight FX by recomputing target rects; if a resize lands mid-flight, the in-flight element is **snapped to completion** rather than re-animated.
- Each dot element carries `data-card-id`, which is what makes AC-3.9 ("that exact dot comes back") literally true rather than a visual coincidence.

**Sub-decision E1a — do round-1 dots persist into round 2?** **No — they are drained, visibly, at the interstitial.** Rationale: (a) round 2's reservoir must be a clean signal of what *this* round leaked, or the ending's "가장 자주 놓친 것" reads against a polluted count; (b) carrying the round-1 dots forward implies the leak is unfixable, contradicting the PRD's 구원 register for round 2; (c) a silent `innerHTML = ''` would waste a beat. So: a **~2-second drain animation** at INTERSTITIAL, played over `.screen-interstitial__dotzone` (E2b). The round-1 dot count is retained in `state.log.round1Dots` and surfaced as one non-personalized line on the ending safety card (AC-8.3b).

**Sub-decision E1b — round 2 accumulates its own dots, styled by GRADE (restated in v5).** See **AC-4.11**: every *sent* request adds a dot; 거절 adds none. The dot's style is keyed on the **grade the send actually received**, which under §2.6.3's coverage boundary now carries real information about how much was masked:

| dot style | when | reads as |
| --- | --- | --- |
| `.dot` (solid) | `raw`, **or `clean` via C1 with no transform applied** | 원본이 그대로 들어갔다 |
| `.dot--partial` (half-filled) | `partial` (coverage ≥ θ but < 1) | 대부분 가렸지만 일부 샜다 |
| `.dot--masked` (hollow) | `clean` via **C2** (every risk token neutralized), **or `clean` via C1 with a transform applied** | 가려서 넣었다 |

*(v4 had two styles and keyed the hollow one on "clean AND at least one transform applied". Under the existence boundary that was the best available proxy; under the coverage boundary the grade itself is the honest signal, and a third style is needed because `partial` is no longer "one click away from raw" — it now means ≥70% of the card's risk was genuinely neutralized. A source comment states this so nobody "simplifies" it back to two.)*

#### Decision F — Card content authoring format

v1 authored `source` as one object per token (`{i:47, t:'김', r:null}`) — ~340 lines per card, ~2,000 lines of card data alone, roughly 2× the whole line budget, and defeating Principle 2 outright.

**Option F1 — Annotated strings, tokenized at boot (RECOMMENDED)**

```js
{
  id: 3,
  title: '경쟁사 뉴스 요약',
  tier: 'B',                       // content tier: B = answer holds exactly 2 genuine spans
  rounds: [1, 2],
  situation: '공개된 경쟁사 뉴스 3건 요약해줘',

  // 원본. [텍스트|위험유형] 으로 위험 요소를 표시한다. 표시가 없으면 안전한 토큰.
  // 조사는 괄호 밖에 둔다 — F1b. 대체값이 필요한 유형은 [텍스트|유형>대체값] — F1c.
  // 한 문단 앞의 `@@ summarize> …` 헤더는 그 문단을 요약 가능 단위로 선언한다 — F1c.
  source: `지난 분기 경쟁사 A사는 신규 서비스를 공개했다. …`,

  answer: {
    badge: '⭐ 확실합니다',
    // [텍스트|유형!도구] = 진짜 환각(채점 대상, 그 도구로만 해소), [텍스트|유형?] = 미끼 후보
    text: `요약하면 다음과 같습니다. [업계 관계자의 73%|stat!evidence]가 …
           [한국AI산업협회|proper?]의 분기 보고서에 따르면 …`,
    reveal: { evidence: '출처를 확인할 수 없습니다' },
  },

  feedback: '…',
}
```

- `tokenize(annotatedString)` runs **once at boot** and produces the immutable token records `{i, t, risk, replacement, unitId, paraId}` / `{i, t, span, genuine, resolvedBy}` that the renderer and graders consume.
- **All keys are derived, never authored.** `riskKey` = `tokens.filter(t => t.risk)` grouped by type. `hallucinationKey` = spans with `!`. `candidateKey` = all marked spans. `summarizableUnits` = units carrying an `@@ summarize>` header. **`riskKeySize` (the denominator of the coverage test, §2.6.3) is likewise derived, never typed.** There is exactly one source of truth per fact.
- Pros: ~22–32 lines per card instead of ~340. Copy reads as prose, so the non-programmer proofread Principle 2 promises is actually possible. Token indices remain exact because they are computed, not typed.
- Cons: one small parser (~60 lines in v5) that must be right for Korean; a malformed bracket is a content bug with no build step to catch it — mitigated by `tokenize()` throwing a named error naming the card id and the offending substring, rendered on screen in `?debug=1`.

**Option F2 — per-token objects** — *rejected* on the line-budget and proofreadability arithmetic above.

**Option F3 — plain strings + a separate regex-based risk matcher** — *rejected:* a matcher that finds "김민수" anywhere would also match it inside the answer text and inside feedback copy, and cards 4/6's risk is "the whole document", which no pattern expresses.

**Decision: F1.** **AC-1.6** forbids any hand-authored array of integer indices anywhere in `CARDS`.

##### F1a — the transform overlay model, with ONE neutralization rule

**Normative resolution — the leakage model, stated once:**

- **`state.turn.transformed` is a `Map<originalTokenIndex, {text, tool}>`.** It is an **overlay on the immutable original token array**. It is *never* a re-parse of the masked output.
- `tokenize()` is called **only in the BOOT section**, once per card. **AC-1.6b** forbids any grader, renderer or send path from calling it. Verifiable by grep.
- **Rendering** the masked prompt = `originalTokens.map((t, i) => transformed.has(i) ? transformed.get(i).text : t.text).join('')`. A replacement may be `''`, shorter, longer, or multi-word. **Token count never changes**; only rendered string length does.
- **1:1 transforms — 익명화 · 마스킹 · 가상데이터.** Each marked index maps to its own replacement (`김민수` → `고객 A`; `010-1234-5678` → `010-****`; `129,000원` → `약 10만원대`). This fully answers the "가상데이터 changes token counts" worry: **under the overlay model it does not** — it is 1:1 at the index level even though the string length changes.
- **R-m1 · 1:1 tools never erase.** 익명화, 마스킹 and 가상데이터 **always** produce a non-empty replacement — a visible stub, an alias, or a plausible fake. An implementation in which any of the three can yield `''` is a defect. This rule is what keeps the leakage clause below from becoming a universal solvent by accident.
- **Many-to-one transform — 요약.** Defined as an **index-range collapse** over exactly one declared unit (F1c): `transformed.set(i₀, {text: <그 단위의 authored 요약 문장>, tool:'summarize'})` and `transformed.set(i, {text: '', tool:'summarize'})` for every remaining `i` in the unit. Every index in the unit is present in the overlay, and the rendered output reads as one summary line.
- **R-n1 · THE neutralization rule (single, normative).** A risk token at index `i` is **neutralized** iff `transformed.has(i)` **and**
  `transformed.get(i).tool === 'summarize'  ||  transformed.get(i).tool ∈ RISK_TYPES[token.risk].neutralizedBy`.
  In words: **요약 neutralizes every risk type unconditionally** (the original wording is gone from the output — nothing is left to leak); every other tool neutralizes only the types the technique map lists. No text is ever re-parsed to decide grading.
- **Why this does not make 요약 a universal solvent.** 요약's *effect* is universal but its *applicability* is authored: it may only be applied to a paragraph unit the card's author explicitly declared 요약-eligible (F1c). Cards 1, 4 and 5 declare **no** eligible unit, so 요약 is simply unavailable there and 익명화 / 마스킹 / 가상데이터 remain strictly required. The author, not the grader, decides where erasure is an acceptable answer.
- **R-n2 · (new in v5) neutralization is COUNTED, not merely detected.** `gradeMasking` consumes `neutralized.size` and `riskKey.size` and compares their **ratio** against `SCORE.maskCoverageThreshold` (§2.6.3). `isNeutralized(i)` stays exactly as R-n1 defines it — the change is entirely in what the grader does with the answer, and it is the change that makes a one-token mask stop being worth a whole baseline chunk.

##### F1b — the 조사 (particle) authoring rule

Korean particles change form with the preceding syllable's 받침, so a substitution can produce text that reads wrong (`고객 A은` vs `고객 A는`).

- **Rule:** an annotation bracket contains **only the risk substring, never its 조사** — `[김민수|pii_name>고객 A]씨가`, not `[김민수씨가|pii_name]`. `tokenize()` splits at the closing bracket, so the 조사 becomes its own unmarked token and survives every transform unchanged.
- **Stated exception:** where the replacement changes the *required* 조사 form, the author extends the bracket to include the 조사 and writes the correct 조사 into the replacement (`[김민수가|pii_name>고객 A가]`). The exception is an authoring choice made per occurrence, recorded in a comment next to the card.
- Checked by the copy read-through at S5.5, not by code. Listed as an authoring rule in S3.1a's deliverables so it is applied from the first card, not retrofitted.

##### F1c — where the replacement TEXT lives (extended in v5: 익명화 joins 가상데이터)

The actual Korean strings the techniques need must live *inside* the authored source, because a hand-authored side table of replacements keyed by index is **explicitly forbidden by this plan's own AC-1.6**.

**(1) Inline replacement value on a token: `[텍스트|유형>대체값]`**

```
[129,000원|unreleased_spec>약 11만원대]
[3월 14일|unreleased_spec>상반기 중]
[김민수|pii_name>고객 A]              ← 익명화도 작성자가 직접 쓴다 (v5)
[박현우|pii_name>B 책임]              ← 직책 치환이 필요한 자리도 그냥 대체값으로 쓴다
[서울시 강남구 …|pii_attr>수도권 거주]
[김민수가|pii_name>고객 A가]          ← F1b's 조사 exception
```

- **R-r1 · (v5, replaces the undefined 직책 map) The `>대체값` slot is MANDATORY for every token whose risk type's `neutralizedBy` contains `anonymize` or `fake`.** That is: `pii_name`, `pii_attr`, `confidential_amount`, `unreleased_spec`, `unreleased_perf` — **all five**, with no exceptions and no derived fallback. `tokenize()` **throws at boot**, naming the card and the token, if such a token lacks a `>` value.
- **R-r2 · Only 마스킹 stays derived.** `MASK_TOOLS.mask.transform(text)` keeps the leading segment and stars the remainder (`010-1234-5678` → `010-****`, `주문 A-20931` → `주문 A-****`). This is the one technique whose output is genuinely mechanical, contains no editorial judgment, and cannot be wrong in Korean. It applies to `pii_phone` and `biz_id` only. A `>대체값` on a `mask`-only token is **permitted** as an explicit author override and, if present, wins.
- **Why v5 removed the derived 익명화 path entirely.** v4 specified `MASK_TOOLS.anonymize.transform(text, ordinal)` as "nth distinct 실명 → 고객 A / B / C; **직책 where the card declares a 직책 map**". **That 직책 map was mentioned exactly once in the entire plan and defined nowhere** — not in the card object shape, not in the annotation grammar, not in the authoring checklist, not boot-asserted. Worse, the same derived function was designated as the neutralizer for two risk types it cannot sensibly handle: `pii_attr` (학교 · 나이 · 주소 · 사진 — there is no ordinal alias for "서울시 강남구 역삼동") and `confidential_amount` (계약 금액 — an ordinal alias for a number is meaningless). Both round-4 reviewers found this independently. The fix is not to define a 직책 map; it is to notice that **익명화 is an editorial judgment in every one of its uses** and to route it through the mechanism the plan already has for editorial judgment — the inline `>` slot. This deletes a concept, adds no new one, and makes the omission unshippable rather than merely undocumented.

**(2) Unit header line declaring a 요약-eligible paragraph: `@@ summarize> <요약 문장>`**

```
@@ summarize> 지난 분기 실적과 조직 개편 논의가 있었고, 액션 아이템 3건이 도출되었다.
3분기 매출은 [129,000만원|unreleased_perf>약 12억원대]으로 집계되었고,
4분기 목표는 [158,000만원|unreleased_perf>약 16억원대]으로 상향되었다.
[박 책임의 고과가 낮아 전환 배치가 필요하다는 의견|hr_eval]이 나왔다.
```

> **(v5 correction — worked-example magnitude.)** v4 printed these two replacements as `약 10만원대 후반` and `약 15만원대` against originals of `129,000만원` and `158,000만원`. `129,000만원` is **1.29 billion won**; `약 10만원대 후반` is about **180,000 won** — the example was wrong by roughly **four orders of magnitude**, and a 가상데이터 value that is off by 10⁴ is not a plausible fake, it is a nonsense sentence. Corrected to `약 12억원대` / `약 16억원대`. The unrelated card-4 example `129,000원 → 약 11만원대` was already the right order of magnitude and is kept (adjusted only to avoid reading as a rounding-down of the real figure). **S5.5's read-through gains an explicit order-of-magnitude check** — this is exactly the class of content error a boot assertion cannot see.

- A `source` is a sequence of **문단 units** separated by blank lines. A unit whose first line begins `@@ summarize>` is **요약-eligible**, and the remainder of that line is its **one canonical summary sentence**. A unit without the header is **not** 요약-eligible.
- **R-m2 · 요약's granularity is the declared unit, and only the declared unit.** 요약 is applied by selecting *any* token inside an eligible unit and pressing `요약`; it collapses **exactly that whole unit**, never an arbitrary token range and never two units at once. Fixing the granularity at the authored unit makes exactly one canonical sentence correct, by construction.
- Applying `요약` to a selection that touches no eligible unit, or that spans two, is **refused** with an inline message (copy → OQ-4 item 12).
- `@@` at the start of a line is reserved; a literal `@@` in prose is escaped `\@@`. `tokenize()` throws on an `@@` header whose tool name is anything other than `summarize`, and on an eligible unit with an empty summary sentence.
- **R-m3 · (new in v5) unit size is bounded by the coverage threshold.** No 요약-eligible unit may contain `⌈θ · riskKeySize⌉` or more risk tokens — otherwise a single collapse click would lift the card out of the `raw` band on its own, which is the exact shape of the defect v5 exists to close. Machine-checked as `auditCardSet()` **clause F2** (§2.9.2).

**Authoring surface this adds** — now tracked in full: **~29 inline replacement values** (19 익명화 across cards 1/2/5/6, 10 가상데이터 across cards 2/4) and **~5–7 요약 summary sentences** (cards 2, 6). Both are **OQ-4 items 13 and 14**, owned by **S3.1a/S3.1b** with rendering locations named, and **R15's estimate is 3–3.5 person-days** (raised from v4's 2.5–3 to pay for the 익명화 values v4 assumed were derived).

##### F1d — composition: what happens when a card needs two techniques

Card 2's PRD 정답 is literally "원문 대신 **요약만** 넣기 — **직책으로 치환**, 수치는 제외", i.e. 요약 *and* 치환 on the same document. Resolved by three rules:

- **R-c1 · Disjoint-region authoring (the primary rule, and an authoring constraint).** **No risk token may ever require two techniques simultaneously.** Where a card's PRD 정답 names two techniques, the author **partitions the source into disjoint units, one per technique.** Card 2 is authored as a non-eligible 참석자 header unit (실명 → 익명화, each with its authored `>직책` replacement) plus a 요약-eligible 논의 본문 unit (미공개 실적 수치 and 인사 논의 → collapsed away), which is *exactly* what "직책으로 치환, 수치는 제외" describes. Card 6 is authored as a non-eligible 핵심 조항 unit (거래처명 → 마스킹, 금액 → 익명화) plus 요약-eligible 조항 units. Checked by the boot audit (§2.9.2), not by hope.
- **R-c2 · Last write wins, and 요약 may cover already-transformed indices.** One index carries at most one overlay entry. Applying a tool to an index that already has one **overwrites** it, undoable via `마지막 동작 취소`. Applying `요약` to an eligible unit replaces every overlay entry inside that unit with the collapse entries — safe under R-n1, because erasure strictly dominates anything it overwrites.
- **R-c3 · The reverse order is refused.** Applying a 1:1 tool to an index already inside an applied 요약 collapse is **refused** with an inline message, because that token's text no longer exists in the output. (Copy → OQ-4 item 12.)
- **R-c4 · (round-5 merge) A 1:1 tool with nothing to substitute is refused.** Applying a 1:1 masking tool (**익명화 · 마스킹 · 가상데이터**) to a risk token whose risk type does **not** list that tool in `RISK_TYPES[type].neutralizedBy` **and** which carries **no authored `>대체값`** is **refused** with an inline message, because there is no replacement string to write and R-m1 forbids producing an empty one. This is the same refusal pattern as R-c3, applied to the one remaining case where a 1:1 tool has no defined output. It changes **no grade**: a non-neutralizing transform already left the token 미가림 (decision row 2), so refusing it and applying it score identically — the rule exists so the editor never enters an undefined state, and so the player gets a reason instead of a silent no-op. *(Note the deliberate narrowness: a 1:1 tool applied to a token that carries an authored `>대체값` still **applies**, even if that tool is not the type's declared neutralizer — that is the "wrong tool, still a visible transform, still 미가림" case AC-4.10 depends on.)* (Copy → OQ-4 item 12.)

##### F1e — (new in v5) the pinned risk-key sizes

The coverage boundary (§2.6.3) has a denominator, so **`riskKeySize` per card is now load-bearing content** rather than an incidental property. It stays **derived** by `tokenize()` (AC-1.6 is untouched), but the authored content must hit these sizes, and the boot audit asserts them:

| card | risk key composition | `riskKeySize` R | `need = ⌈0.7·R⌉` | max risk tokens in any one 문단, per tool | max risk tokens in any one 요약 unit |
| --- | --- | --- | --- | --- | --- |
| 1 | `pii_name`×3 · `pii_phone`×3 · `biz_id`×2, across 3 문의 entries (3 문단) | **8** | 6 | 2 (마스킹 within one entry) | — (no eligible unit) |
| 2 | `pii_name`×5 (참석자 문단) · `unreleased_perf`×2 · `hr_eval`×1 (논의 본문) | **8** | 6 | **5** (익명화 on the 참석자 문단) ← the binding case | 3 |
| 3 | — | **0** | — (clause C1) | — | — |
| 4 | `unreleased_spec`×8 (스펙 4 · 출시일 2 · 가격 2) across 6 문단 | **8** | 6 | 2 | — (no eligible unit) |
| 5 | 3 지원자 entries × (`pii_name`×1 + `pii_attr`×2) | **9** | 7 | 3 (익명화 within one entry) | — (no eligible unit) |
| 6 | `biz_id`×2 · `confidential_amount`×2 (핵심 조항 문단) · `confidential_doc`×4 (2 요약 units × 2) | **8** | 6 | 2 | 2 |

These are **authoring constraints with a boot check**, not descriptions. Their purpose is stated plainly: they are what make the θ-band of §2.6.3 wide, and a future re-authoring that (say) puts all eight of card 4's spec tokens into one 문단 would make a single bulk application worth 8/8 and must therefore fail loudly. That check is `auditCardSet()` **clause F** (§2.9.2).

**Revised line budget.** Content data ~430 lines (6 cards × ~32 including unit headers and ~29 replacement values, plus `COPY` ~160, `ENDINGS`/`ROLES` ~60); CSS ~700; state + pure logic ~475 (v5's `?debug=audit` enumerator is ~110, up from ~80); render ~400; FX ~205; events + boot ~160. **Total estimate 2,200–2,700 lines**, content ~16% of the bulk.

### 2.4 Decision summary

| Decision | Chosen | Rejected / deferred |
| --- | --- | --- |
| A · Rendering | DOM/CSS + inline SVG + CSS FX overlay | Hybrid canvas; full canvas (**invalidated**) |
| B · Gesture | **Split:** coarse ungraded drag for round-1 paste; 클릭 토글 for all graded mechanics. Fallback click appears only after a failed, abandoned **or never-attempted** drag | Uniform click-toggle (**superseded**); uniform drag (**deferred** post-v1.0) |
| C · Structure | One IIFE, 7 banner sections | Multi-`<script>`; JSON content island (rejected on *unmitigable* grounds only); ES modules (**invalidated**) |
| D · Update model | `state` + region-scoped render + delegated `data-act`; round 1 has its own renderers; R1's four beats are one screen | Imperative DOM mutation; formal transition table (partially adopted as `goPhase`) |
| E · FX persistence | `#dotReservoir` outside `#app`, transform-anchored, hides cleanly when no anchor exists, named anchors on INTERSTITIAL and ENDING, observer re-bound on every render/phase; **round-2 dots styled by grade in three variants** | Reservoir inside the AI pane (**v2**); lift-and-readopt in `goPhase` (convention-only); observer on `.pane-ai` (**v3**); dots re-created every render; **two-variant dot styling keyed on "any transform applied" (v4 — superseded, the grade now carries the information)** |
| F · Content format | Annotated strings tokenized at boot; all keys **including `riskKeySize`** derived; transform = index-keyed overlay; 요약 = collapse of one authored unit; one neutralization rule (leakage model); **replacement text inline and MANDATORY for every 익명화 and 가상데이터 token (R-r1)**; disjoint-region authoring; 조사 outside brackets; **pinned risk-key sizes and bounded unit/문단 concentrations (F1e, R-m3)** | Per-token objects (**rejected**); regex matcher; re-tokenizing masked text (**invalidated**); technique-hierarchy-only neutralization (**invalidated in v4**); a side table of replacements (**forbidden by AC-1.6**); arbitrary-range 요약 (**invalidated**); **a derived 익명화 transform with a "직책 map" (invalidated in v5 — the map was never defined anywhere, and 익명화 is editorial in all of its uses)** |
| G · Gauge semantics | **Earned/distributed baseline + 3-segment display**, with the baseline **forfeited on a raw send (R-f′)** — see §2.5 | Depleting 100-reserve (**rejected**); bare 1-segment earned gauge (**rejected**); fully unconditional baseline (**invalidated in v4**); **proportional forfeiture R-f″ (invalidated in v5 — buys zero closure over R-f′, §2.6.6 option (vi))** |
| H · Grading precedence | Ordered, exclusive, total clause set with an empty-key carve-out **and a COVERAGE-based raw/partial boundary at θ = 0.7** — see §2.6.2–§2.6.3 | v2's unordered clause set (**invalidated**); **existence-based raw/partial boundary `neutralized.size === 0` (invalidated in v5 — one token click was worth a whole baseline chunk)** |
| **I · Thesis enforcement** | **Normative necessity constraint (AC-8.1b) over the whole sub-θ space, discharged by a boot-time exhaustive enumerator (`?debug=audit`, clauses B/B2/F)** — see §2.6.6, §2.9.2 | Threshold-only closure (**invalidated** — no flat 보안 threshold closes it at any N); 거절 given a 보안 cost (**deferred to the PRD author** — breaks a PRD literal); prose assertion (**invalidated**); **zero-masking-only enumeration (invalidated in v5 — structurally blind to the minimal-masking class)** |

### 2.5 게이지 의미론 (DELIBERATE)

#### 2.5.1 The contradiction

PRD §5 line 128 states 두 게이지 모두 **0에서 시작**해 100이 만점. The same section's 설계 의도 requires 전부 거절 → 보안 **100**. But of the eight security deltas in the table, six are ≤ 0 and only two are positive (환각 잡기 +5, ⚙ +10) — neither reachable by a player who rejects everything. From a 0 baseline, "reject everything → 보안 100" is unreachable. The table and its stated intent cannot both be literally true; something must be supplied.

#### 2.5.2 Normative rules

- **R-a · Send-outcome exclusivity.** §5 rows 1–5 are one mutually-exclusive `sendOutcome` per completed request. Exactly one 업무 completion award per turn. `검증 없이 답변 제출`'s `+15` is **the same award**, not a second one; its only distinct payload is the deferred 보안 −25. `applyScore(sendOutcome, modifiers)` takes the outcome as a single enum argument, so double-awarding is structurally impossible (AC-4.2b).
- **R-b · Additive modifiers.** Only `검증 도구 1개 사용` (업무 −3 each, ≤2/turn), `환각을 잡아냄` (업무 +5 / 보안 +5 **per genuine span**, ≤2/turn via the tool cap) and `숨겨진 설정 끄기` (보안 +10, once) stack on top of the send outcome.
- **R-c · 거절 produces no answer.** A rejected request generates no AI answer, so it can carry no badge, no underline phase, and **can never incur `검증 없이 답변 제출`**. It still consumes the turn and still receives its baseline award.
- **R-d · 업무 axis.** `taskScore` starts at 0 and the displayed 업무 게이지 = `clamp(taskScore, 0, 100)`.
- **R-e · Deferred penalties always land, at a pinned delay.** `SCORE.boomerangDelay = 2`: a `검증 없이 답변 제출` penalty queued on turn *k* lands at the **start of turn k+2**. Any penalty still pending when the last turn ends is **flushed into the ending transition** as one combined beat with its own copy. Two turns is chosen, not assumed: one turn reads as an immediate consequence rather than a boomerang and collides with the same turn's feedback beat; three turns pushes both of card 5's and card 6's penalties into the flush at N = 6 and *all* of them into the flush at N = 4, which empties the in-round boomerang mechanic exactly where the demo audience would see it. At delay 2 and N = 6 the card-3 penalty lands live on turn 5 and the rest flush. The constant lives in `SCORE`, is read in exactly one place, and §2.5.5's trajectory is computed under it.
- **R-f′ · The baseline award fires once per completed turn, EXCEPT on a raw send.** *(Introduced in v4; **retained unchanged in v5**, and deliberately not re-tuned — see Principle 8 and §2.6.6 option (vi).)* For each turn the player completes, exactly one `baselineAward(k, N)` is granted — indexed by `state.turnIndex`, recorded in `state.turnsAwarded` (a `Set`) so a `다시 보기` → re-send cycle cannot double-increment it — **unless that turn's send outcome is `raw`, in which case no baseline is granted for that turn.**
  - **거절 keeps it** (required: 전부 거절 → 보안 100, PRD 설계 의도 1).
  - **가려서 처리 (정답) keeps it.** **가리다 일부 놓침 keeps it**, minus the §5 −8.
  - **그대로 처리 forfeits it**, on top of the §5 −20.
  - **Semantics in one sentence:** *보안 예산은 원본을 밖으로 내보내지 않은 턴마다 적립된다.* 거절 — nothing left the building. 가려서 처리 — only masked text left. 일부 놓침 — **most** of it was masked, minus what leaked. 그대로 처리 — the original document left the building, so **there was nothing to bank.** The −20 is the damage; the forfeited baseline is the *absence of protection*.
  - **What v5 changes about R-f′ is not the rule but its trigger.** R-f′ keys off the `raw` grade. In v4 a grade was `raw` only when *literally nothing* was neutralized; from v5 it is `raw` whenever **less than θ = 0.7 of the card's risk key** was neutralized (§2.6.3). Every word of R-f′ above is unchanged; it simply now fires on the cases it was always meant to describe. This is the whole of the fix, and it is why "일부 놓침" above now honestly reads *most* rather than *any*.
  - Routed to the PRD author as **S0.2(B) Q6 / OQ-12**, non-blocking, with its reversal cost written down.

#### 2.5.3 Option G1 — depleting trust reserve

Internal `securityScore` starts 0 and accumulates §5 deltas verbatim. Displayed 보안 = `clamp(100 + securityScore, 0, 100)`.

#### 2.5.4 Option G2 — earned gauge with a distributed baseline (CHOSEN)

The 100 points are not a fixed baseline; they are **distributed across the N requests of the round as a per-request award**, granted per completed turn under R-f′, with the §5 deltas applied against it.

- `baselineAward(k, N) = round(100·k/N) − round(100·(k−1)/N)` for the k-th completed request, where **`k = state.turnIndex + 1` and `turnIndex` is 0-based** (AC-1.9).
  For N=6: `17, 16, 17, 17, 16, 17` — integers summing to exactly 100 by telescoping, with no floating-point residue. N=5 → `20,20,20,20,20`; N=4 → `25,25,25,25`.
- **Σ over a round in which no request was sent raw is exactly 100, for any N**, because the sum telescopes to `round(100·N/N) − 0`.
- Per turn: `securityScore += (outcome === 'raw' ? 0 : baselineAward(k,N)) + sendOutcomeSecurityDelta + modifiers`, with deferred −25s landing per R-e.
- Displayed 보안 = `clamp(securityScore, 0, 100)` — **starting at 0**, exactly as PRD line 128 says.

**Why G2 over G1.** (1) It is literally what PRD line 128 says. (2) Under G1, 보안 is pinned at the 100 display cap from turn 0 on any clean path, so `환각을 잡아냄 +5` and the ⚙ `+10` — two mechanics the PRD deliberately designed as *discoveries* — are invisible no-ops from the first frame, defeating "발견하는 재미로 바꾸면 오래 기억된다" (§9). (3) It makes the v0.1 gate question answerable: under G1, 가려서 처리 (정답) has a security delta of 0 against a gauge already at 100, so the *correct* play produces zero visible movement and the gate is vacuous. (4) `baselineAward(k,N)` auto-normalizes to card count, so DEMO_MODE still tops out at exactly 100 with no second constant.

**G1 and G2 are algebraically identical at end of run for any run containing no raw sends** — `Σ(100/N + δ_k) = 100 + Σδ_k`. They differ in trajectory, and, under R-f′, on raw-send runs (where G2 is strictly harsher). A reversal to G1 (OQ-1) remains a *display-layer* change for every non-raw run; on raw runs it would also require re-deciding R-f′, which is why OQ-1 and OQ-12 are sent together.

**Residual cost of G2, stated honestly:** the per-request award is a number the PRD does not contain. It is *derived* (100 ÷ N), not invented, and the §5 delta table is untouched — but it is a supplied rule, marked in-source with a `// PRD §5 보완:` comment, as are R-f′'s exception and §2.6.3's θ.

#### 2.5.5 The 3-segment gauge — G2's punishment-path fix

**The defect it solves.** G1 was rejected because a gauge saturated at 100 makes the `+5`/`+10` bonuses invisible from frame 1. G2 inherits the same defect with the sign flipped: on the **punishment** path the 0-floor clamp pins the *displayed earned* value at 0 for the whole run, so every subsequent −20 and every −25 becomes invisible. Left unfixed, G2 is not better than G1; it is differently broken.

**The fix — same arithmetic, richer display.** `renderGauges()` draws the 보안 bar as **three segments** plus one marker:

| Segment | Value | Reads as |
| --- | --- | --- |
| **earned** (solid) | `earned = clamp(securityInternal, 0, 100)` | 확보한 안전 |
| **남은 안전 예산** (ghosted / hatched) | `ghost = min(Σ_{j>k} baselineAward(j,N), 100 − earned)` | 아직 벌지 않은 잠재 안전 |
| **잃은 안전** (dark / hollow) | `lost = 100 − earned − ghost` | 태워버린 안전 |
| **overdraft marker** | when `securityInternal < 0`, a small `−N` tick at the zero end | 게이지 아래로 얼마나 더 내려갔는가 |

The three segments always sum to exactly 100, so the bar is always full-width and the player always sees where the missing part went. **No arithmetic changes** — a rendering concept plus two derived values.

**Worked trajectory — punishment path, 전부 그대로, N=6, `boomerangDelay = 2`.** Tier-B cards 3, 5 and 6 are each sent with zero tools, queueing a −25 on turns 3, 5 and 6; the turn-3 penalty lands live on turn 5, the other two flush into the ending transition.

| turn | this turn's events | internal | earned | ghost | lost | overdraft |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | c1 raw: baseline **forfeited**, −20 | −20 | 0 | 83 | **17** | −20 |
| 2 | c2 raw: forfeited, −20 | −40 | 0 | 67 | **33** | −40 |
| 3 | c3 clean (C1): **+17**, ±0; queues −25 → due turn 5 | −23 | 0 | 50 | **50** | −23 |
| 4 | c4 raw: forfeited, −20 | −43 | 0 | 33 | **67** | −43 |
| 5 | c5 raw: forfeited, −20; **lands −25** from turn 3 | −88 | 0 | 17 | **83** | −88 |
| 6 | c6 raw: forfeited, −20; queues −25 → flush | −108 | 0 | 0 | **100** | −108 |
| — | ending transition: **flush 2 × −25** | **−158** | 0 | 0 | 100 | −158 |

The dark band grows `17 → 33 → 50 → 67 → 83 → 100` — a **perfectly even six-beat collapse**, one baseline chunk per turn, which is G1's core visual thesis recovered inside G2's literal model. This is why the 3-segment gauge is a **v0.1 deliverable (S1.2)** and not a polish item: `renderGauges()` ships there, and a 1-segment bar makes the v0.1 gate's punishment-path steps unexecutable.

*Reward path — 전부 가려서 + 최소 검증 (⚙ found on turn 4):*

| turn | internal | earned | ghost | lost |
| --- | --- | --- | --- | --- |
| 1 | 17 | 17 | 83 | 0 |
| 2 | 17+16 = 33 | 33 | 67 | 0 |
| 3 | 33+17+5 = 55 | 55 | 45 | 0 |
| 4 | 55+17+10 = 82 | 82 | 18 | 0 |
| 5 | 82+16+5 = 103 | 100 | 0 | 0 |
| 6 | **103**+17+5 = 125 | 100 | 0 | 0 |

Saturation at turn 5 of 6, as claimed.

**Labels `남은 안전 예산` and `잃은 안전`, the overdraft marker's copy, and the flush beat's copy are authored strings → OQ-4.**

#### 2.5.6 Over/undercap accounting

All three accumulators are **running maxima of the excursion, not running sums of clipped events** — a per-event sum would keep growing on a run that recovers, which is not what the ending line means.

- **`securityUndercap = max over the run of max(0, −securityInternal)`** — the deepest the internal score ever went below zero. Monotone non-decreasing, never needs unwinding. Surfaced on the 유출 사고 / 최악 endings as one line naming how far below zero the run actually went (copy → OQ-4). Without it, 전부 그대로 (internal −158) and a merely-bad run (internal −5) are indistinguishable to the player.
- **`securityOvercap = max over the run of max(0, securityInternal − 100)`** (AC-4.8).
- **`taskOvercap = max over the run of max(0, taskInternal − 100)`** (reachable: the maximal-verification run computes 102).

Reference values under §2.6.5: run 2 → `securityUndercap = 158`; run 13 → **158** (identical, by construction — see §2.6.5); run 7 → `10`; run 3 → `securityOvercap = 25`; run 4 → `securityOvercap = 40`, `taskOvercap = 2`.

#### 2.5.7 Dead-bonus mitigations

- **AC-4.7** Every security-positive event renders a floating `+N 보안` chip near the gauge for ~900 ms **regardless of clamp state**.
- **AC-4.8** If `securityOvercap > 0`, the ending safety card renders one line acknowledging the reserve; if 0, the line is absent.
- **AC-4.9** The ⚙ discovery always produces its own distinct beat and sets `state.flags.learningOff`, observable in the ending even when the gauge cannot move.

#### 2.5.8 Pre-mortem (DELIBERATE requirement — 3 scenarios)

1. **"The gauge crawls and nobody notices it."** Under G2 the earned segment spends the first two turns under 35%, which could read as "I'm doing badly" on a *correct* play. *Detection:* v0.1 gate step 8 asks testers to state, unprompted, whether they think they are doing well. *Mitigation now shipped:* §2.5.5's ghost segment shows the un-earned remainder as visible potential rather than absence. If it still reads as failure, the fallback is a copy/contrast change on the ghost label.
2. **"R-a is implemented as a comment, not a constraint."** An implementer writes `applyScore('raw'); applyScore('unverified')` and silently restores the 135-업무 bug. *Detection:* the v0.3 gate runs a scripted paste-everything run and asserts 업무 lands on **exactly 90**. *Mitigation:* `applyScore` takes `(sendOutcome, modifiers)` with `sendOutcome` a single enum — there is no second call to make.
3. **"A content edit silently re-opens the thesis hole."** *(rewritten again in v5 — this is the scenario that has now materialized **twice**, in different disguises.)* Someone adds a genuine span, retunes a threshold, changes a `neutralizedBy` entry, **re-authors a card so one 문단 or one 요약 unit concentrates most of its risk key**, or trims the card set — and a frontier climbs back above the 보안 threshold without anyone recomputing it. v3 shipped a falsified thesis past two reviewers who verified every tabulated row; **v4 then shipped a *relocated* version of the same hole past its own machine audit, because the audit enumerated only the subspace the previous fix had been aimed at.** *Detection:* the boot-time enumerator (§2.9.2, `?debug=audit`) recomputes **both** frontiers and the coverage band from the shipped content on **every load in debug mode** and **throws**, naming the offending outcome profile and the margin. Its enumeration domain is now written down completely (§2.9.2 clause B) precisely so that the next reader can see what it does *not* cover without having to rediscover it. *Additional detection:* `?debug=score` prints **unclamped** internal totals, the per-turn baseline ledger, **and each turn's coverage fraction**, and the v1.0 gate compares them against AC-4.5's fourteen reference runs rather than against the clamped bars.

### 2.6 채점 판정 모델 (DELIBERATE)

#### 2.6.1 What "검증 없이 답변 제출" means — reading (a), retained

**The two candidate readings.**

- **Reading (a) — per-card, zero-tool.** The row fires when a card whose answer contains at least one genuine hallucination span is sent with **zero** verification tools used on that turn. Using *any* tool — even on a decoy — satisfies "검증".
- **Reading (b) — per-uncaught-span.** The row fires once per genuine span left uncaught.

**Decision: reading (a).** Four reasons, in order:

1. **It is the more literal reading of the Korean.** The row is "검증 **없이** 답변 제출" — *submit without verification*, not *submit with incomplete verification*. Reading (b) silently rewrites "없이" as "불충분하게".
2. **It is the only reading under which correct verification is affordable at the tool cap the PRD itself sets.** Under (b), the cap guarantees the penalty on any card the player does not fully solve.
3. **It is what the plan's proof narrative already assumed** before the contradiction was found.
4. **It prices 확인하기 correctly without making it punitive.** The cost of *choosing the wrong span* is already the `업무 −3` and the forfeited `+5/+5` — PRD line 148's own stated purpose for the tool cap. Stacking an additional −25 on imperfect judgment turns the 구원 round back into a punishment round.

**A third reading, raised by the round-3 Architect and evaluated here.**

- **Reading (a′) — per-card, zero-*catches*.** The row fires when a tier-B card is sent and **no genuine span was caught** on that turn, regardless of how many tools were spent. This targets a real gap in (a): under (a), the entire −25 mechanic can be suppressed for the price of one click on any decoy — a *ritual* verification gesture. §2.6.5's **run 10** is that run, and it scores **81 / 100 → AI 네이티브**.
- **Decision: not adopted, and the reason is arithmetic rather than taste.** Each tier-B card offers 5 candidates, 2 genuine, and 2 tools. A player choosing 2 candidates at random catches at least one with probability `1 − C(3,2)/C(5,2) = 0.7`; across the three tier-B cards, the chance of escaping (a′) entirely is `0.7³ ≈ 0.34`. **Roughly two-thirds of a random-play cohort would eat at least one −25 under (a′)** — precisely the punishment register reason 4 rejects, applied to players who are *trying*.
- **What is adopted instead, since the gap is real:** (i) run 10 is a **permanent reference row** so the cost of ritual verification is visible (81 vs run 3's 96 — the ritual costs 15 업무 and buys nothing); (ii) a **non-scoring feedback beat** fires on any tier-B send where tools were spent and zero genuine spans were caught (copy → OQ-4 item 15); (iii) the **(a) / (a′) choice is routed to the PRD author** as **S0.2(B) Q2**, with run 10 named as the discriminator — under (a′) run 10 becomes 81 / 25 (유출 사고) and nothing else in the table moves. Adopting (a′) later is one predicate inside `applyScore`'s deferred-penalty branch.

**Scope of the row — stated as a supplied assumption.** The row applies only to cards whose answer carries at least one genuine hallucination span (content tier B: cards 3, 5, 6). It cannot fire on a tier-A card, because there is nothing there to have missed. This is a statement about **content**, not about UI: under §2.9.3's mechanic gating, card 4 exposes the full verification toolbar and still can never trigger the row. The PRD does not state this narrowing; it is a **supplied rule**, listed as **OQ-10** and routed in S0.2(B) Q2.

**Consequence stated honestly — masking is necessary, not sufficient.** Under (a), a run that masks all six cards perfectly but never opens the verification toolbar scores 보안 **25** and lands in `유출 사고` (reference run 5). This is deliberate: the game teaches **three** habits, and if 가리기 alone secured both gauges, 확인하기 would be decorative and §5's own 검증없이제출 row would be unreachable on any correct-play path. **The minimum sufficient play is: mask correctly on all cards + use at least one verification tool on each tier-B card** — a total cost of 업무 −9.

#### 2.6.2 Card 3's empty risk key and the grading precedence rule

**The defect this closed (round 2).** PRD §6 card 3 has **no risk elements at all** ("위험 요소: **없음** — 입력은 안전하다"). v2's grading clauses had no precedence and were not mutually exclusive on an empty key: "zero un-neutralized risk tokens → 정답" is vacuously true, and "nothing effective applied → 그대로 처리" is also true on a raw send. The second resolution would penalize −20 for sending a **safe** input — teaching the opposite of what the card exists to teach.

**Decision — an ordered, exclusive, total clause set with an explicit empty-key carve-out.** `gradeMasking(card, transformed)` evaluates in this order and returns at the first match. The ordering is normative; an implementation that reorders it is a defect, not a refactor.

```
gradeMasking(card, transformed) →
  // C0 is not reached: a rejected turn never calls the grader (R-c).
  let R = card.riskKey.size                    // derived at boot (F1e)
  let n = neutralized.size                     // R-n1, counted (R-n2)

  C1  if  R === 0
         → 'clean'   (가려서 처리 정답, 업무 +15 / 보안 0)        ← empty-key carve-out
  C2  else if  n === R                          // coverage 1.0
         → 'clean'   (가려서 처리 정답, 업무 +15 / 보안 0)
  C3  else if  n / R < SCORE.maskCoverageThreshold          // COVERAGE TEST — v5
         → 'raw'     (요청을 그대로 처리, 업무 +15 / 보안 −20, baseline forfeited — R-f′)
  C4  else                                      // θ ≤ coverage < 1
         → 'partial' (가리다 일부 놓침,  업무 +15 / 보안 −8)
```

- **C1 is the carve-out.** A card whose derived risk key is **empty** resolves as `가려서 처리 (정답)` **regardless of which tools were or were not applied**. The `그대로 처리` row is **structurally unreachable** on such a card.
- The set is **exclusive by construction** (each clause is guarded by the previous returning) and **total** (C4 is unguarded).
- `neutralized` / `unNeutralized` are computed by **R-n1**, the single neutralization rule, against `RISK_TYPES[type].neutralizedBy` plus the unconditional 요약 clause.
- **C3 is the clause v5 rewrites.** In v2–v4 it read `neutralized.size === 0`. §2.6.3 explains why that had to change and how θ was derived.
- **C1 and the dot-styling rule are deliberately decoupled** (E1b): card 3 graded `clean` with nothing applied still adds a **solid** dot, because the document did go in.

**Does card 3 still show the masking editor?** **Yes — M1 and M2 stay exposed on card 3** (AC-5.6). Hiding the editor would tell the player "there is nothing to mask here" *before* they have judged the input themselves, which destroys the card's entire pedagogical mechanism. On send, card 3 shows a dedicated reveal line — "이 입력에는 가릴 것이 없었습니다" plus the pivot to the answer side (copy → OQ-4).

#### 2.6.3 The raw/partial boundary is a COVERAGE test, and θ = 0.7 (NEW IN v5 — the central change)

**The defect this closes.** §5 names `가리다 일부 놓침` and `요청을 그대로 처리` as different outcomes but never says where one ends and the other begins. v2–v4 supplied an **existence test**: `neutralized.size === 0 → raw`, anything else → `partial`. Under v4's R-f′ that predicate acquired a second job it was never shaped for — deciding whether the turn's **entire baseline award** (17 at N=6, 20 at N=5, 25 at N=4) is granted or forfeited. The two jobs together made a **single click on a single risk token worth 29–37 points**:

| N | one token masked on one card | baseline recovered | penalty change (−20 → −8) | **total value of one click** |
| --- | --- | --- | --- | --- |
| 6 | e.g. one 실명 on card 1 (1 of 8 risk tokens) | +17 | +12 | **+29** |
| 5 | same | +20 | +12 | **+32** |
| 4 | same | +25 | +12 | **+37** |

Both round-4 reviewers independently enumerated the consequence: at **1–2 clicks** `AI 네이티브` is reachable at every shippable card count, and at **3 clicks** a run reaches a **perfect displayed 보안 of 100** while sending 7 of every 8 risk tokens in the clear. The reference figure is §2.6.5's **run 12**, which under v4's rules scores **72 / 100 → AI 네이티브** and under v5's scores **72 / 31 → 유출 사고**.

**Why the fix belongs on the boundary and not on the reward.** Principle 8. R-f′ is a *reward* rule keyed off the `raw` predicate; it can never be more discriminating than that predicate. Re-tuning the payout around a blind predicate relocates the exploit rather than removing it — which is exactly what v4 did, and is exactly what the proportional variant **R-f″** would do again (§2.6.6 option (vi), enumerated and falsified).

**The rule.**

> **R-g · The masking grade is a coverage test.** With `R = riskKey.size` (derived, F1e) and `n = neutralized.size` (R-n1), a send grades `raw` iff `0 < n/R < θ`, `partial` iff `θ ≤ n/R < 1`, and `clean` iff `n/R = 1` (or `R = 0`, clause C1). **`θ = SCORE.maskCoverageThreshold = 0.7`.**

**How θ was derived (not chosen by taste).** θ is constrained from both sides by the shipped content, and the admissible band is computed, not assumed:

- **Lower bound — θ must exceed the largest coverage any *single* mask application can produce.** The masking editor offers bulk selection at **문단 / 문장 granularity only** (AC-2.7 forbids a risk-type-keyed bulk select), so the largest one-application coverage is the largest count of same-tool risk tokens inside one 문단, or the largest risk-token count inside one 요약-eligible unit. From F1e's pinned sizes: card 1 → 2/8, card 2 → **5/8 = 0.625** (익명화 over the 5-name 참석자 문단 — the binding case), card 4 → 2/8, card 5 → 3/9, card 6 → 2/8. **Therefore θ > 0.625.**
- **Upper bound — θ must not fail a player who missed exactly one token.** §5 prices `가리다 일부 놓침` mildly (−8), so a near-complete mask must stay `partial`. `min over cards of (R−1)/R = 7/8 = 0.875`. **Therefore θ ≤ 0.875.**
- **Admissible band = (0.625, 0.875].**
- **Inside that band, the grade function is piecewise constant.** `need(c) = ⌈θ·R⌉` is what actually decides grades, and for the shipped sizes: `need = 6` for R = 8 ⟺ `0.625 < θ ≤ 0.75`; `need = 7` for R = 9 ⟺ `0.667 < θ ≤ 0.778`. **The intersection `(0.667, 0.75]` is a plateau on which every card's grade, for every possible play, is identical.** Its midpoint is ≈ 0.708.
- **θ = 0.7** is the round number nearest that midpoint, inside the plateau, with slack on both sides — so a later re-tune anywhere in `(0.667, 0.75]` provably changes nothing, and a re-tune outside it fails loudly at boot (clause F4).

**What θ = 0.7 means in plain Korean, and why it is teachable.** With F1e's pinned key sizes, `need` is 6 of 8 on cards 1/2/4/6 and 7 of 9 on card 5 — so on **every** card the rule collapses to one sentence:

> **놓친 위험 요소가 2개까지면 「가리다 일부 놓침」, 3개부터는 「그대로 처리」와 같다.**

That is a rule a player can internalize from feedback alone, and it is exactly the register §5 implies: a couple of misses is a mistake, a third of the document is a leak. The coverage *form* (`n/R < θ`) is what ships in code, because it stays correct if a card's key size changes; the "2 vs 3" sentence is what the feedback copy says.

**Cross-check against the plays the plan already names** (all recomputed, none assumed):

| play | card | coverage | grade under θ = 0.7 | grade under v4's existence test |
| --- | --- | --- | --- | --- |
| 전부 그대로 | any | 0/8 = 0 | `raw` | `raw` (same) |
| **one token clicked** (the v4 exploit) | 1 | 1/8 = 0.125 | **`raw`** | **`partial` ← the defect** |
| one 요약 unit collapsed | 2 | 3/8 = 0.375 | `raw` | `partial` |
| 참석자 문단 bulk 익명화 only | 2 | 5/8 = 0.625 | `raw` | `partial` |
| two 요약 units collapsed | 6 | 4/8 = 0.5 | `raw` | `partial` |
| 3 tokens missed (run 13) | any | 5/8 = 0.625 | `raw` | `partial` |
| **2 tokens missed** | 1/2/4/6 | 6/8 = 0.75 | **`partial`** | `partial` (same) |
| **1 token missed** (run 6) | 1/2/4/6 | 7/8 = 0.875 | **`partial`** | `partial` (same) |
| 1 token missed | 5 | 8/9 = 0.889 | `partial` | `partial` (same) |
| PRD-literal correct answer | 1–6 | 1.0 | `clean` (C2) | `clean` (same) |

**Every previously-good row is preserved and only the sub-θ rows move**, which is the property §2.6.5 verifies run by run.

**Is θ ratifiable later?** Yes, and it is marked as such: `SCORE.maskCoverageThreshold` is a single constant with a `// PRD §5 보완:` comment, read in exactly one place (`gradeMasking`), and its plateau is asserted at boot. It is a **Planner-supplied engineering default in the same category as the C1–C4 clause set and `baselineAward`** — it is not routed to the PRD author as an open question, because "where does 일부 놓침 become 그대로 처리" is a mechanics question the PRD delegates by omission. It **is** listed as a **v0.4 playtest tuning candidate** (OQ-5), with the plateau as its safe range and the "2 vs 3 misses" sentence as what a playtester is actually being asked about.

#### 2.6.4 The corrected security formula

For a completed round of N turns:

```
securityInternal =  Σ_{k : outcome(k) ≠ 'raw'} baselineAward(k, N)        // R-f′ — 100 exactly when no raw send occurred
                  + Σ_{turns} sendOutcomeSecurityDelta                    // 0 / −20 / 0 / −8  per the C1–C4 clause set,
                                                                          //   whose raw/partial split is R-g's coverage test
                  + 5 × (genuine spans caught)                            // ≤ 2 per turn via the tool cap
                  + (learningOff ? 10 : 0)                                // ⚙, once
                  − 25 × (tier-B cards SENT with zero verification tools)  // reading (a); never on 거절 (R-c)
                                                                          //   landing at turn k+2, else flushed (R-e)

securityDisplayed = clamp(securityInternal, 0, 100)

taskInternal     =  Σ_{turns} sendOutcomeTaskDelta                        // +15 on every send, 0 on 거절
                  − 3 × (verification tools used)
                  + 5 × (genuine spans caught)

taskDisplayed    = clamp(taskInternal, 0, 100)
```

Quadrant classification uses the **displayed (clamped)** values, so that "100이 만점" is literally the top of both axes (AC-8.1). The v1.0 gate reads **both** the clamped and unclamped columns, because two different internal values can display identically (runs 2, 7 and 13 all display 보안 0).

#### 2.6.5 AC-4.5's reference table — recomputed from scratch under the coverage boundary

Every number below is re-derived from §2.6.4 rather than carried over. `baselineAward(k,6) = 17, 16, 17, 17, 16, 17` (Σ = 100). Content tier B = cards 3, 5, 6. Card 3's risk key is **empty** (C1). Unless a row says otherwise, the ⚙ is **not** discovered. Thresholds: 업무 high iff `≥ 10·N`; 보안 high iff `≥ 60`.

> **Runs 1–11 are v4's table.** All eleven were re-derived independently under R-g and **all eleven are unchanged**, because none of them sits in the sub-θ band that R-g moves: runs 1/3/4/10 are clean, run 6 is 7/8 coverage on every masked card, and runs 2/5/7/8/9/11 involve no masking at all. **Runs 12, 13 and 14 are new in v5** and exist because the old table contained no row anywhere in the newly-reclassified band — which is precisely why v4's audit could pass while the exploit was live.

**Run 1 · 전부 거절 (6건 모두 거절)**

| | 업무 | 보안 |
| --- | --- | --- |
| baseline (R-f′: no raw send, all 6 kept) | — | +100 |
| send outcomes: 6 × 거절 | 6 × 0 = **0** | 6 × 0 = 0 |
| 검증없이제출 | — | **0** — rejected requests produce no answer (R-c) |
| **internal / displayed** | **0 / 0** | **100 / 100** |
| quadrant | | **안전한 무능** |

✓ **PRD 설계 의도 1 (보안 100 / 업무 0) reproduced exactly, and still exactly under R-g** — the coverage test never runs on a rejected turn.

**Run 2 · 전부 그대로 (masking 전무, 검증 전무)**

| | 업무 | 보안 |
| --- | --- | --- |
| baseline: card 3 only (cards 1,2,4,5,6 forfeited — R-f′) | — | **+17** |
| cards 1,2,4,5,6 → C3 `raw` (coverage 0) | 5 × +15 = 75 | 5 × −20 = **−100** |
| card 3 → C1 `clean` (empty risk key) | +15 | **0** |
| 검증없이제출: tier-B cards 3,5,6 sent with 0 tools | — | 3 × −25 = **−75** |
| **internal / displayed** | **90 / 90** | **−158 / 0** (undercap 158) |
| quadrant | | **유출 사고** |

✓ **PRD 설계 의도 2 (업무 90 / 보안 0) reproduced exactly.**

**Run 3 · 전부 가려서 + 최소 검증** — clean mask on all 6 (coverage 1.0); on each of cards 3, 5, 6 exactly 1 tool → 1 genuine catch; ⚙ found and switched off.

| | 업무 | 보안 |
| --- | --- | --- |
| baseline (no raw send) | — | +100 |
| 6 × `clean` (card 3 via C1, the rest via C2) | 6 × +15 = 90 | 6 × 0 = 0 |
| 검증없이제출 | — | **0** — ≥1 tool on every tier-B card (reading (a)) |
| tools: 3 × −3 | −9 | — |
| catches: 3 × (+5/+5) | +15 | +15 |
| ⚙ off | — | +10 |
| **internal / displayed** | **96 / 96** | **125 / 100** (overcap 25) |
| quadrant | | **AI 네이티브** |

✓ PRD 설계 의도 3 (가려서 처리 → 둘 다 확보) reproduced. The **comfortable** ceiling.

**Run 4 · 전부 가려서 + 최대 검증** — 2 tools and 2 genuine catches on each of cards 3, 5, 6 (exactly the turn cap).

| | 업무 | 보안 |
| --- | --- | --- |
| baseline | — | +100 |
| 6 × `clean` | 90 | 0 |
| tools: 6 × −3 / catches: 6 × (+5/+5) | −18 / +30 | +30 |
| ⚙ off | — | +10 |
| **internal / displayed** | **102 / 100** (taskOvercap 2) | **140 / 100** (overcap 40) |
| quadrant | | **AI 네이티브** |

The **expert** ceiling, and the reason `100이 만점` is literally reachable on the 업무 axis.

**Run 5 · 마스킹은 완벽, 검증은 전무** — clean mask on all 6, **zero** tools, ⚙ 미발견.

| | 업무 | 보안 |
| --- | --- | --- |
| baseline | — | +100 |
| 6 × `clean` | 90 | 0 |
| 검증없이제출: cards 3, 5, 6 with 0 tools | — | 3 × −25 = **−75** |
| **internal / displayed** | **90 / 90** | **25 / 25** |
| quadrant | | **유출 사고** |

**The load-bearing statement of §2.6.1's consequence:** 가리기 alone is *necessary but not sufficient*.

**Run 6 · 대충 가리기** — every card masked with **exactly one risk token missed** on each of cards 1, 2, 4, 5, 6 (coverage 7/8, 7/8, 7/8, 8/9, 7/8 — **all ≥ θ, so all `partial`**; card 3 clean via C1); 1 tool + 1 catch on each of 3, 5, 6; ⚙ 미발견.

| | 업무 | 보안 |
| --- | --- | --- |
| baseline (partial is not raw — baseline kept) | — | +100 |
| cards 1,2,4,5,6 → C4 `partial` | 5 × +15 = 75 | 5 × −8 = −40 |
| card 3 → C1 `clean` | +15 | 0 |
| tools −9 / catches +15 | +6 | +15 |
| **internal / displayed** | **96 / 96** | **75 / 75** |
| quadrant | | **AI 네이티브** (at 보안 threshold 60) |

Shows the threshold is **forgiving**: sloppy-but-real masking still reaches `AI 네이티브` at 60. **With the ⚙ also found this run reads 96 / 85.** *(This row is the upper bound of the "careful but imperfect" register and is one of the two numbers OQ-5's tuning question turns on.)*

**Run 7 · 최악 (강) — 카드 1·2·4 그대로, 3·5·6 거절**

| | 업무 | 보안 |
| --- | --- | --- |
| baseline: cards 3,5,6 kept (17+16+17); cards 1,2,4 **forfeited** | — | **+50** |
| cards 1,2,4 → C3 `raw` | 3 × +15 = 45 | 3 × −20 = −60 |
| cards 3,5,6 → 거절 | 0 | 0 |
| 검증없이제출 | — | **0** — the three tier-B cards were rejected (R-c) |
| **internal / displayed** | **45 / 45** | **−10 / 0** (undercap 10) |
| quadrant | | **최악** |

> **This row tests both halves of R-f′ in one line:** the three 거절 turns *keep* their baseline (+50) and the three raw turns *forfeit* theirs. A value of 40 means the forfeit half was not implemented; −60 internal means the keep half was not.

**Run 8 · 마스킹 전무 · 거절 2 · 검증 최대 — the CRITICAL-A regression row.** c1 raw, c2 raw, c3 sent with 2 tools / 2 catches, c4 거절, c5 raw with 2 tools / 2 catches and the ⚙ found, c6 거절.

| | 업무 | 보안 |
| --- | --- | --- |
| baseline: turns 3, 4, 6 kept (17+17+17); turns 1, 2, 5 forfeited | — | **+51** |
| c1, c2, c5 → C3 `raw` | 3 × +15 = 45 | 3 × −20 = **−60** |
| c3 → C1 `clean` | +15 | 0 |
| c4, c6 → 거절 | 0 | 0 |
| tools 4 × −3 / catches 4 × (+5/+5) | −12 / +20 | +20 |
| ⚙ off | — | +10 |
| **internal / displayed** | **68 / 68** | **21 / 21** |
| quadrant | | **유출 사고** |

> Under v3's rules this run scored 68 / 70 → `AI 네이티브`. It is retained as the zero-masking regression row.

**Run 9 · 마스킹 전무 · 최적해 — the maximum of the ZERO-masking frontier.** c1 거절, c2 raw, c3 sent 2 tools / 2 catches, c4 거절, c5 raw 2/2, c6 raw 2/2, ⚙ found.

| | 업무 | 보안 |
| --- | --- | --- |
| baseline: turns 1, 3, 4 kept (17+17+17); turns 2, 5, 6 forfeited | — | **+51** |
| c2, c5, c6 → C3 `raw` | 3 × +15 = 45 | 3 × −20 = −60 |
| c3 → C1 `clean` | +15 | 0 |
| tools 6 × −3 / catches 6 × (+5/+5) | −18 / +30 | +30 |
| ⚙ off | — | +10 |
| **internal / displayed** | **72 / 72** | **31 / 31** |
| quadrant | | **유출 사고** |

> **The best 보안 any zero-masking run can reach while clearing the 업무 threshold** — verified by exhaustive enumeration in §2.6.6. 31 against a threshold of 60 is a **29-point margin**.

**Run 10 · 의식적 검증 (ritual verification)** — clean mask on all 6; on each tier-B card exactly 1 tool spent on a **decoy**, so zero genuine spans caught; ⚙ 미발견.

| | 업무 | 보안 |
| --- | --- | --- |
| baseline | — | +100 |
| 6 × `clean` | 90 | 0 |
| 검증없이제출 | — | **0 under reading (a)** — a tool *was* used |
| tools 3 × −3 / catches 0 | −9 | 0 |
| **internal / displayed** | **81 / 81** | **100 / 100** |
| quadrant | | **AI 네이티브** |

> **The (a) / (a′) discriminator row.** Under (a′) this becomes **81 / 25 → 유출 사고**, and no other row moves.

**Run 11 · 최악 (약) — 카드 1·2 그대로, 3·4·5·6 거절**

| | 업무 | 보안 |
| --- | --- | --- |
| baseline: turns 3,4,5,6 kept (17+17+16+17); turns 1, 2 forfeited | — | **+67** |
| c1, c2 → C3 `raw` | 2 × +15 = 30 | 2 × −40 total = −40 |
| c3–c6 → 거절 | 0 | 0 |
| **internal / displayed** | **30 / 30** | **27 / 27** |
| quadrant | | **최악** |

> Exists so that **`최악` has a reference run with a non-zero displayed value on both axes**, since run 7 displays 보안 0.

**Run 12 · 최소 마스킹 (토큰 1개씩) — *the v5 regression row, and the exact run both round-4 reviewers used*.** c1 거절, **c2 with exactly one 실명 masked (1/8 = 0.125)**, c3 sent 2 tools / 2 catches, c4 거절, **c5 with exactly one 실명 masked (1/9 = 0.111)** + 2 tools / 2 catches, **c6 with exactly one 거래처명 masked (1/8 = 0.125)** + 2 tools / 2 catches, ⚙ found. **Three mask clicks in the entire run.**

| | 업무 | 보안 (v5, θ = 0.7) | 보안 (v4, existence test) |
| --- | --- | --- | --- |
| c1 거절 | 0 | +17 | +17 |
| c2 — coverage 0.125 → **`raw`** (v4: `partial`) | +15 | **−20** (baseline forfeited) | +8 (16 − 8) |
| c3 → C1 clean, 2 tools / 2 catches | +19 | +27 (17 + 10) | +27 |
| c4 거절 | 0 | +17 | +17 |
| c5 — coverage 0.111 → **`raw`**, 2 tools / 2 catches | +19 | **−10** (−20 + 10) | +18 (16 − 8 + 10) |
| c6 — coverage 0.125 → **`raw`**, 2 tools / 2 catches | +19 | **−10** | +19 (17 − 8 + 10) |
| ⚙ off | — | +10 | +10 |
| **internal / displayed** | **72 / 72** | **31 / 31 → 유출 사고** | **116 / 100 → AI 네이티브** |

> **This single row is the whole of iteration 5.** Three clicks, 21 of 24 risk tokens sent in the clear, and under v4's rules a *perfect* displayed 보안 of 100 — visually identical to run 3's ending screen. Under R-g the three sub-θ cards grade `raw`, and the run collapses onto run 9's value exactly. **That collapse is not a coincidence: under a coverage boundary, every sub-θ profile scores identically to its zero-masking counterpart, which is what makes §2.6.6's widened enumeration finite.**

**Run 13 · 흉내만 가리기 (카드마다 3개씩 놓침, coverage 5/8) — 검증 전무, ⚙ 미발견.** Cards 1, 2, 4, 6 masked to 5/8 and card 5 to 5/9, all below θ; card 3 untouched.

| | 업무 | 보안 |
| --- | --- | --- |
| baseline: card 3 only (five sub-θ cards forfeit — R-f′ via R-g) | — | **+17** |
| cards 1,2,4,5,6 → C3 `raw` (coverage 0.625 / 0.556) | 5 × +15 = 75 | 5 × −20 = −100 |
| card 3 → C1 `clean` | +15 | 0 |
| 검증없이제출: 3, 5, 6 with 0 tools | — | 3 × −25 = −75 |
| **internal / displayed** | **90 / 90** | **−158 / 0** (undercap 158) |
| quadrant | | **유출 사고** |

> **Run 13 must produce byte-identical totals to run 2.** That identity is the readable assertion that R-g is implemented: under the existence test this run scored 90 / 40 (five partials keeping their baselines), and "흉내만 가리기" was cheaper than not masking at all *by 40 points*. Under R-g, masking a third of a document is worth exactly what it is worth — nothing.

**Run 14 · 한 장만 제대로 가리기 — the maximum of the ONE-CARD frontier, and the disclosed boundary of the claim.** c1 거절, c2 raw, **c6 fully masked (coverage 1.0 → `clean` via C2)** + 2 tools / 2 catches, c3 2 tools / 2 catches, c4 거절, c5 raw + 2 tools / 2 catches, ⚙ found.

| | 업무 | 보안 |
| --- | --- | --- |
| c1 거절 / c4 거절 | 0 / 0 | +17 / +17 |
| c2 → `raw` | +15 | −20 |
| c3 → C1 clean, 2/2 | +19 | +27 |
| c5 → `raw`, 2/2 | +19 | −10 |
| **c6 → `clean` (C2), 2/2** | +19 | **+27** (17 + 10) |
| ⚙ off | — | +10 |
| **internal / displayed** | **72 / 72** | **68 / 68** |
| quadrant | | **AI 네이티브** |

> **A member of the weakest class that still reaches the target ending — but NOT the cheapest member of it.** It masks **one** card completely, verifies every tier-B card at the cap, finds the ⚙, rejects two requests — and still sends two documents wholesale. It satisfies the necessity property (masking was required), and it is **deliberately disclosed rather than hidden**: §2.6.6's "boundary of the claim" is written against this row, and OQ-12(ii) routes to the PRD author the one judgment the Planner should not make alone — whether a run containing *any* raw send should be eligible for `AI 네이티브` at all.
>
> **Run 14 is not, however, the cheapest way into this class, and it would be dishonest to route the question with only the expensive example attached.** Run 14 masks **card 6**, which takes four separate tool applications (마스킹 and 익명화 on the 핵심 조항, plus two 요약 collapses). The two rows below — found and verified independently by the **round-5 Critic** — are members of the *same disclosed class* reachable with **two** and **three** applications, and one of them lands exactly on the threshold. **A human answering OQ-12(ii) should be shown the cheapest member, not a more expensive one.**

**Run 14a · 두 번의 조작으로 한 장 (the CHEAPEST member of the one-card class).** c1 거절, c4 거절, **c2 fully masked (coverage 8/8 → `clean` via C2)**, c3 2 tools / 2 catches, c5 raw + 2/2, c6 raw + 2/2, ⚙ found. **Card 2 is the cheapest card in the game to clean**, because its risk key partitions into exactly two bulk-addressable regions: the 5-name 참석자 문단 (`문단 전체 선택` → `익명화`, 5 tokens in one gesture) and the 요약-eligible 논의 본문 unit (select any token → `요약`, the remaining 3 tokens in one gesture). **그 카드는 문단 전체 선택 + 익명화 한 번, 요약 한 번 — 단 두 번의 일괄 적용만으로 완전히 「클린」 판정을 받을 수 있는 구조다.** Card 2 is also pre-전환점, so it exposes no verification UI and costs no 업무 for tools.

| | 업무 | 보안 |
| --- | --- | --- |
| c1 거절 / c4 거절 | 0 / 0 | +17 / +17 |
| **c2 → `clean` (C2), 2 bulk applications, no verify UI** | **+15** | **+16** (card 2's baseline is 16, not 17) |
| c3 → C1 clean, 2/2 | +19 | +27 |
| c5 → `raw`, 2/2 | +19 | −10 |
| c6 → `raw`, 2/2 | +19 | −10 |
| ⚙ off | — | +10 |
| **internal / displayed** | **72 / 72** | **67 / 67** |
| quadrant | | **AI 네이티브** |

**Run 14b · 세 번의 조작, 정확히 경계선 위 (the exact-boundary member).** c1 거절, c4 거절, **c6 masked to 6/8 = 0.75 ≥ θ → `partial` via C4** using **three** bulk applications (`마스킹` on the 핵심 조항's two 거래처명, `익명화` on its two 금액, one `요약` collapse on one of the two 조항 units), c3 2/2, c2 raw, c5 raw + 2/2, ⚙ found.

| | 업무 | 보안 |
| --- | --- | --- |
| c1 거절 / c4 거절 | 0 / 0 | +17 / +17 |
| **c6 → `partial` (C4), 3 bulk applications, 2/2** | +19 | **+19** (17 − 8 + 10) |
| c3 → C1 clean, 2/2 | +19 | +27 |
| c2 → `raw` | +15 | −20 |
| c5 → `raw`, 2/2 | +19 | −10 |
| ⚙ off | — | +10 |
| **internal / displayed** | **72 / 72** | **60 / 60** |
| quadrant | | **AI 네이티브 — exactly on the threshold** |

> **What these two rows add, and what they do NOT change.** They change **no rule, no constant and no acceptance criterion**; every number above falls out of the same §5 table, the same R-f′/R-g, the same θ = 0.7 and the same 60 threshold that were already approved. What they change is the plan's own **honesty about the shape of the disclosed class**: the cheapest route in costs **two masking gestures** (14a, 67) rather than run 14's four, and the class extends **all the way down to the threshold itself** (14b, exactly 60). Both remain inside the class §2.6.6 discloses and clause B2 records — the one-card frontier's *maximum* at N = 6 is still 68, as clause B2 asserts. **All three rows (14, 14a, 14b) should be put in front of the PRD author together when OQ-12(ii) is answered.**

**Quadrant reachability at the proposed thresholds (업무 ≥ 10·N, 보안 ≥ 60):** 안전한 무능 = run 1; 유출 사고 = runs 2, 5, 8, 9, 12, 13; AI 네이티브 = runs 3, 4, 6, 10, 14 (and the two disclosure witnesses 14a, 14b); 최악 = runs 7, 11. **All four reachable ✓** — and every `AI 네이티브` row now involves masking at least one card to at least θ coverage, which is the part §2.6.6 proves.

#### 2.6.6 The necessity property, restated over the sub-θ space, and both frontiers

**What round 4 found.** v4 stated the thesis as **N-1**: *no run in which the masking editor never neutralized a single risk token may be classified `AI 네이티브`*. That property was true and machine-checked. It was also **the wrong property**, because it quantified over a subspace (`n = 0`) strictly smaller than the set of runs that perform no meaningful masking (`n/R < θ`). Both round-4 reviewers found the same thing independently: the audit was green, and run 12 was live.

**The restated property.**

> **N-1′ (NORMATIVE, AC-8.1b).** For every shippable card set, **no run in which *every* send's masking coverage fell below θ may be classified `AI 네이티브`.** Formally: no run in which every send graded `raw`, `reject`, or `clean` via **C1** — i.e. none graded `clean` via **C2** and none graded `partial`.
>
> Equivalently, and this is the form the audit uses: **every `AI 네이티브` run must contain at least one card on which at least `⌈θ·R⌉` of the risk key was genuinely neutralized.**

N-1′ **subsumes N-1** (`n = 0` implies `n/R < θ`), so nothing v4 proved is lost, and the entire minimal-masking class is now inside the quantifier.

**Why the enumeration stays finite and small.** Under R-g, *how many* tokens were masked is invisible to the score whenever coverage is below θ — every sub-θ state produces the same grade, the same −20, and the same forfeited baseline. **The sub-θ subspace therefore collapses to a single per-card equivalence class**, identical to the zero-masking class v4 enumerated. This is the structural reason the fix is cheap: the audit's domain grows from "one point" to "an equivalence class containing that point", with no growth in the enumeration itself.

**Options for closing it, all evaluated by enumeration rather than argument.**

- **(i) Raise the 보안 threshold.** Enumeration of the sub-θ space gives frontier maxima of **31 / 50 / 40** at N = 6 / 5 / 4. Raising the threshold *would* work against these numbers, but it does not close the class the exploit lives in on its own — under the **existence** boundary the minimal-masking frontier reaches **displayed 100** at every N (run 12), and **no flat threshold up to and including 100 can exclude a run that displays 100.** **Invalidated as a standalone fix — and this is the specific claim v4 got arithmetically wrong** (v4 wrote that closing "시늉만 가리기" needs 보안 ≥ 86; both round-4 reviewers showed by enumeration that the frontier reaches 100, so no such threshold exists). The corrected numbers are in "the boundary of the claim" below.
- **(ii) Give 거절 a 보안 cost.** Directly targets the rejection lever, but 거절 is `0 / 0` in the §5 table and 전부 거절 → 보안 100 is a PRD 설계 의도 literal; any cost breaks run 1. **Not adoptable by the Planner** — routed as OQ-12's alternative.
- **(iii) Raise the 업무 threshold.** Closes N-1 arithmetically at 업무 ≥ 88 (N=6), but 업무's reachable maximum is 102, so any single 거절 (−15) would disqualify a player from `AI 네이티브` forever — contradicting §5's own framing of 거절 as a legitimate outcome, and making exploratory verification disqualifying too. **Rejected on pedagogy.**
- **(iv) Forfeit the baseline on a raw send (R-f′).** Adopted in v4 and **retained**. Necessary but, on its own, **not sufficient** — it is exactly as discriminating as the predicate it keys off.
- **(v) Make the grade boundary itself coverage-based (R-g) — ADOPTED, and the change of this iteration.** It fixes the predicate rather than the payout, so R-f′, the −20/−8 split, the dot styling and the feedback copy all inherit the correction at once. It changes **no §5 value** (the PRD never defined this boundary), preserves all three 설계 의도 outcomes exactly, and has a one-sentence teachable semantics ("3개부터는 안 가린 것과 같다").
- **(vi) R-f″ — proportional forfeiture (`baseline × n/R` instead of all-or-nothing) — TRIED AND FALSIFIED, do not re-propose.** It is the natural-looking alternative to (v): keep the existence boundary, but scale the reward. Enumeration shows it buys **exactly zero** additional closure over R-f′, because **the exploit's maximizing profile always fully masks whichever card it touches rather than partially masking many** — at the maximum, `n/R = 1.0` and proportional forfeiture degenerates to the all-or-nothing rule it was meant to replace. Concretely, under R-f″ run 14's profile is unchanged (its masked card is at coverage 1.0) and run 12 merely moves from 100 to a lower but still-passing value on some card sets. It is a reward-side patch inheriting a coverage-blind predicate, which is Principle 8 exactly. **Recorded here so the next iteration does not spend a round rediscovering it.**

**Verification — FRONTIER 1: the zero-masking frontier, recomputed from scratch.** The enumerator takes every legal zero-masking profile per card (거절, or a send at every tool count 0–2 × every catch count 0–2 permitted by that card's genuine-span count, with the C1 carve-out and the reading-(a) penalty applied), forms the full product across the set, and reports the maximum displayed 보안 among profiles that clear the 업무 threshold.

| card set | N | 업무 threshold | max 보안, ZERO masking | witness profile | verdict at 보안 ≥ 60 |
| --- | --- | --- | --- | --- | --- |
| full `{1..6}` | 6 | 60 | **31** (at 업무 72) | run 9 | ✓ closed, margin **29** |
| fallback `{1,2,3,4,6}` | 5 | 50 | **50** (at 업무 53) | c3 clean 2/2, c6 raw 2/2, one tier-A raw, two tier-A 거절, ⚙ | ✓ closed, margin **10** |
| `DEMO_MODE {1,3,4,6}` | 4 | 40 | **40** (at 업무 53) | c3 clean 2/2, c6 raw 2/2, one tier-A raw, one tier-A 거절, ⚙ | ✓ closed, margin **20** |

*Derivation of the N = 6 maximum, shown once so the method is checkable by hand.* Card 3 is dominant as `clean` with 2 tools / 2 catches (`업무 +19, 보안 +27`); every other card offers either 거절 (`0, +b_k`) or raw (`+15, −20`, or `+19, −10` on a tier-B card with 2 tools / 2 catches). Card 3 plus the two cheapest 업무 sources (cards 5 and 6 raw at 2/2) yields 업무 57 — **below** the 60 threshold — so **a third card must be sent raw**, costing its baseline plus 20. The cheapest such card is card 2 (baseline 16 rather than 17). Total: 업무 19+19+19+15 = **72**; 보안 27 + (−10) + (−10) + (−20) + 17 + 17 + 10 = **31**. Every alternative was checked: substituting card 1 or 4 for card 2 gives 30; using 1-tool/1-catch profiles gives 26; taking four raw cards gives less. **31 is the maximum.**

**Verification — FRONTIER 2: the minimal-masking frontier (NEW in v5).** This is the frontier v4 had no way to compute. Its domain is every run in which **each** card's coverage is below θ but **not necessarily zero** — the entire class run 12 lives in.

| card set | N | max 보안, minimal masking — **v4 (existence boundary)** | verdict | max 보안, minimal masking — **v5 (coverage boundary, θ = 0.7)** | verdict |
| --- | --- | --- | --- | --- | --- |
| full `{1..6}` | 6 | **100 displayed** (internal 116) at 업무 72, **3 mask clicks** | ✗ `AI 네이티브` reachable | **31** (at 업무 72) | ✓ closed, margin **29** |
| fallback `{1,2,3,4,6}` | 5 | **100 displayed** (internal 114) at 업무 53, **2 mask clicks** | ✗ | **50** (at 업무 53) | ✓ closed, margin **10** |
| `DEMO_MODE {1,3,4,6}` | 4 | **100 displayed** (internal 114) at 업무 53, **2 mask clicks** | ✗ | **40** (at 업무 53) | ✓ closed, margin **20** |

> **Frontier 2 equals Frontier 1 at every N, exactly.** That is the proof obligation discharged, not a coincidence to be checked separately: R-g makes coverage below θ score-invariant, so the two domains have the same image under the scoring function. **The minimal-masking exploit is closed at every shippable card count, with the same margins as the zero-masking property, and by the same enumeration.**

**Adversarial sweep before declaring it closed.** The reviewers' method was to look for a cheap lever, not to re-verify the claimed rows, so the same was done here. Each of the following was enumerated and none reaches 보안 60 within the sub-θ space:

| attempted lever | best result (N = 6) | why it fails |
| --- | --- | --- |
| mask exactly `need − 1` tokens on every card (maximum sub-θ effort) | 72 / 31 | identical to zero masking by construction (run 13 at the 업무-maximizing profile) |
| concentrate all effort on one card, still sub-θ (5 of 8) | 72 / 31 | same equivalence class |
| use 요약 to erase the largest eligible unit on cards 2 and 6 | 3/8 and 2/8 coverage → 72 / 31 | R-m3 bounds every unit below `need`; clause F2 enforces it |
| bulk-select the 참석자 문단 and 익명화 (card 2's largest single application) | 5/8 = 0.625 < 0.7 → 72 / 31 | this is the case that sets θ's lower bound |
| reject more, send fewer | 업무 falls below 60 → `안전한 무능` | rejections buy 보안 but cost the 업무 threshold |
| maximize catches everywhere (6 catches, +30/+30) | already included in the 31 | catches are 업무-positive but cannot lift 보안 past the forfeited baselines |
| find the ⚙ and never mask | already included (+10) | one-time bonus, insufficient |
| DEMO_MODE with its larger per-turn baseline (25) | 53 / 40 | fewer cards means fewer baselines to bank; margin 20 |

**The boundary of the claim, with the corrected arithmetic.** N-1′ covers *no meaningful masking anywhere*. It does **not** claim that masking *one* card suffices to fail. It does not, and here is exactly what that costs, computed rather than estimated:

| run class | N = 6 | N = 5 | N = 4 |
| --- | --- | --- | --- |
| sub-θ on every card (N-1′'s domain) | 31 | 50 | 40 |
| **≥ θ on exactly one card** (run 14's class) | **68** | **90** | **85** |
| ≥ θ on every card, one token missed each (run 6's class) | 75 (85 with ⚙) | 78 (88 with ⚙) | 86 (96 with ⚙) |
| clean everywhere (run 3) | 100 | 100 | 100 |

> **The one-card row is a class, not a point, and its cheap members matter more than its maximum.** The **68 / 90 / 85** figures are the class *maxima* (what clause B2 asserts). What a human answering OQ-12(ii) actually needs to see is the **cheapest** way into the class and **how far down it reaches**, both of which the round-5 Critic computed independently and both of which are now worked out as named rows in §2.6.5: **run 14a** reaches 업무 72 / 보안 **67** at N = 6 by cleaning **card 2 with only two bulk tool applications** (`문단 전체 선택` + `익명화` on the 5-name 참석자 문단, then one `요약` collapse on the 논의 본문 unit) — **cheaper than run 14's four applications on card 6** — and **run 14b** reaches 업무 72 / 보안 **exactly 60**, sitting precisely on the shipped threshold, with three bulk applications on card 6. Neither changes any rule or constant; they change only what the plan *shows* about the class it discloses.

- **To exclude the one-card class by threshold alone** you would need 보안 ≥ **69** at N = 6, ≥ **91** at N = 5, ≥ **86** at N = 4.
- **At N = 5 no SINGLE FLAT threshold — one number reused at every card count — can do it** *(corrected in the round-5 merge; the earlier wording said "provably impossible" in an absolute sense, which overstates the result).* The precise statement is this: the one-card frontier at N = 5 (**90**) sits **above** a careful-but-imperfect player who verifies **minimally** (**88** with the ⚙), so a flat threshold that excludes the exploit also excludes that player. **There is therefore no flat 보안 threshold, at any value, that both excludes "masked one card and rejected the rest" and admits "masked every card imperfectly while verifying minimally," at N = 5.**
  - **But a per-card-count-scaled threshold CAN separate them at N = 5, and this was verified independently by the round-5 Critic.** The 업무 axis is already scaled per card count (`10·N`); the 보안 axis is not. If 보안 were likewise a **triple** rather than one flat number, a value of roughly **91 at N = 5** would exclude the disclosed exploit (90) while still admitting a careful-but-imperfect player who uses **maximum** verification effort on every applicable card (**≈98**).
  - **The cost of that option is real and should be stated with it:** it abandons this plan's deliberately simple flat-threshold design (one number, one sentence, one boot assertion), and — because it clears the exploit only by sitting between 90 and 98 — it effectively **requires near-maximal verification effort from a careful player to qualify for the top ending at that card count**. A player who masks everything carefully but verifies sparingly would be pushed out of `AI 네이티브` at N = 5. That is a pedagogy change, not a tuning tweak.
  - **So the accurate summary is:** *flat* threshold closure is impossible at N = 5; *scaled* threshold closure is possible there but buys the closure by raising the verification bar. Both remain the PRD author's call under OQ-12(ii), and neither is taken by the Planner.
- **The reason is a PRD literal, not a modelling artifact:** §5 prices 거절 at 보안 **0** and 일부 놓침 at **−8**. A run that *rejects* what it will not mask is, on the 보안 axis alone, strictly better than one that masks everything imperfectly. The axis that actually separates them is **업무** (53 vs 79 at N = 5) — which is what the 2×2 already uses it for.
- **Structural closure is the only option that holds identically across ALL shipped card counts at once — but it is not the only option on the table** *(softened in the round-5 merge; the earlier wording said "the only closure available is structural," which is true only under the all-card-counts-simultaneously requirement).* Three options exist, and the PRD author should see all three:
  - **(α) Structural rule R-h** — **"any run containing ≥ 1 raw send cannot be classified `AI 네이티브`."** A one-line change in `endingQuadrant`. It is **the only option that closes the class identically at N = 6, 5 and 4 simultaneously**, and it needs no threshold retune. Its cost: a single unmasked send becomes permanently disqualifying — a punishment register that contradicts §5's forgiving treatment of mistakes and this plan's 구원 framing of round 2. **It re-prices §5 row 1 in effect, so it is the PRD author's call, not the Planner's.**
  - **(β) A purely score-based closure at the default card count alone.** **At N = 6 — the largest and the shipped-default set — a flat 보안 threshold of 69 closes the entire disclosed class with no structural rule at all**: it excludes the one-card frontier (68, and with it witnesses 14a at 67 and 14b at 60) while still admitting the careful-but-imperfect run (75, or 85 with the ⚙). **No new rule, no new concept, one constant moved from 60 to 69.** Its cost: it does **not** generalize — at N = 5 the required 91 has the flat-threshold problem described above, and it narrows the `AI 네이티브` band at N = 6 for everyone, including careful players, so it must be read against OQ-5's playtest question rather than adopted on arithmetic alone.
  - **(γ) A per-card-count 보안 threshold triple** (e.g. `{6: 69, 5: 91, 4: 86}`), which closes it at every N without a structural rule, at the cost of the flat-threshold design and — at N = 5 — of effectively requiring near-maximal verification from a careful player.
  - **Routing.** All three go to the author as **OQ-12(ii) / S0.2(B) Q6(ii)**, with **runs 14, 14a and 14b** and **run 6** as the named discriminators. **The plan proceeds at a flat 보안 60 without R-h**, and the audit records the one-card frontier on every load (clause B2) so the decision stays visible rather than forgotten.

**One more edge, recorded rather than hidden.** A sub-θ run that rejects all three tier-A cards and sends all three tier-B cards with full verification scores 업무 57 / 보안 67 — below the 업무 threshold, so it classifies `안전한 무능`. That is the correct quadrant, but 보안 67 is generous for a run that leaked two documents. It is inside N-1′, it is visible in the audit output, and it is part of what OQ-5's threshold question is asked against.

### 2.7 DEMO_MODE 카드 세트 — an honest 4-way tradeoff, decided

PRD §13 asks whether a 시연용 축약 모드 is needed for a live audience. Below is the comparison, on **eight criteria**.

**Coverage facts for the full set (derived from §6, §7 and §2.9.1's technique map, not assumed):**

- **Masking techniques required** — 익명화: cards 1, 2, 5, 6. 마스킹: cards 1, 6. 요약: cards 2, 6. 가상데이터: card 4 (**only** card 4 — see §2.9.1).
- **Verification tools** (assignment in §2.8) — 근거요구: card 3. 원문대조: cards 3, 5, 6. 교차확인: card 6. 자가검토: card 5 (**only** card 5).
- **Narrative anchors** — boomerang owners: cards 1 and 3. 전환점: card 3. 최종 관문: card 6. Round-1 pre-read: cards 1, 2, 3, 4.
- **Content tiers** — A (no genuine span): 1, 2, 4. B (exactly 2 genuine spans): 3, 5, 6.

| # | Criterion | **D-A = {1,3,4,6}** | **D-B = {1,2,3,4}** |
| --- | --- | --- | --- |
| 1 | 마스킹 4기법 coverage | **4/4** — 익명화·마스킹 (c1, c6), 요약 (c6), 가상데이터 (c4) | 3/4 — 요약 only via card 2, but 교차확인/최종관문 are lost, see rows 5–7 |
| 2 | 검증 4기법 coverage | **3/4** (근거요구 · 원문대조 · 교차확인; **자가검토 없음**) | 2/4 (근거요구 · 원문대조 only) |
| 3 | Boomerang owners (1, 3) | ✓ both | ✓ both |
| 4 | 전환점 (card 3) | ✓ | ✓ |
| 5 | 최종 관문 (card 6) | **✓** | ✗ |
| 6 | Round-1 recognition beat | 3 of 4 pre-read | **4 of 4 pre-read** |
| 7 | Tier-B (확인하기) practice cards | **2** (cards 3, 6) | **1** (card 3 only) |
| 8 | Extra authoring if adopted | none — card 6's 요약 units are authored unconditionally at S3.1b | none |

**Decision: D-A `{1, 3, 4, 6}`**, with card 6's masking step authored from the outset as explicit 요약-eligible units plus 익명화/마스킹 on the retained 핵심 조항 — unconditionally, not gated on promotion.

1. **The deciding criterion is 확인하기 coverage.** D-B contains exactly **one** tier-B card, so a live audience would see 확인하기 exercised once. D-A shows it twice, including the 최종 종합 card.
2. **D-A's masking coverage is literally 4/4.** PRD §6 card 6's 2회차 정답 is "핵심 조항만 **발췌**·익명화"; §2.9.1 authors the non-retained 조항 문단 as 요약-eligible units whose `confidential_doc` tokens are **summarize-only**, so 요약 is *required*, not merely available. Machine-checked (§2.9.2 clause C).
3. **Both sets preserve both boomerang owners.**

**Accepted costs of D-A:**

- **자가검토 is not exercised in DEMO_MODE** (card 5 is dropped). A **named, bounded exemption** in AC-9.3b. A presenter demoing on stage must mention card 5's 편향 case verbally. Recorded in the DEMO_MODE source comment.
- **Round-1 recognition drops from 4-of-4 to 3-of-4.** Acceptable: card 1, the headline boomerang, is preserved.
- **Card 2's PRD-literal 요약 is not in the set.** Mitigated entirely by point 2.
- **The N = 4 necessity margin is 20 and the N = 4 one-card frontier is 85** (§2.6.6) — both recorded in the DEMO_MODE comment, because trimming the set raises the per-turn baseline to 25 and therefore changes both numbers.

**AC-9.3 / v0.3 gate reconciliation:** masking-technique coverage is **unconditional for every shippable card set**. Card 6's 요약 units are a deliverable of **S3.1b**, delivered whether or not DEMO_MODE is ever promoted.

### 2.8 검증 도구 4종 — closing the coverage gap the masking side already had

PRD §7's toolbar lists **근거요구 · 원문대조 · 교차확인 · 자가검토** and §11 claims the "4대 검증법 (22쪽)" row. PRD §6 assigns three: 근거요구 → card 3, 자가검토 → card 5, 교차확인 → card 6. **원문대조 had no card anywhere.**

**Decision: `원문대조` resolves the *second* genuine span on each tier-B card.** AC-5.9 requires exactly 2 genuine spans per tier-B card; assigning the second one a tool makes the 2-tool-per-turn cap exactly saturating on a maximal play:

| Card | 원본 (what 원문대조 compares against) | Genuine span 1 → tool | Genuine span 2 → tool |
| --- | --- | --- | --- |
| 3 | 공개 기사 3건 (supplied by the player) | `업계 관계자의 73%…` 통계 → **근거요구** (PRD-specified) | a claim attributed to the supplied articles that is not in them → **원문대조** |
| 5 | 지원자 이력서 | 순위 근거 / 편향 판단 → **자가검토** (PRD-specified) | a fabricated credential detail not in the résumés → **원문대조** |
| 6 | 계약 전문 | 지어낸 법 조항 → **교차확인** (PRD-specified) | a clause misquoted from the supplied 계약 전문 → **원문대조** |

PRD-consistent (card 6's stated 역할 is "배운 것 전부를 한 번에 쓰는 최종 관문", and it now genuinely requires two *different* tools), needs no new card, and makes 원문대조 a first-class mechanic instead of a dead toolbar button. **AC-9.3b** mirrors AC-9.3; **AC-5.5b** defines the "correct span, wrong tool" outcome.

### 2.9 위험 유형 지도, 기법 필요성, 그리고 메커니즘 노출

#### 2.9.1 The `RISK_TYPES` map

Each technique must be the **unique neutralizer of at least one type that is actually present in every shippable set**:

| id | Korean label | `neutralizedBy` | `>대체값` required? (R-r1) | present on | uniquely forces |
| --- | --- | --- | --- | --- | --- |
| `pii_name` | 실명 | `['anonymize']` | **YES** — authored alias or 직책 | 1, 2, 5 | 익명화 |
| `pii_phone` | 전화번호 | `['mask']` | no — derived `010-****` (R-r2) | 1 | **마스킹** |
| `pii_attr` | 학교 · 나이 · 주소 · 사진 | `['anonymize']` | **YES** *(v5 — was undefined)* | 5 | 익명화 |
| `biz_id` | 주문번호 · 거래처명 | `['mask']` | no — derived (R-r2) | 1, 6 | **마스킹** |
| `unreleased_spec` | 미발표 스펙 · 출시일 · 가격 | `['fake']` | **YES** | 4 | **가상데이터** |
| `unreleased_perf` | 미공개 실적 수치 | `['fake']` | **YES** | 2 | 가상데이터 (but see note) |
| `hr_eval` | 인사 · 평가 논의 *(OQ-2 item ④)* | `['summarize']` | n/a — unit sentence | 2 | **요약** |
| `confidential_doc` | 기밀 조항 본문 | `['summarize']` | n/a — unit sentence | 6 | **요약** |
| `confidential_amount` | 계약 금액 | `['anonymize']` | **YES** *(v5 — was undefined)* | 6 | 익명화 |

> **(v5) The three `>대체값` cells marked YES for `anonymize` types are the fix for MAJOR-1.** v4 routed all three of these types through a derived `MASK_TOOLS.anonymize.transform(text, ordinal)` whose specification ended in "…or 직책 where the card declares a **직책 map**" — a map named once and defined nowhere. Two of the three types cannot be handled by an ordinal aliaser at all: there is no "n번째 주소" and no "n번째 계약 금액". Under **R-r1** all 익명화 replacements are authored inline, the derived anonymize transform is deleted, and the 직책 map concept goes with it. `tokenize()` throws at boot on any `anonymize`- or `fake`-neutralized token lacking a `>` value, so the class of gap that survived from round 3 into round 4 cannot survive again.

Plus **R-n1's unconditional 요약 clause**, whose reach is bounded by which units the author declared 요약-eligible (F1c) and whose size is bounded by **R-m3**. Cards **1, 4 and 5 declare no eligible unit**, so on those cards `neutralizedBy` is the whole story. Card 2 declares one (the 논의 본문); card 6 declares two (the non-retained 조항 문단).

**Resulting per-card required-technique sets** — computed, not asserted: a technique `T` is *required* by card `c` iff some risk token on `c` has exactly one legal neutralizer and it is `T`.

| card | required techniques |
| --- | --- |
| 1 | 익명화, 마스킹 |
| 2 | 익명화, 요약 |
| 3 | — (empty risk key) |
| 4 | **가상데이터** |
| 5 | 익명화 |
| 6 | 마스킹, 익명화, 요약 |

Union over the full set `{1..6}` = all four ✓. Over `DEMO_MODE {1,3,4,6}` = all four ✓. Over the R15 rung-② set `{1,2,3,4,6}` = all four ✓.

> **Single point of coverage, named rather than discovered later:** **가상데이터 is required by card 4 and by nothing else.** (Card 2's `unreleased_perf` sits inside its 요약-eligible unit, so 요약 also neutralizes it there — the PRD's own "수치는 제외" — which means card 2 does not *force* 가상데이터.) Any card-set change that drops card 4 breaks AC-9.3, so the boot audit throws on it rather than leaving it to an eyeball.

> **(v5) A coverage-boundary interaction worth stating.** Under R-g a card can now grade `partial` while one *technique* was never used at all — e.g. card 1 at 6/8 coverage using only 마스킹 plus one 익명화. That is intended: `가리다 일부 놓침` is a grade about *how much leaked*, not about which techniques were exercised. **Technique necessity is a property of the card set (clause C), not of any single play**, and the two claims are deliberately separate. AC-9.3 is the one that guarantees a player cannot complete a *clean* run without every technique.

#### 2.9.2 `auditCardSet()` — the boot-time enumerator, with its domain stated completely

v3 verified coverage by "manual walkthrough with the intended tools", which can only ever demonstrate that a technique **can** be used. v4 replaced that with an enumerator — but **specified clause B's domain as the strictly-zero-masking subspace**, which is why it passed green on a build where run 12 was live. Both round-4 reviewers named that domain as the gap. It is therefore now written out in full, including what it does *not* cover.

```
auditCardSet(cards, thresholds) →      // ~110 lines, pure, no dependencies (D3)

  ENUMERATION DOMAIN — stated exhaustively, because the previous version's
  omission was invisible precisely because it was never written down.

    For each card c in the active set, the per-card OUTCOME PROFILE set P(c) is:

      P(c) = { reject }                                        // R-c: no answer, no tools, baseline kept
           ∪ { (grade, t, k) :
                 grade ∈ G(c),
                 t ∈ {0,1,2},                                  // verification tools spent this turn
                 k ∈ {0 .. min(t, genuineSpans(c))} }          // genuine spans caught

      G(c) = { 'C1clean' }                     if riskKeySize(c) === 0     // card 3 — forced by C1
           = { 'raw', 'partial', 'C2clean' }   otherwise

    and the enumerated space is the full CARTESIAN PRODUCT over the active set,
    times {gear found, gear not found}.

    WHY THIS IS FINITE AND SMALL, and why it is now CORRECT:
      Under R-g (§2.6.3) the score depends on masking ONLY through the grade.
      Every masking state with coverage < θ produces grade 'raw' and is therefore
      SCORE-EQUIVALENT to zero masking; every state with θ ≤ coverage < 1 produces
      'partial'; only coverage = 1 produces 'C2clean'.  The three grades are thus
      a COMPLETE quotient of the masking state space with respect to scoring, and
      enumerating grades enumerates every reachable score.  <= 6 cards x <= 10
      profiles x 2 gear states, Pareto-pruned; runs in milliseconds.
      (v4 enumerated only the single point `transformed.size === 0` inside 'raw',
       which is why the whole minimal-masking class was invisible to it.)

  A. quadrant reachability   — over the FULL domain: all four quadrants must be hit.
                               THROW naming any unreachable quadrant.

  B. necessity N-1'          — over the SUB-θ SUBSPACE, defined as every profile in which
                               no card's grade is 'partial' or 'C2clean' (i.e. each card is
                               reject / raw / C1clean).  Report max displayed 보안 among
                               profiles clearing the 업무 threshold.
                               THROW if that maximum >= SCORE.threshold.security.
                               Print the margin AND compare against the declared constant
                               AUDIT.expected.zeroMaskFrontier[N] = {6:31, 5:50, 4:40};
                               THROW on mismatch.        (§2.6.6 Frontier 1 = Frontier 2)

  B2. one-card frontier      — (NEW in v5, report-and-compare, NOT a pass/fail on its own)
                               For each card c with riskKeySize > 0: max displayed 보안 over
                               profiles where c is 'partial' or 'C2clean' and every OTHER card
                               is reject / raw / C1clean, clearing the 업무 threshold.
                               Print max over c, and THROW if it differs from the declared
                               AUDIT.expected.oneCardFrontier[N] = {6:68, 5:90, 4:85}.
                               This is the DISCLOSED boundary of §2.6.6; it is a change
                               detector, so any content or threshold edit that moves it
                               forces a human to re-ratify OQ-12(ii) instead of silently
                               shifting what "가려서 처리" buys.

  C. technique necessity     — for each of the 4 mask tools T: T is omissible iff every card
                               admits a FULL-neutralization assignment avoiding T.
                               THROW if any T is omissible.
                               (Per token i, legal neutralizers L(i) = neutralizedBy[type(i)]
                                ∪ {'summarize'} if i lies in a declared 요약-eligible unit.
                                T is forced by card c iff ∃ i on c with L(i) === {T}.)

  D. tool coverage           — each of the 4 verification tools is the resolvedBy of >=1 genuine
                               span in the active set, OR appears in the set's named exemption list.

  E. trigger sanity          — gearTurnIndex != checkboxTurnIndex, 1 <= gearTurnIndex <= N-2.

  F. coverage-band sanity    — (NEW in v5) for every card c with R = riskKeySize(c) > 0,
                               with need(c) = ceil(θ · R):
     F1  R >= 4  AND  need(c) <= R - 1
         → both 'raw' and 'partial' are reachable grades on this card.
     F2  for every 요약-eligible unit u on c:  |riskTokens(u)| < need(c)          (R-m3)
         → no single unit collapse can lift the card out of the raw band.
     F3  for every (문단 p, tool T):  |{i ∈ p : T ∈ L(i)}| < need(c)
         → no single bulk 문단 application can lift the card out of the raw band.
         (Card 2's 5-name 참석자 문단 at 5 < 6 is the binding case; it is what sets θ's
          lower bound, and it is why F3 FAILS at θ = 0.6 and passes at θ = 0.7.)
     F4  θ lies strictly inside the plateau on which need(c) is constant for every c:
         max_c( (need(c)-1)/R_c ) < θ <= min_c( need(c)/R_c )
         → the shipped θ = 0.7 sits in (0.667, 0.75]; any re-tune inside that interval
           provably changes no grade, and any re-tune outside it fails loudly here.
     THROW naming the card and the failing sub-clause.
```

Every throw names the offending technique, card, 문단, unit, or outcome profile. **Clauses B, B2, C and F are the four claims this plan makes that no human playthrough can verify**, and all four are now discharged from the same content the game actually ships.

> **What the audit still does not cover, stated so the next reader does not have to find out the hard way:** it reasons over *grades and outcome profiles*, not over pointer actions, so it cannot tell you how many **clicks** a given coverage costs. Clauses F2 and F3 are the bridge — they bound the coverage any single bulk application can produce — but a future affordance that lets a player neutralize many tokens in one gesture at a granularity other than 문단 or 요약-unit (for instance the risk-type-keyed bulk select **AC-2.7 forbids**) would be outside F3's model. **If such an affordance is ever added, clause F3 must be extended to it in the same commit.** A source comment above F3 says exactly this.

#### 2.9.3 Mechanic exposure — decoupling the unlock boundary from the content tier

v3 contained a flat contradiction: **AC-5.6** said tier-A cards expose **no underline UI at all**, while **AC-5.10** required those same cards to carry ≥2 decoy underline candidates *specifically so that "this answer has underlinable things in it" would not signal "this answer is fabricated."* Under AC-5.6 those decoys were unreachable and the mere appearance of the M3/M4 UI became a **perfect tell**.

**Decision — exposure follows the *unlock boundary*; grading follows the *content tier*; the two are deliberately not aligned** (§1.3):

- **Cards before the 전환점 (cards 1, 2) expose M1 + M2 only.** Their lack of an underline UI is a **stage** fact, identical for every pre-unlock card.
- **Cards from the 전환점 onward (cards 3, 4, 5, 6) expose M1 + M2 + M3 + M4**, regardless of content tier. Card 4 is tier A and exposes the full toolbar: underlining works, tools may be spent, each costs `업무 −3`, and every candidate on it is a decoy returning `"문제 없습니다"`.
- **`검증 없이 답변 제출` still fires only where there is something to have missed** — a card whose answer contains ≥1 genuine span (§2.6.1). It can never fire on card 4. The player cannot know that in advance, and that is the point: over-verifying a clean card costs **−3**, under-verifying a dirty one costs **−25**.
- **AC-5.10 is retained and re-scoped** to post-unlock non-hallucination cards, where its decoys are now genuinely reachable.

This changes **no** AC-4.5 value.

---

## 3. Acceptance Criteria

Numbered `AC-n.m`. Every criterion is observable by a human playing the file, since there is no test runner (D3).
**New or materially changed in v5:** AC-1.5, 1.6, 1.10, 2.4b, 4.5, 4.11, 4.12, 4.13, 5.1, 5.2, 5.2b, 5.3, 5.3b, 8.1b, 9.3, 9.5.

### 3.1 Global / constraints

- **AC-1.1** The deliverable is exactly one file, `index.html`, at repo root. Opening it via `file://` in Chrome, Edge, Safari and Firefox loads a playable game with **zero** network requests (DevTools Network shows 0 requests after a hard reload; no `<link href="http...">`, no `<script src=...>`, no `@import url(http...)`, no `fetch`/`XMLHttpRequest`). A `<link rel="icon" href="data:,">` is present so no favicon request is attempted.
- **AC-1.2** `grep` of the file finds no occurrence of `cdn`, `unpkg`, `jsdelivr`, `googleapis`, `require(`, `import ` (as a module statement), or `type="module"`.
- **AC-1.3** Across a complete round-1 → round-2 → ending playthrough the console shows **zero errors** and **zero warnings originating from this file**. A documented whitelist of browser-originated warnings is maintained in a source comment and is currently: (a) the WebAudio autoplay-policy notice emitted before the first user gesture; (b) any `file://`-scheme security notice the browser emits on load. Any warning not on the whitelist is a defect.
- **AC-1.4** All player-visible text is Korean. No English placeholder, no lorem ipsum, no untranslated debug string in any shipping path. Every line the PRD gives verbatim ships character-identical; S5.5 diffs them against §§6/8/9/10.
- **AC-1.5** No §5 or §9(2) delta value is reproduced as a numeric literal inside `applyScore`, inside any grader, or inside any render path. Every such read goes through `SCORE.*`. This includes `SCORE.boomerangDelay` (R-e), `SCORE.threshold` (AC-8.1), **and `SCORE.maskCoverageThreshold` (= 0.7, R-g)**, which must appear as a bare literal **nowhere** and be read in exactly one place, `gradeMasking()`. Verifiable by grep: the string `0.7` does not occur inside any grader.
- **AC-1.6** No hand-authored array of integer indices appears anywhere in `CARDS`. Every risk key, **risk-key size**, hallucination key, candidate key and 요약-eligible unit list is produced by `tokenize()` / a derived filter at boot. **This explicitly includes replacement text:** there is no index-keyed side table of masked values anywhere — 익명화, 가상데이터 values and 요약 sentences live inline in the annotated source (F1c), and only 마스킹 is computed by a pure function (R-r2). Verifiable by grep: `CARDS` contains no `[0,` / `[1,` index-array literal, no `replacements` key, **and no `titles` / `roles` / `직책` map of any kind**.
- **AC-1.6b** `tokenize(` appears **only** under the `7. BOOT` section banner. No grader, renderer, send path or FX routine ever re-tokenizes text. `state.turn.transformed` is a `Map<originalIndex, {text, tool}>` overlay on the immutable boot-time token array (F1a), and 요약 is represented as a declared-unit collapse, never as a re-parse. Verifiable by grep.
- **AC-1.7** No `state.round === 1` (or equivalent) branch exists inside `renderR2Turn`, `gradeMasking`, `gradeUnderlines`, or `applyScore`.
- **AC-1.8** Four invariants, each with a **runtime self-report**, not a convention:
  - **I-1 · render scope.** Every write performed by a render function goes through a single accessor `region(name)`, which resolves `[data-region="<name>"]` and **throws** if the element is missing or is not a `[data-region]` element. No render function assigns `innerHTML`/`textContent` to anything other than the return value of `region(...)` or a locally-constructed detached node.
  - **I-2 · phase scope.** `goPhase()` may replace elements **inside `#app` only**. It must never touch `#dotReservoir`, `#fxLayer` or `#modalRoot`. Every `goPhase()` ends by calling `bindReservoirObserver()` then `anchorReservoir()`, in that order.
  - **I-3 · runtime enforcement (`?debug=1`).** A `MutationObserver` on `<body>` throws immediately if `#dotReservoir`, `#fxLayer` or `#modalRoot` is removed from the DOM, and throws if a `.dot` element leaves `#dotReservoir` without first carrying `data-inflight`.
  - **I-4 · observer identity.** After every `render()` and every `goPhase()`, the reservoir `ResizeObserver` must be observing **the current** `[data-region="dotzone-anchor"]` node, asserted by identity in `?debug=1` and **throwing** on mismatch.
  - **Verification (three clauses, all required).** In `?debug=1`: (a) re-render the AI pane **50×** and confirm `#dotReservoir` element identity (`===`) and dot count are unchanged; (b) **cycle `goPhase()` through the full `PHASES` list 5×** and confirm the same two things, plus that `anchorReservoir()` has left the reservoir visually over the anchor on every phase that has one; (c) confirm that on **TITLE** — which has no anchor by design — the reservoir is `hidden`, nothing was thrown, and the dot count is still unchanged when a later phase re-anchors it (E2a).
- **AC-1.9** `turnIndex` is **0-based** throughout. `baselineAward` is called with `k = state.turnIndex + 1`. Every "N장째" rule in the PRD is expressed as a `turnIndex` comparison in exactly one place and is commented with its PRD line.
- **AC-1.10** *(domain widened in v5)* `?debug=audit` runs `auditCardSet()` (§2.9.2) at boot against the **active** card set and prints clauses **A–F**. In `?debug=1` any failing clause **throws**, naming the offending technique, card, 문단, unit, or outcome profile. The printed **clause-B table must match §2.6.6's Frontier-1/Frontier-2 rows for the active `N`**, and the printed **clause-B2 value must match §2.6.6's one-card row**. This is the machine discharge of AC-8.1b, AC-9.3 and R-g's band.

### 3.2 Layout (§7)

- **AC-2.1** Top status bar shows `오늘 남은 요청` followed by a dot row filled/hollow per remaining turns, rendered in the PRD's own idiom (`●●●○○○`), plus two labeled gauges `업무` and `보안`.
- **AC-2.2** Main stage is two panes: left `사무실 세상` containing shape characters (`○ 요청자`, `□ 동료`, `○ 낯선 사람`), each with an attached **`.bubble`** speech bubble, and a `[원본 문서]` element; right `AI 창` containing a paste target ("여기에 붙여넣기"), an answer area, a confidence badge slot, underline-capable answer text, a `.pane-ai__dotzone` anchor placeholder (`data-region="dotzone-anchor"`), and (round 2 only) the send row.
- **AC-2.3** Bottom toolbar has two labeled rows, visible in round 2 only: `도구  [익명화] [마스킹] [요약] [가상데이터]` and `검증  [근거요구] [원문대조] [교차확인] [자가검토]` with a live remaining counter rendered as `2/2`. The 검증 row appears from the 전환점 onward (AC-5.6).
- **AC-2.4** No card's rendered 원본 exceeds **200 tokens**, and the 원본 pane scrolls rather than pushing the layout. Two cards apply the **"…외 N건" device**:
  - **Card 1** renders ~3 representative 문의 entries followed by the literal line **`…외 27건`**.
  - **Card 5** renders ~3 representative 지원자 entries followed by **`…외 9건`**.
  - **The `…외 N건` line is a display-only device.** It carries **no annotation**, contributes **no token to the derived risk key** — and therefore **nothing to R-g's denominator** — is **not gradeable**, and has **no neutralizer**. `tokenize()` asserts at boot that a line matching `…외 \d+건` contains no `[`. A source comment states that the 상황 line's stated volume and the risk key's size are intentionally different, *and that the coverage denominator is the risk key, not the 상황 volume*, or an implementer will "fix" one of them.
  - **Whole-document cards (4 and 6) must be authored in ≤6 structural units (문단).** An **authoring constraint**: a clean whole-document mask costs ≤6 문단 clicks + 1 tool click ≤ 8 pointer actions — see AC-2.7 and the v0.2 gate.
- **AC-2.4b** *(extended in v5 — now also carries the coverage-band constraints)* **No risk token may require two masking techniques at once**, and **no single mask application may lift a card out of the `raw` band.** Concretely:
  - Where a card's PRD 정답 names two techniques, the source is partitioned into **disjoint units, one technique per unit** — card 2 as a non-eligible 참석자 header (익명화) plus a 요약-eligible 논의 본문; card 6 as a non-eligible 핵심 조항 (마스킹 + 익명화, on different tokens) plus 요약-eligible 조항 units. Verifiable at boot: for every risk token, `|legalNeutralizers(i)| ≥ 1` (clause C).
  - **Every card's risk-key size and per-문단 / per-unit concentration must match F1e's pinned table**, so that `⌈θ·R⌉` exceeds both the largest 요약 unit (R-m3) and the largest single-tool 문단 application. Verifiable at boot: `auditCardSet()` **clause F**. *This is the constraint that makes θ's admissible band wide; without it a re-authored card could make one bulk gesture worth a whole baseline chunk again.*
- **AC-2.5** At viewport widths ≥1100px the two panes sit side by side as in the §7 wireframe. Below ~820px they stack vertically, the 원본 switches from inline token flow to a **line-per-clause list** (one clause per full-width row, each ≥44px tall), and every interactive target is ≥44px. Stated scope: **"phone: readable and completable, not optimized"**. PRD §13's mobile open item is **narrowed, not retired**. Touch-behavior CSS is **target-specific**:
  - `.token { -webkit-user-select: none; -webkit-touch-callout: none; touch-action: manipulation; }` — tokens are tap targets, so iOS long-press selection never fires over them, **but vertical page scrolling over the prompt still works**.
  - `[data-act="dragSource"] { touch-action: none; -webkit-user-select: none; -webkit-touch-callout: none; }` — applied to the **actual drag source**, the round-1 `[원본 문서]` element.
  - A `마지막 동작 취소` button gives one-step mis-tap recovery.
- **AC-2.6** In round 2, the AI pane's send row contains exactly two buttons: **`[전송]`** and **`[요청 거절]`**. In round 1 the send row is **absent entirely**. Pressing `요청 거절` opens no confirm modal, consumes the turn dot like any other outcome, scores `sendOutcome = reject` (업무 0 / 보안 0 **plus the baseline award, which 거절 keeps** — R-f′), produces **no AI answer, no badge and no underline phase** (R-c), **adds no dot to the reservoir** (AC-4.11), and shows a one-line feedback beat. The reject feedback copy is an authoring deliverable (**OQ-4**).
- **AC-2.7** The masking editor offers **structural** bulk selection only: **`문단 전체 선택`** and **`문장 전체 선택`**. **A risk-type-keyed bulk select (`위험 유형 전체 선택`) is explicitly forbidden and must not exist.** Two independent reasons, both normative: (1) risk *type* is exactly how `riskKey` is derived, so such an affordance hands the player the answer key and silently empties `rankMissedRisk()`; (2) **it would be a single application whose coverage is unbounded by 문단 structure, which is outside `auditCardSet()` clause F3's model and would therefore reopen the one-gesture-buys-a-baseline defect with the audit still green** (§2.9.2's closing note). The whole-document click budget is met instead by AC-2.4's ≤6-문단 authoring constraint.

### 3.3 Round 1 (§4 프롤로그)

- **AC-3.1** Round 1 renders **no** gauges, **no** tool rows, **no** send-confirmation modal, **no** send row, and **no** warning of any kind. *Verified at the **v0.4** gate.*
- **AC-3.2** Exactly 4 requests appear, in card order 1 → 2 → 3 → 4, each resolvable in a single drag, targeting ≈2 minutes total.
- **AC-3.3** Each paste is performed by **dragging the `[원본 문서]` element into the AI window** (`pointerdown`/`pointermove`/`pointerup`, no token math, no grading). On drop it emits a 딸깍 click (WebAudio oscillator, no audio file) and visibly flies a dot from the 원본 문서 into the AI window, where dots accumulate and remain visible.
- **AC-3.3b** A click-only fallback (`[붙여넣기]` on the 원본 문서) also completes the drop, so the game is never unfinishable — but it is **hidden by default and revealed only by one of three conditions** on that turn:
  1. a `pointerdown` on the drag source followed by a `pointerup`/`pointercancel` that did not land inside the AI window (**failed drag**);
  2. ≥4 s held with <20 px of movement (**stalled drag**);
  3. **≥12 s elapsed since the request card appeared with no `pointerdown` on the drag source at all** (**never attempted**).
  Once revealed the fallback stays revealed for the rest of round 1. The 12 s value is a constant, not a literal, and is re-tuned at the v0.4 gate.
- **AC-3.4** Each completed request returns praise/speed feedback — the player is rewarded for pasting wholesale, never warned. (Copy: **OQ-4**.)
- **AC-3.5** After request 4 the screen darkens and time passes, then the **two boomerangs** play in order:
  1. A stranger's (`○ 낯선 사람`) AI window `.bubble` displays the card-1 customer data verbatim as `김OO 010-1234-XXXX`;
  2. The card-3 fabricated statistic `"업계 관계자의 73%가..."` becomes a news article, and the AI is then shown citing that article back.
  > *Source note required in code:* the leak string is PRD-verbatim and is **already partially masked** (`김OO`, `XXXX`) even though the player pasted full values. This is the PRD's deliberate choice; a one-line comment must say so.
- **AC-3.6** Cards 2 and 4 also surface their §6 1회차 결과 during the montage, as shorter beats subordinate to the two headline boomerangs.
- **AC-3.7** The boomerang sequence plays with **no sound** (§7). Any click/ambient audio is suppressed for its duration by `silence()`.
- **AC-3.8** The screen then freezes with exactly one line remaining: **"다시 해보시겠습니까?"** and a single affordance to continue.
- **AC-3.9** Dot identity is traceable: the specific dot created by the card-1 drag (carrying `data-card-id="1"`) is the one that visually reappears in the stranger's window. **Guaranteed by AC-1.8's I-2, I-3 and I-4.**
- **AC-3.10** Cards 1–4's round-2 AI answer text is **byte-identical** to the text shown in round 1. There is exactly one `answer` record per card, consumed by both rounds.
- **AC-3.11** The 파국 visual — "화면의 모든 말풍선이 AI가 만든 문장으로 채워진다" (§7) — plays as the closing movement of **round 1's boomerang sequence** (S4.3). Every `.bubble` on screen swaps its text for AI-generated sentences before the freeze. **The flood sentences are game content and must be authored** (≈4–6 short Korean lines) — **OQ-4**.
- **AC-3.12** Round-1 dots are **drained in a visible ~2 s beat** at INTERSTITIAL (E1a), not cleared silently, and `state.log.round1Dots` retains the count for AC-8.3b. The beat plays over `.screen-interstitial__dotzone` (**E2b**).

### 3.4 Round 2 — gauges (§5)

- **AC-4.1** Both gauges are visible from the first turn of round 2 and update immediately on every scored action. 보안 starts displayed at **0** (G2).
- **AC-4.2** Score deltas match §1.4 exactly: 그대로 처리 `업무+15/보안-20`; 거절 `0/0`; 가려서 처리(정답) `업무+15/보안+0`; 가리다 일부 놓침 `업무+15/보안-8`; 검증 없이 제출 `보안-25` applied **later** as a boomerang; 검증 도구 1개 사용 `업무-3` per tool; 환각을 잡아냄 `업무+5/보안+5` per genuine span; 숨겨진 설정 끄기 `보안+10` once.
- **AC-4.2a** Exactly one of the five §5 send-outcome rows fires per completed request, and exactly one 업무 completion award (+15, or 0 for 거절) is granted per turn. `검증 없이 답변 제출` contributes **only** the deferred 보안 −25.
- **AC-4.2b** `applyScore(sendOutcome, modifiers)` takes the send outcome as a single enum parameter. There is no code path by which two completion awards can be applied to one turn.
- **AC-4.2c** The baseline award fires **exactly once per completed turn**, indexed by `state.turnIndex` and recorded in `state.turnsAwarded`, **except on a turn whose send outcome is `raw`, where it is not granted at all** (R-f′). It does not otherwise depend on the outcome: a `거절`, a `clean`, and a `partial` all receive it. A `다시 보기` → re-send cycle on the same turn awards it **once**, resolved against the outcome that actually completed the turn. **`raw` is determined by R-g's coverage test, not by whether any transform was applied.** Verifiable in `?debug=score`, which prints the per-turn baseline ledger with a `forfeited` marker **and the turn's coverage fraction `n/R`**.
- **AC-4.3** The deferred `-25` fires visibly as a boomerang beat **exactly `SCORE.boomerangDelay` (= 2) turns after the turn that queued it** — a callback that names the earlier unverified answer — never as a silent gauge tick. Any penalty whose landing turn does not exist is **flushed into the ending transition** as one combined beat with its own copy (R-e).
- **AC-4.4** Verification tools are capped at **2 per turn**; the counter reads `2/2` → `1/2` → `0/2`, and at `0/2` the tool cards are disabled with an explanation, not silently inert.
- **AC-4.5** *(recomputed under R-g in v5 — see §2.6.5)* The following **fourteen** reference runs are reproducible end to end with these **exact** values, read from `?debug=score`'s **unclamped** internal totals as well as the displayed bars. Thresholds: 업무 high iff `≥ 10·N`; 보안 high iff `≥ 60`.

  | # | Reference run | 업무 int / disp | 보안 int / disp | Quadrant |
  | --- | --- | --- | --- | --- |
  | 1 | 전부 거절 (6) | 0 / **0** | 100 / **100** | 안전한 무능 |
  | 2 | 전부 그대로 (6) | 90 / **90** | **−158** / **0** (undercap 158) | 유출 사고 |
  | 3 | 전부 가려서 + 최소 검증 (3 tools, 3 catches, ⚙) | 96 / **96** | 125 / **100** (overcap 25) | AI 네이티브 |
  | 4 | 전부 가려서 + 최대 검증 (6 tools, 6 catches, ⚙) | 102 / **100** (taskOvercap 2) | 140 / **100** (overcap 40) | AI 네이티브 |
  | 5 | 마스킹 완벽 · 검증 전무 (⚙ 미발견) | 90 / **90** | 25 / **25** | 유출 사고 |
  | 6 | 대충 가리기 (5장 **1개씩** 놓침 → 전부 partial, 3 tools, 3 catches) | 96 / **96** | 75 / **75** | AI 네이티브 |
  | 7 | 최악(강): 1·2·4 그대로, 3·5·6 거절 | 45 / **45** | **−10** / **0** (undercap 10) | 최악 |
  | 8 | 마스킹 전무 · 거절 2 · 검증 최대 (CRITICAL-A 회귀행) | 68 / **68** | **21** / **21** | 유출 사고 |
  | 9 | 마스킹 전무 · 최적해 (zero-mask frontier max) | 72 / **72** | **31** / **31** | 유출 사고 |
  | 10 | 의식적 검증 (도구 3, 적발 0) | 81 / **81** | 100 / **100** | AI 네이티브 |
  | 11 | 최악(약): 1·2 그대로, 3·4·5·6 거절 | 30 / **30** | 27 / **27** | 최악 |
  | **12** | **최소 마스킹 (토큰 1개씩 · 3클릭) — v5 회귀행** | **72 / 72** | **31 / 31** | **유출 사고** |
  | **13** | **흉내만 가리기 (카드마다 3개씩 놓침, 검증 전무)** | **90 / 90** | **−158 / 0** (undercap 158) | **유출 사고** |
  | **14** | **한 장만 제대로 (c6 완전 마스킹, 검증 최대, ⚙) — one-card frontier max** | **72 / 72** | **68 / 68** | **AI 네이티브** |

  "업무 90", "보안 0" and "보안 100" are the PRD's own numbers and must match exactly. **Seven rows carry specific meanings and must be read, not ticked:** row 2's **−158** proves both the C1 carve-out and R-f′'s forfeit half; **row 5** proves reading (a) is implemented; **row 7's −10** proves R-f′'s *keep* half fired on the three 거절 turns; **row 8** is the zero-masking regression row (a value of 70 / `AI 네이티브` means the round-3 hole is open again); **row 10** is the reading-(a)/(a′) discriminator; **row 12 is the v5 regression row — a value of 100 / `AI 네이티브` means the coverage boundary was not implemented and the round-4 hole is open again**; **row 13 must equal row 2 to the digit** — any value above −158 means a sub-θ card was graded `partial`.
- **AC-4.6** Both gauges clamp to the displayed 0–100 range and never render out of bounds. **The clamp is a normative behavior, not an implementation detail**: a turn-1 그대로 처리 computes internal `−20` and the **earned segment does not move**. AC-4.11b's 3-segment gauge is what makes that turn legible. No gate step may assert movement of the *earned* segment on a turn where the clamp pins it.
- **AC-4.7** Every security-positive event renders a floating `+N 보안` chip near the gauge for ~900 ms **even when the gauge is clamped at 100**.
- **AC-4.8** `securityOvercap = max over the run of max(0, securityInternal − 100)`. If > 0 at the ending, the safety card renders exactly one acknowledgment line; if 0, the line is absent. (Copy: OQ-4.)
- **AC-4.8b** `securityUndercap = max over the run of max(0, −securityInternal)` — **the deepest excursion below zero, a running maximum, not a per-event sum.** If > 0 at the ending, the 유출 사고 / 최악 screens render exactly one line naming how far below zero the run went. Reference values: runs 2 and 13 → 158, run 7 → 10, run 11 → 0. (Copy: OQ-4.)
- **AC-4.9** The ⚙ discovery always produces a distinct beat and sets `state.flags.learningOff`, observable in the ending even when the gauge could not move.
- **AC-4.10** Using a mask tool that does not neutralize a token's risk type leaves that token **미가림** for grading purposes; it does not invent a new §5 row. `RISK_TYPES` declares, per type, which techniques neutralize it (§2.9.1), and **R-n1** adds 요약 unconditionally wherever 요약 is *applicable*. Grading resolves through the **ordered** clause set C1–C4 with R-g's coverage test at C3. The feedback line names the technique that *would* have worked.
- **AC-4.11** *(three variants in v5)* In round 2, every **sent** request adds one dot to `#dotReservoir`; a `거절` adds **no** dot. **The dot's variant is keyed on the grade the send received** (E1b): `.dot--masked` (hollow) for `clean` via C2, and for `clean` via C1 where a transform was applied; `.dot--partial` (half-filled) for `partial`; `.dot` (solid) for `raw`, and for `clean` via C1 with nothing applied. Consequence, stated so it is not "fixed": a card-3 send with nothing touched grades `clean` via C1 but draws a **solid** dot, because the document did go in; and a card masked to 1 of 8 tokens draws a **solid** dot, because under R-g it graded `raw`. The reservoir starts round 2 empty (AC-3.12) and is visible at the ending via `.screen-ending__dotzone` (E2b).
- **AC-4.11b** The 보안 gauge renders `earned` (solid) + `남은 안전 예산` (ghosted) + `잃은 안전` (dark), always summing to exactly 100, plus an overdraft `−N` marker when `securityInternal < 0`. `ghost = min(Σ_{j>k} baselineAward(j,N), 100 − earned)`; `lost = 100 − earned − ghost`. **This is a v0.1-stage deliverable (S1.2), not polish.**
- **AC-4.12** On a turn whose outcome is `raw`, the gauge beat must make the **forfeit** legible and distinct from the −20: the turn's baseline chunk moves from the ghosted band into the dark band in its own ~400 ms movement, with a one-line beat (copy → OQ-4) stating that nothing was banked this turn. Without this, R-f′ is arithmetic the player cannot see.
- **AC-4.13** *(new in v5 — the coverage boundary must be legible, not just correct)* On any send whose grade is `raw` **while at least one transform was applied** — i.e. the player masked something but fell below θ — the feedback beat must state **how many risk tokens were still exposed and that this is why the send counted as 그대로 처리** (copy → OQ-4 item 18, e.g. "3곳이 그대로 나갔습니다. 이 정도면 안 가린 것과 같습니다."). The count is `R − n`, read from the same values `gradeMasking` used. **Rationale, and why this is an AC rather than polish:** R-g's whole risk is that a player who *did* click something is told "그대로 처리" with no explanation and concludes the game is broken. The `partial` case gets the same treatment at a softer register (the existing 일부 놓침 feedback names the missed types, AC-5.1). A build that applies R-g silently fails this AC even if every number is right.

### 3.5 Round 2 — mechanics M1–M4

- **AC-5.1 (M1)** There is **one** selection state, `state.turn.marked` (a `Set` of original token indices). Clicking a token in the prompt toggles membership. M1 is the act of marking; M2 transforms the marked set. **M1 carries no independent score and no §5 row** — it exists as M2's prerequisite, and `gradeMasking()` is the **sole grader** of the prompt side.
  **The 13쪽 pedagogy is preserved without a score row:** on send, correctly-marked risk tokens flash a confirmation, every missed risk token is revealed with its type label, and `rankMissedRisk()` logs misses **by risk type** for the ending card.
  **Per-card risk keys — sizes are normative (F1e), derived by `tokenize()`, and asserted by `auditCardSet()` clause F:**
  card 1 = `pii_name` ×3 · `pii_phone` ×3 · `biz_id` ×2 → **R = 8**, `need = 6`, across 3 문의 entries *(plus the ungraded `…외 27건` display line)*;
  card 2 = `pii_name` ×5 (참석자 문단) · `unreleased_perf` ×2 · `hr_eval` ×1 (요약-eligible 논의 본문) → **R = 8**, `need = 6`;
  card 3 = **empty** (§6: "위험 요소: **없음**") → clause **C1**, `need` undefined;
  card 4 = `unreleased_spec` ×8 (스펙 4 · 출시일 2 · 가격 2), whole-document, **≤6 문단 with ≤2 risk tokens per 문단**, **no 요약-eligible unit** → **R = 8**, `need = 6`;
  card 5 = 3 지원자 entries × (`pii_name` ×1 + `pii_attr` ×2), **no 요약-eligible unit** → **R = 9**, `need = 7` *(plus `…외 9건`)*;
  card 6 = a non-eligible 핵심 조항 unit (`biz_id` 거래처명 ×2, `confidential_amount` 금액 ×2) plus **two** 요약-eligible 조항 units (`confidential_doc` ×2 each) → **R = 8**, `need = 6`, all within ≤6 문단.
- **AC-5.2 (M2)** With tokens marked, each of the four mask tools applies a distinct, visible transform, and the **transformed** text — not the original — is what gets sent: `익명화` → 실명/속성/금액 become the **authored inline replacement** (F1c R-r1); `마스킹` → 전화번호·식별번호 become `010-****` (the one derived transform, R-r2); `가상데이터` → real figures are replaced with the **authored inline replacement**; `요약` → **the declared unit collapses to its authored summary sentence**. **There is no derived 익명화 transform and no 직책 map anywhere in the file** (AC-1.6).
- **AC-5.2b** *(boot assertions, extended in v5)* `tokenize()` **throws at boot**, naming card and token, if:
  - a token whose risk type's `neutralizedBy` contains **`anonymize` or `fake`** lacks its `>대체값` (**R-r1** — this now covers `pii_name`, `pii_attr`, `confidential_amount`, `unreleased_spec`, `unreleased_perf`);
  - a 요약-eligible unit's summary sentence is empty, or an `@@` header names a tool other than `summarize`;
  - a `…외 N건` line contains a `[`.
  Additionally, **요약 is applicable only to a declared 요약-eligible unit**, collapses **exactly one whole unit**, and is refused with an inline message on a selection that touches no eligible unit or spans two (copy: OQ-4 item 12). A 1:1 tool applied to an index already inside an applied 요약 collapse is likewise refused (R-c3), **and so is a 1:1 tool applied to a risk token whose type does not list it as a neutralizer *and* which carries no authored `>대체값` (R-c4)** — there is no string to substitute and R-m1 forbids an empty one.
- **AC-5.3 (M2 grading)** Graded by the **ordered, exclusive, total** clause set of §2.6.2 — `C1 empty-key → clean`, `C2 coverage = 1 → clean`, **`C3 coverage < θ → raw`**, `C4 otherwise → partial` — evaluated in that order, returning at the first match. "Neutralized" is defined by **R-n1**; the count-versus-count comparison is **R-n2 / R-g** against `SCORE.maskCoverageThreshold = 0.7`. **The ordering is normative.** On a card with an empty risk key the `그대로 처리` row is structurally unreachable. A `raw` grade additionally **forfeits that turn's baseline** (R-f′).
- **AC-5.3b** *(new in v5 — the boundary stated as an observable)* On every shipped card, the grade transition points are exactly: **0–5 neutralized of 8 → `raw`; 6–7 of 8 → `partial`; 8 of 8 → `clean`** (cards 1, 2, 4, 6), and **0–6 of 9 → `raw`; 7–8 of 9 → `partial`; 9 of 9 → `clean`** (card 5). Equivalently and uniformly: **3개 이상 놓치면 `raw`, 1–2개 놓치면 `partial`, 0개면 `clean`.** A build in which a single masked token produces anything other than `raw` on any card fails this AC. Observable directly in `?debug=score`, which prints `n/R` and the resulting grade for every send.
- **AC-5.4 (M3)** Every token in the AI answer is clickable to toggle an underline, **on every card from the 전환점 onward** (AC-5.6). The key marks 수치 · 출처 · 고유명사 spans (§4 row 3) plus the two types OQ-3 proposes.
- **AC-5.5 (M4)** Applying the **correct** verification tool to a correctly underlined **genuine** span produces the reveal and scores `환각을 잡아냄` **per span** (`업무+5 / 보안+5`), naturally capped at 2 per turn. Per §2.8: card 3 → 근거요구 (`"출처를 확인할 수 없습니다"`) and 원문대조; card 5 → 자가검토 and 원문대조; card 6 → 교차확인 and 원문대조. Applying a tool to a **decoy** consumes the tool and its `업무 −3` and returns a benign **`"문제 없습니다"`**.
- **AC-5.5b** Applying a verification tool to a correctly underlined **genuine** span whose `resolvedBy` tool is a *different* one: consumes the tool and its `업무 −3`, scores **no** catch, leaves the span **uncaught**, and returns a deliberately **non-committal** result — **`"특별한 문제를 찾지 못했습니다"`** — textually distinct from a decoy's `"문제 없습니다"`. It invents **no new §5 row**, and does **not** by itself trigger `검증 없이 답변 제출`. Each genuine span declares `resolvedBy: <toolId>` in its annotation; decoys declare `resolvedBy: null`.
- **AC-5.6 (mechanic exposure)** **Exposure follows the unlock boundary, not the content tier.** Cards **before the 전환점** (cards 1, 2) expose **M1 + M2** only. Cards **from the 전환점 (card 3) onward** — including tier-A card 4 — expose **M1 + M2 + M3 + M4**. **Card 3 exposes the masking editor even though its risk key is empty**; on send it shows a dedicated reveal line (copy: OQ-4). Spending a tool on a post-unlock card with no genuine spans costs `업무 −3` and returns `"문제 없습니다"`.
- **AC-5.7** **`검증 없이 답변 제출` fires when, and only when, a card whose answer contains at least one genuine hallucination span (content tier B) is sent having used ZERO verification tools on that turn.** Using any verification tool on that turn — including on a decoy, and including one that returns AC-5.5b's non-committal result — satisfies "검증". It cannot fire on a tier-A card, **including post-unlock card 4**. It can never fire on a `거절` (R-c). When it fires it queues the deferred `보안 −25` at `SCORE.boomerangDelay` and grants **no additional 업무**. *Reading (a) and the tier-B narrowing are **supplied rules** — **OQ-10**, S0.2(B) Q2.*
- **AC-5.8** **All six cards carry an authored feedback line.** Cards 1 and 2 ship the §6 verbatim lines. The PRD authors **no** feedback copy for cards 3, 4, 5 or 6; those four lines, plus the `요청 거절` line, are authoring deliverables in S3.1c (**OQ-4**).
- **AC-5.9** Every round-2 answer belonging to a tier-B card (3, 5, 6) contains **exactly 5 underlinable candidate spans, of which exactly 2 are genuine hallucinations** and 3 are plausible decoys — matching PRD line 148 literally. Verifiable by counting `!` and `?` annotations per card; a boot assertion in `?debug=1` names any card that violates it.
- **AC-5.10** **Post-unlock non-hallucination cards** — card 4 in both the full set and DEMO_MODE — carry **at least 2 decoy candidates each**, so that "this answer has underlinable things in it" never itself signals "this answer is fabricated." Pre-unlock cards (1, 2) expose no underline UI and are exempt.
- **AC-5.11** Each of the two genuine spans on a tier-B card is resolved by a **different** verification tool (§2.8), so a maximal play on that card uses exactly the 2-tool budget on two distinct tools. This is what makes card 6 a genuine 최종 관문.
- **AC-5.12** On a tier-B send where ≥1 verification tool was spent and **zero** genuine spans were caught, a **non-scoring** feedback beat fires naming that the tools were used but the real risk was not found (copy → OQ-4 item 15). It changes no score under reading (a).

### 3.6 Confidence badges (§8)

- **AC-6.1** Every AI answer in both rounds carries exactly one badge from `⭐ 확실합니다` / `아마도` / `확인이 필요합니다`.
- **AC-6.2** **Every** answer containing a hallucination or a wrong claim carries `⭐ 확실합니다`. Auditable: for each of the 6 cards, the pairing of (answer contains hallucination?) × (badge) is listed in a content table **in the source comments adjacent to `CARDS`**.
- **AC-6.3** At least one benign, correct answer carries a lower-confidence badge, so the correlation is learnable rather than a tautology.
- **AC-6.4** No in-game text ever explains the badge rule. It is taught by pattern only (§8).

### 3.7 Auxiliary devices (§9)

- **AC-7.1** In round 2 **only**, pressing 전송 opens a modal reading exactly **"이 내용, 밖에 나가도 괜찮은 걸까?"** with two buttons labeled exactly **`그냥 보내기`** and **`다시 보기`**. `다시 보기` returns to editing with all marks intact and does **not** re-award the baseline (AC-4.2c). (`요청 거절` opens no modal — AC-2.6.)
- **AC-7.2** The **`다시 묻지 않기`** checkbox is present from the **3rd card of round 2 onward**, gated on **`state.turnIndex >= 2`** (0-based — AC-1.9). PRD line 277 says "3장째부터" — a **card index**, not a count of modal appearances. The constant is `SCORE.checkboxTurnIndex = 2`.
- **AC-7.3** From game start, the top-right shows **`사용 중: 무료 플랜`** in small type.
- **AC-7.4** The **⚙ 설정** icon appears from `state.turnIndex >= SCORE.gearTurnIndex`, derived from three constraints rather than a formula:
  - **C-g1** `gearTurnIndex ≠ SCORE.checkboxTurnIndex`; **C-g2** `gearTurnIndex ≤ N − 2`; **C-g3** `gearTurnIndex ≥ 1`.
  - Solutions: **N ≥ 5 → `gearTurnIndex = 3`** (turn 4, §9's "2회차 중반"); **N = 4 → `gearTurnIndex = 1`** (turn 2). Expressed in source as `N >= 5 ? 3 : 1` **with the three constraints written above it**, and **asserted at boot by `auditCardSet()` clause E**.
  - Keyed to the **turn index, not a card id** — a card-id trigger silently deletes the mechanic under any card-set trim. A codebase-wide sweep for other card-id couplings is a deliverable of S3.6. PRD §9 says only "2회차 중반", so the exact turn is an **assumption** (**OQ-9**). Opening it shows a switch labeled **`대화 내용을 학습에 사용`**, default **ON**.
- **AC-7.5** Turning that switch off grants 보안 **+10** once, with the AC-4.7 chip. Never finding it does not block progress.
- **AC-7.6** If it was never turned off, the ending includes exactly this line: **"설정에 학습 사용을 끄는 옵션이 있었습니다. 무료·유료·기업용은 정책이 다릅니다."**

### 3.8 Ending (§10)

- **AC-8.1** The result screen classifies the run into the 2×2 by (업무 high/low) × (보안 high/low), using the **displayed (clamped)** values, with quadrant names exactly `유출 사고` (업무 높음 / 보안 낮음), `AI 네이티브` (업무 높음 / 보안 높음), `최악` (업무 낮음 / 보안 낮음), `안전한 무능` (업무 낮음 / 보안 높음). **"High" means `≥` the threshold, not `>`.** Thresholds:
  - **보안: a flat 60**, because 보안 always tops out at exactly 100 by construction on any run with no raw send.
  - **업무: `10 · N`** (= 60 at N=6, 50 at N=5, 40 at N=4), because 업무's reachable maximum scales with card count.
  - Both live in `SCORE.threshold` as `{security: 60, taskPerCard: 10}` (**OQ-5 / OQ-12**; final value set at the v0.4 gate). AC-4.5's fourteen reference runs confirm all four quadrants are reachable at N=6, and the v0.3 gate confirms the same at N=4.
- **AC-8.1b** *(NORMATIVE — restated over the sub-θ space in v5; §2.6.6)* **For every shippable card set, `AI 네이티브` must be unreachable on any run in which every send's masking coverage fell below θ** — i.e. every send graded `raw`, `reject`, or `clean` via **C1**; none graded `clean` via C2 and none graded `partial`. This is the formal content of PRD line 146 and overview.md line 51, and it is **not** discharged by inspecting the reference table:
  - Verified by `auditCardSet()` **clause B** (AC-1.10), which enumerates the **sub-θ** outcome subspace — not merely the zero-masking point — reports the maximum displayed 보안 among profiles clearing the 업무 threshold, and **throws** if that maximum reaches `SCORE.threshold.security`.
  - The required margins at the shipped thresholds are **N=6 → 31 (margin 29)**, **N=5 → 50 (margin 10)**, **N=4 → 40 (margin 20)**. The audit prints all three; the v1.0 gate records them.
  - **AC-4.5 rows 8 and 12** are the two single-run regression tests for the same property, for a human who is not reading audit output: row 8 covers zero masking, **row 12 covers minimal masking**.
  - **Stated scope, with the corrected arithmetic.** AC-8.1b constrains *no meaningful masking anywhere*. It does **not** require that masking only *one* card fail — run 14 (한 장만 제대로, 72/68) reaches `AI 네이티브` by design at threshold 60, and so do its two cheaper siblings **run 14a (72/67, two bulk applications on card 2)** and **run 14b (72/60, exactly on the threshold)**. Excluding the class would require 보안 ≥ 69 / 91 / 86 at N = 6 / 5 / 4, and **at N = 5 no single FLAT threshold reused across card counts can do it**, because the one-card frontier (90) sits above the careful-but-imperfect run that verifies *minimally* (88). Three closures exist and all three are routed to the PRD author as **OQ-12(ii)**: **(α)** the structural rule **R-h** ("any run containing a raw send is ineligible for `AI 네이티브`"), the only one that holds identically at every card count, but which re-prices §5 row 1; **(β)** a purely score-based closure **at the default N = 6 alone** — a flat 보안 threshold of **69** excludes the whole disclosed class there while still admitting the careful-but-imperfect run (75/85); **(γ)** a per-card-count 보안 threshold triple, which closes it at every N at the cost of the flat-threshold design and of requiring near-maximal verification at N = 5. Clause **B2** records the one-card frontier on every load so the decision cannot quietly drift.
- **AC-8.2** Each quadrant shows a distinct one-line comment. The `안전한 무능` line is exactly: **"안전했지만, 아무 일도 못 했습니다. 가려서 쓰면 둘 다 가능했어요."** The other three lines are newly authored in the PRD's voice (**OQ-4**).
- **AC-8.3** The 내 직무 안전 카드 renders three blocks with these exact headings: **`당신이 가장 자주 놓친 것`**, **`당신의 직무에서 특히 조심할 것`**, **`오늘의 안전 3습관`**. The third reads exactly **`멈추기 · 가리기 · 확인하기`**. The second reflects a player-chosen role from `HR / PO / 디자인 / 개발`. The first is computed by `rankMissedRisk()`, which:
  - **reads `state.log` entries from round 2 only.** Round 1 is by construction a total-miss round, so including it would return the same answer for every player. Normative, stated in a source comment.
  - has **three** branches: (1) **misses > 0** → the PRD's format, `→ 미공개 정보 (3회)`; (2) **misses == 0 and sends > 0** → a distinct zero-miss line (copy: **OQ-4**); (3) **sends == 0** (전부 거절) → a distinct line (copy: **OQ-4**).
  - If AC-4.8's overcap line or AC-4.8b's undercap line applies, it renders as a smaller additional line.
- **AC-8.3b** Round-1 outcomes do **not** feed `rankMissedRisk()`'s personalization. They contribute exactly **one** separate, non-personalized line drawn from `state.log.round1Dots` (copy: **OQ-4**).
- **AC-8.4** The card can be **saved as an image**: native `<canvas>` 2D + `toDataURL('image/png')` + `<a download>`, no library. **Sharing beyond save is explicitly out of scope** and is a stated deviation from PRD §10: a `file://` page with zero network access cannot implement real sharing. `navigator.share()` is attempted opportunistically and its absence is silent.
- **AC-8.5** A single **`복사하기`** button copies exactly these four lines, character for character, including the `·` bullets and the `'모른다'` single quotes:

  ```
  · 답의 근거와 출처를 함께 표시해줘.
  · 확실하지 않으면 '모른다'고 말해줘.
  · 이 자료 안에서만 답하고, 없는 건 지어내지 마.
  · 방금 답에서 틀릴 수 있는 부분을 스스로 짚어줘.
  ```

- **AC-8.6** Copy works on `file://`: `navigator.clipboard.writeText` with a `document.execCommand('copy')` fallback over a hidden textarea, plus a visible success state. Verified in all four target browsers opened from disk. The four lines are always rendered as selectable text.
- **AC-8.7** This is the last screen the game leaves on display (§10). The ending screens carry `.screen-ending__dotzone` (E2b) so the round-2 dot accumulation — now in three variants (AC-4.11) — is visible here.

### 3.9 Pacing, coverage and mode

- **AC-9.1** A first-time player finishes round 1 in ≈2 minutes and round 2 in ≈5 minutes (±30s), measured over at least 3 observed playtests.
- **AC-9.2** A `DEMO_MODE` flag trims round 2 to cards **1, 3, 4, 6** and shortens boomerang dwell times. The alternative `{1, 2, 3, 4}` was compared on **eight** criteria (§2.7) and rejected because it contains only **one** tier-B card. The accepted costs of `{1,3,4,6}` are named in §2.7 and carried in a DEMO_MODE source comment, **together with that set's necessity margin (20) and one-card frontier (85)**.
- **AC-9.3** **Every shippable card set must REQUIRE all four §6 masking techniques (익명화 · 마스킹 · 요약 · 가상데이터), each genuinely necessary via at least one card in that set.** "Required" is a **non-existence claim, checked exhaustively**: technique `T` is *omissible* iff every card in the set admits a full-neutralization assignment that avoids `T`; the set passes iff **no** `T` is omissible. Computed by `auditCardSet()` clause C from the shipped `RISK_TYPES` map and 요약-eligible unit declarations, and it **throws** naming the omissible technique. **Scope note (v5):** this is a claim about *clean* play — it guarantees a player cannot fully neutralize every card without every technique. It is deliberately **not** a claim that every `partial` grade exercises every technique (§2.9.1's closing note). S5.5 checks this against §11's 14쪽 row.
- **AC-9.3b** **The shipped default card set must require all four §7 verification tools, each as the `resolvedBy` tool of at least one genuine span.** Satisfied by §2.8's assignment on the full 6-card set. **A named, bounded exemption applies to ANY shipped set that omits card 5** — `DEMO_MODE {1,3,4,6}` or the 5-card fallback `{1,2,3,4,6}`: **자가검토 is not exercised**, because card 5 is its only home. The exemption is stated in the source comment of whichever set is active, and **any set that invokes it marks §11 row 14 미흡**.
- **AC-9.4** `baselineAward(k, N)` reads N from the active card set, so any set (N = 4, 5 or 6) still tops the 보안 gauge out at exactly 100 on a run with no raw send. `SCORE.threshold.taskPerCard` likewise scales the 업무 axis, and `SCORE.gearTurnIndex` is derived per AC-7.4's constraints.
- **AC-9.5** **Every card-set change — trimming to DEMO_MODE, invoking any R15 rung, reordering, or re-authoring a card's risk key — must re-run `auditCardSet()` and record its six clauses.** A set that fails clause **B** (necessity), clause **C** (technique coverage) or clause **F** (coverage band) may not ship under any circumstances; a set that fails clause **D** (tool coverage) may ship only under AC-9.3b's named exemption with the corresponding §11 row marked 미흡; a **change in clause B2's reported value must be re-ratified against OQ-12(ii) before shipping**, since it moves what "가려서 처리" buys. *(v5 adds clause F and B2 to this rule, and adds "re-authoring a card's risk key" to the trigger list, because under R-g a content edit that changes `R` changes every grade boundary on that card.)*

---

## 4. Implementation Steps

Organized by the PRD §12 staged build plan, **plus one new stage (v0.1.5)**. This is a from-scratch build — the repo contains only `docs/PRD.md` and `docs/overview.md` — so every step names concrete structures inside the single `index.html`.

### Target internal structure of `index.html`

```
<!doctype html>
<html lang="ko">
<head>
  meta charset utf-8 / viewport / <title>우리는 우리가 넣은 대로 된다</title>
  <link rel="icon" href="data:,">          <!-- suppresses the favicon request (AC-1.1) -->
  <style>
    /* S1  reset + :root custom properties (palette, spacing, type scale,
            and ALL named FX durations — the boomerang re-timing surface)    */
    /* S2  layout: .app > .statusbar | .stage(.pane-office .pane-ai) | .toolbar */
    /* S3  components: .gauge .gauge__earned .gauge__ghost .gauge__lost
            .gauge__overdraft .gauge__forfeit .gauge__chip .dotrow .doc
            .token .token--risk .token--marked .token--masked .token--collapsed
            .unit .unit--summarizable
            .dot .dot--partial .dot--masked   <-- THREE variants (AC-4.11)
            .bubble .bubble__tail .bubble--flood
            .ai .badge .answer .span--cand .span--underline
            .toolcard .toolcard--spent .sendrow .modal .switch .plan         */
    /* S4  screens: .screen--title .screen--r1[data-beat] .screen--interstitial
            .screen--r2 .screen--ending
            each carrying its own [data-region="dotzone-anchor"] EXCEPT title */
    /* S5  keyframes: dot-fly, dot-settle, dot-drain, baseline-forfeit,
            screen-darken, freeze, article-rise, bubble-flood (파국)          */
    /* S6  @media (max-width: 820px) — panes stack; 원본 → line-per-clause     */
    /* S7  touch targeting (AC-2.5)                                          */
  </style>
</head>
<body>
  <div id="app"></div>           <!-- render() writes only via region(name) -->
  <div id="dotReservoir"></div>  <!-- boot-created; OUTSIDE #app; transform-anchored -->
  <div id="fxLayer"></div>       <!-- IN-FLIGHT fx only -->
  <div id="modalRoot"></div>
  <script>
  (function () { 'use strict';
    /* ===== 1. CONTENT DATA ===== */
    //   COPY          — every fixed Korean string, incl. all PRD-verbatim lines
    //   SCORE         — PRD §5 table + §9(2) bonus + threshold + boomerangDelay
    //                   + checkboxTurnIndex + gearTurnIndex
    //                   + maskCoverageThreshold: 0.7   // PRD §5 보완: R-g, §2.6.3
    //                   frozen
    //   AUDIT         — expected.zeroMaskFrontier {6:31,5:50,4:40}
    //                   expected.oneCardFrontier  {6:68,5:90,4:85}   // clause B2
    //   RISK_TYPES    — taxonomy + per-type neutralizedBy + requiresReplacement
    //                   (§2.9.1; OQ-2; AC-4.10)
    //   HALLU_TYPES   — 환각 5대 위험지점 taxonomy                        (OQ-3)
    //   MASK_TOOLS    — 익명화 · 요약 · 가상데이터 read AUTHORED values (F1c R-r1);
    //                   ONLY 마스킹 carries a derived transform()      (R-r2)
    //                   << there is NO anonymize.transform and NO 직책 map >>
    //   VERIFY_TOOLS  — 근거요구 · 원문대조 · 교차확인 · 자가검토  (§2.8 assignment)
    //   CARDS         — 6 card objects, ANNOTATED STRINGS (Decision F, incl. F1c
    //                   `>대체값` slots and `@@ summarize>` unit headers)
    //                   + badge audit table in adjacent comments (AC-6.2)
    //                   + F1e's pinned risk-key sizes as a comment table
    //   ENDINGS       — 4 quadrant objects; ROLES — HR/PO/디자인/개발
    /* ===== 2. STATE ===== */
    //   PHASES enum, state, initRound(n), goPhase(next)
    //   turnIndex is 0-BASED (AC-1.9); state.turnsAwarded guards the baseline
    /* ===== 3. PURE LOGIC ===== */
    //   baselineAward(k,N), applyScore(sendOutcome, modifiers)   // R-f′ forfeit on 'raw'
    //   isNeutralized(i)   — THE single rule R-n1
    //   coverage(card, transformed) = neutralizedCount / riskKeySize   // R-n2
    //   gradeMasking       — ORDERED clause set C1..C4, C3 = COVERAGE test (R-g);
    //                        the ONLY reader of SCORE.maskCoverageThreshold (AC-1.5)
    //   gradeUnderlines, resolveVerify(span, tool)  — AC-5.5 / AC-5.5b
    //   queueBoomerang(delay), dueBoomerangs, flushPendingBoomerangs
    //   rankMissedRisk (round-2 log only, 3 branches — AC-8.3)
    //   endingQuadrant, buildSafetyCard, gaugeSegments(internal, k, N)
    //   auditCardSet(cards, thresholds) — clauses A, B, B2, C, D, E, F (§2.9.2)
    /* ===== 4. RENDER ===== */
    //   region(name)  — the ONLY write accessor; throws on a non-[data-region] target
    //   render, renderStatusBar, renderGauges (3 segments + forfeit beat),
    //   renderDotRow, renderOfficePane, renderBubble, renderAIPane,
    //   renderPromptTokens (reads the F1a overlay), renderAnswerTokens,
    //   renderBadge, renderToolbar, renderSendRow, renderModal,
    //   renderFeedback  (incl. AC-4.13's exposed-count line on a sub-θ raw send),
    //   renderR1Turn, renderR2Turn, renderScreen(phase)
    /* ===== 5. FX ===== */
    //   bindReservoirObserver(), anchorReservoir()  // tail of BOTH render() and goPhase()
    //   flyDot, settleDot (adopts into #dotReservoir, picks the variant from the grade),
    //   replayDot, drainDots, darken, freeze, bubbleFlood (파국), scoreChip,
    //   forfeitBeat, clickSound (WebAudio), silence(), reanchorInFlight() on resize
    /* ===== 6. EVENTS ===== */
    //   one delegated pointer/click listener on #app reading data-act / data-arg
    //   round-1 drag handlers on [data-act="dragSource"] — ungraded (B3)
    //   fallback-reveal watchdog: failed | stalled | IDLE-12s (AC-3.3b)
    //   one keydown listener (Esc closes modal, Enter confirms)
    /* ===== 7. BOOT ===== */
    //   tokenize all cards (the ONLY tokenize() call site — AC-1.6b), which also
    //     asserts R-r1: EVERY anonymize- or fake-neutralized token has a >replacement;
    //     every @@ summarize> unit has a non-empty sentence; no [ inside "…외 N건"
    //   assert AC-5.9 / AC-5.10 in ?debug=1
    //   run auditCardSet() — clauses A–F — in ?debug=audit / ?debug=1   (AC-1.10)
    //   install the AC-1.8 I-3 MutationObserver and the I-4 identity assert
    //   parse ?debug= / ?phase= / ?seed= / DEMO_MODE, goPhase(PHASES.TITLE)
  })();
  </script>
</body>
</html>
```

### Card object shape — annotated strings (Decision F, with F1c's grammar as revised in v5)

```js
{
  id: 2,
  title: '회의록 정리',
  tier: 'A',                       // CONTENT tier only. Exposure = unlock boundary (AC-5.6).
  rounds: [1, 2],
  situation: '어제 회의록 통째로 넣을 테니 액션 아이템만 뽑아줘',

  // 원본. [텍스트|위험유형] 이 위험 요소. 표시 없으면 안전한 토큰.
  // [텍스트|유형>대체값] 은 작성자가 지정한 치환 문자열.
  //   >대체값 은 익명화·가상데이터로 해소되는 모든 토큰에 **필수** (R-r1).
  //   마스킹으로만 해소되는 유형(전화번호·식별번호)만 파생 변환을 쓴다 (R-r2).
  // 문단 첫 줄의 `@@ summarize> …` 는 그 문단을 요약 가능 단위로 선언한다 (R-m2).
  // 조사는 괄호 밖 (F1b). 치환으로 조사형이 바뀌는 경우에만 괄호 안에 포함한다.
  // ※ 참석자 문단은 요약 불가 단위 → 실명은 익명화로만 해소된다 (R-c1, AC-2.4b).
  // ※ 위험 키 크기 R = 8, need = ceil(0.7 x 8) = 6  (F1e, 부팅 시 clause F가 검사)
  source: `참석자: [김민수|pii_name>A 팀장] / [이수진|pii_name>B 파트장] /
           [박현우|pii_name>C 책임] / [정다은|pii_name>D 선임] / [최영호|pii_name>E 매니저]

@@ summarize> 지난 분기 실적과 조직 개편 논의가 있었고, 액션 아이템 3건이 도출되었다.
3분기 매출은 [129,000만원|unreleased_perf>약 12억원대]으로 집계되었고,
4분기 목표는 [158,000만원|unreleased_perf>약 16억원대]으로 상향되었다.
[박 책임의 고과가 낮아 전환 배치가 필요하다는 의견|hr_eval]이 나왔다.`,

  answer: {
    badge: '⭐ 확실합니다',
    // [텍스트|유형!도구] = 진짜 환각(해당 도구로만 해소), [텍스트|유형?] = 미끼 후보
    text: `액션 아이템은 세 가지입니다. …`,
    reveal: {},
  },

  round1Outcome: { kind: 'quote', target: 'otherAI', text: '…' },
  feedback: '이 결과를 만들 수만 있으면 되지, 원본을 다 줄 필요는 없습니다.',  // §6 verbatim
}
```

No `riskKey`, no `riskKeySize`, no index list, no `answer.tokens` array, **no replacements table and no 직책 map** — `tokenize()` derives all of them at boot, once, in the BOOT section only (AC-1.6 / AC-1.6b). Neutralizing-technique rules live once in `RISK_TYPES`.

> **Note the two magnitude-correct 가상데이터 values above.** `129,000만원` is 1.29 billion won, so its plausible fake is `약 12억원대`, not `약 10만원대 후반`. v4's example was off by ~10⁴. S5.5's read-through carries an explicit order-of-magnitude check for exactly this.

---

### Stage v0.0 — 레퍼런스 플레이 (no code)

**S0.1 — Play the reference.** Every implementer plays <https://game.hyeon.me/wbwwb/> to completion, paying attention to the final minute. PRD §1 is emphatic: "제작 전 반드시 한 번 플레이해볼 것… 글로는 전달되지 않는 부분입니다."
*Deliverable:* a 5-bullet note on what specifically makes the reference's turn land, used as the yardstick for the **v0.1.5** and v0.4 reviews.
*Acceptance:* everyone who will touch the boomerang sequence has played it.

**S0.2 — PRD-author escalation packet.** Named owner: **the PRD author**. Two lists, with different blocking semantics. **Every question this plan leaves open goes through here.**

*(A) BLOCKING before **S3.1a** (card authoring) begins — the missing slide content:* 자료 **13쪽 (5대 위험 신호)**, **15쪽 (직무별 조심할 것)**, **16쪽 (Before/After 프롬프트)**, **20쪽 (환각 5대 위험지점)**. This mitigates *being wrong* about OQ-2 / OQ-3 / OQ-8. If unavailable by that deadline, the build proceeds with the proposed taxonomies plus an in-source `// ASSUMPTION — 자료 미확인` banner on each affected block, and a v1.0 gate sign-off line recording that they shipped unverified.

*(B) NON-BLOCKING parallel questions.* Sent at the same time; **no step waits for answers.** The plan proceeds on its own resolutions and states each reversal cost:

  - **Q1 (→ OQ-1):** PRD §5 line 128 says both gauges start at 0, but the 설계 의도 requires 전부 거절 → 보안 100. Which is intended — a 0-start display (this plan's G2) or a 100-point baseline (G1)? *Reversal cost:* a display-layer change in `renderGauges()` plus one line in `applyScore` for every run containing no raw send; on raw runs it also requires re-deciding Q6.
  - **Q2 (→ OQ-10):** Does "검증 없이 답변 제출" mean *no verification tool used on that card* (reading (a)), *no genuine span caught on that card* (reading (a′)), or *any genuine hallucination left uncaught* (reading (b))? And does it apply to cards with nothing genuine to miss? *Discriminator:* **AC-4.5 run 10** reads 81 / 100 → AI 네이티브 under (a) and 81 / 25 → 유출 사고 under (a′); under (b), runs 3, 5 and 6 change quadrant. *Reversal cost:* one predicate inside `applyScore`'s deferred-penalty branch.
  - **Q3 (→ OQ-9):** "2회차 중반" (⚙) and "3장째부터" (다시 묻지 않기) — confirm both are read as 0-based turn indices, and that the ⚙ appearing at turn 2 under DEMO_MODE's N=4 is acceptable.
  - **Q4 (→ OQ-6):** 회차별 카드 순서. Round-2 order 1→2→3→4→5→6 satisfies both the difficulty ramp and the recognition beat, and the 전환점 unlock at card 3 depends on it. Confirm.
  - **Q5 (→ OQ-7):** 부메랑 소유권. §4 names cards 1 and 3 as the two staged headline boomerangs; cards 2 and 4 are staged as supporting montage beats (AC-3.6). Confirm this weighting.
  - **Q6 (→ OQ-12), *rewritten in v5 with corrected arithmetic*:** the necessity closure, in two parts.
    - **(i) The mechanism.** PRD line 146's "가려서 처리해야만 양쪽 모두 확보" is now enforced by two rules together: **R-f′** (a raw send forfeits that turn's supplied baseline award) and **R-g** (a send counts as `raw` when less than **θ = 0.7** of its risk key was neutralized — in shipped terms, *3개 이상 놓치면 그대로 처리로 본다*). Neither touches a §5 value; all three 설계 의도 outcomes reproduce exactly. **θ is a Planner engineering decision, not a question** — it is derived in §2.6.3 from the shipped content's own structure and sits on a plateau `(0.667, 0.75]` where no grade changes. It is listed for **playtest ratification at v0.4**, phrased for a human as: *"2개까지 놓친 건 봐주고, 3개부터는 안 가린 것으로 치는 게 맞나?"* The question to the author here is only whether the resulting register is right; the alternative of giving **거절** a 보안 cost targets the same lever more directly but changes 전부 거절 → 보안 100, a PRD literal, and is therefore not the Planner's to take.
    - **(ii) The one genuinely open judgment, with accurate numbers.** AC-8.1b guarantees that a run with *no meaningful masking anywhere* cannot reach `AI 네이티브`. It does **not** exclude the **one-card class**. Three worked members of that class, all at N = 6, all reaching `AI 네이티브`, **shown cheapest-first because that is what the decision should be made against**:
      - **Run 14a — 72 / 67, TWO tool applications.** c1·c4 거절; **c2 cleaned entirely with two bulk gestures** (`문단 전체 선택` + `익명화` over the 5-name 참석자 문단, then one `요약` collapse over the 논의 본문 unit — 그 카드는 그 두 번만으로 완전히 클린 판정을 받는 구조다); c3 verified at cap; **c5 and c6 sent wholesale**; ⚙ found. **This is the cheapest known route to the top ending while leaking two documents.**
      - **Run 14b — 72 / 60, THREE tool applications, exactly on the threshold.** Same shape, but the masked card is **c6 at 6/8 = 0.75 coverage → `partial`** via 마스킹 + 익명화 on the 핵심 조항 and one 요약 collapse. It lands on the boundary value itself, which is the clearest demonstration of how far down the class reaches.
      - **Run 14 — 72 / 68, FOUR tool applications.** The class maximum (what clause B2 asserts), masking c6 completely.
      - **What it would take to exclude the class.** 보안 ≥ **69 (N=6) / 91 (N=5) / 86 (N=4)** — and **at N = 5 no single FLAT threshold, meaning one number reused at every card count, can do it**, because the one-card frontier (90) sits above a careful player who masks everything but misses one token per card and verifies *minimally* (88). **Three closures are available, and the Planner takes none of them:**
        - **(α) Structural rule R-h** — *"any run containing at least one raw send is ineligible for `AI 네이티브`"*, one line in `endingQuadrant`. **The only option that closes the class identically at N = 6, 5 and 4 at once.** Cost: a single unmasked send becomes permanently disqualifying, contradicting §5's forgiving register.
        - **(β) Score-based closure at the shipped default N = 6 alone** — move the flat 보안 threshold from 60 to **69**. That excludes all three runs above (68, 67, 60) while still admitting the careful-but-imperfect run (75, or 85 with the ⚙). **No new rule, no new concept.** Cost: it does not generalize to N = 5, and it narrows the top-ending band for careful players too, so it must be read against OQ-5's playtest question.
        - **(γ) A per-card-count 보안 threshold triple** (e.g. `{6: 69, 5: 91, 4: 86}`) — closes it at every N without a structural rule, but abandons the flat-threshold design and, at N = 5, effectively requires **near-maximal** verification effort (≈98) from a careful player to qualify.
      - **Several defensible answers; the Planner proceeds with a flat 60 and no R-h, and records the frontier on every audit load.**
      > *v4 stated this question against a threshold figure of ~86 and called it "the threshold that would close 시늉만 가리기". That figure was arithmetically wrong under v4's own rules — both round-4 reviewers showed by enumeration that the minimal-masking frontier reached displayed **100**, so no threshold closed anything. The numbers above are recomputed under R-g and are the ones this question should be answered against.*
    *Reversal cost of (i):* one conditional in `applyScore`'s baseline branch plus recomputation of AC-4.5 rows 2, 7, 8, 9, 11, 12, 13. *Reversal cost of (ii):* one predicate in `endingQuadrant`, plus re-recording clause B2.

*Why (B) exists at all:* the person who wrote §5 can simply settle these; asking reviewers to ratify Planner-supplied readings is the wrong channel. Nothing in (B) blocks the build.

---

### Stage v0.1 — 2회차 카드 1장 · 클릭 판정 + 게이지
*PRD "확인할 것": **게이지 규칙이 재미있는가***

**S1.1 — File skeleton, CSS sections S1–S4 + S7, layout shell.**
Deliverables: `index.html` with the full §7 wireframe rendered statically — `.statusbar`, `.stage` split into `.pane-office` / `.pane-ai`, `.toolbar` with both labeled rows, `.sendrow` with `[전송]` and `[요청 거절]`, the `.pane-ai__dotzone` anchor placeholder carrying `data-region="dotzone-anchor"`, `#dotReservoir` / `#fxLayer` / `#modalRoot` created once at boot as siblings of `#app`. Inline SVG for `○ 요청자`, `□ 동료`, `○ 낯선 사람`, `[원본 문서]`. The `.bubble` component and `renderBubble(speakerId, text)`. **All three `.dot` variants styled here** (AC-4.11). All FX durations declared as `:root` custom properties.
*AC:* AC-2.1, AC-2.2, AC-2.3, AC-2.6, AC-1.1, AC-2.5.

**S1.2 — Data + state foundation + the gauge model.**
Deliverables: `COPY`, `SCORE` (§5 verbatim + `threshold` + `boomerangDelay: 2` + `checkboxTurnIndex` + `gearTurnIndex` + **`maskCoverageThreshold: 0.7`**, `Object.freeze`d), **`AUDIT.expected`'s two frontier constants**, `PHASES`, `state` (0-based `turnIndex`, `turnsAwarded`), `initRound(n)`, `goPhase()` (tail: `bindReservoirObserver()` then `anchorReservoir()`), `baselineAward(k,N)`, the delegated `data-act` listener, **`region(name)`**, `render()`, `renderStatusBar()`, `renderDotRow()`, `?debug=score` printing unclamped totals, the per-turn baseline ledger with its `forfeited` marker, **each turn's coverage fraction `n/R` and resulting grade (AC-5.3b)**, and the three max-excursion accumulators.
**`renderGauges()` ships the full 3-segment model here** (AC-4.11b) **plus AC-4.12's forfeit beat** — *not* a 1-segment bar to be enriched later.
Also: the `?debug=1` **MutationObserver** (I-3), the **I-4 observer-identity assert**, and the `?seed=` hook.
*AC:* AC-1.5, AC-1.8, AC-1.9, AC-4.1, AC-4.2c, AC-4.6, AC-4.7, AC-4.11b, AC-4.12, AC-9.4.
*Informed by, but not blocked on, OQ-1 and OQ-12.*

**S1.3 — Card 1 content + `tokenize()` + M1 marking.**
Deliverables: `tokenize()` and the derived-key pipeline (**including `riskKeySize`, `paraId` and `unitId` per token, which R-g and clause F both consume**), called **only** from BOOT, implementing the full F1 grammar — `[텍스트|유형]`, `[텍스트|유형>대체값]`, `@@ summarize>` unit headers, `!도구` / `?` answer annotations — with its boot assertions (**R-r1**: every anonymize-/fake-neutralized token carries a replacement; eligible units carry a sentence; `…외 N건` lines carry no `[`); `CARDS[0]` authored per §6 카드 1 at **R = 8** with the `…외 27건` device, the F1b 조사 rule, **an authored `>대체값` on each of the three 실명 tokens**, and **no 요약-eligible unit**; `RISK_TYPES` per §2.9.1 including `hr_eval` and the `requiresReplacement` flag; `renderPromptTokens()`; toggle handling into `state.turn.marked`.
*AC:* AC-5.1 (card 1), AC-2.4, AC-1.6, AC-1.6b, AC-5.2b.

**S1.4 — Scoring engine + send/reject flow + a real fixed mask.**
Deliverables: `applyScore(sendOutcome, modifiers)` driven entirely off `SCORE`, structurally single-award (AC-4.2b), with the baseline rule **R-f′**; the three v0.1-reachable outcomes — `그대로 처리`, `거절` (full AC-2.6 behavior), and masking via **one fixed, non-configurable `████` transform** applied to the marked set through the F1a overlay; **`gradeMasking()` implementing the ordered clause set C1–C4 with C3 as R-g's coverage test**, `isNeutralized()` implementing R-n1 as a single function, and `coverage()` as the single place `SCORE.maskCoverageThreshold` is read; gauge animation, `scoreChip()`, `forfeitBeat()` on a raw send, and **`renderFeedback()`'s AC-4.13 exposed-count line**.
> **This is the step where the v5 fix physically lives.** At v0.1 the player can already mask 1, 5, 6, 7 or 8 of card 1's eight risk tokens, so the v0.1 gate can observe every grade transition point (AC-5.3b) before any second card exists.
*AC:* AC-4.2, AC-4.2a, AC-4.2b, AC-4.2c, AC-4.6, AC-4.7, AC-4.12, AC-4.13, AC-5.3, AC-5.3b, AC-2.6.

**S1.5 — Dot reservoir + 딸깍.**
Deliverables: `#dotReservoir` outside `#app`; **`anchorReservoir()`** with its **E2a no-anchor branch (hide, never throw, never clear)**; **`bindReservoirObserver()`** disconnecting and re-observing the **current anchor node** from the tail of both `render()` and `goPhase()` (E2c); `resize`/`orientationchange` handling; `flyDot()` / `settleDot()` with reservoir adoption **and variant selection from the send's grade (AC-4.11)**; `replayDot()` setting `data-inflight` before lifting; `reanchorInFlight()`; `clickSound()` via a WebAudio oscillator created/resumed on first gesture and a no-op while suspended (R14). Dots carry `data-card-id`.
*AC:* AC-3.3 (dot half), AC-3.9 (groundwork), AC-4.11, AC-1.1, AC-1.8 (I-2, I-4).

**S1.6 — Card feedback.**
Deliverables: `renderFeedback()` showing the card's §6 피드백 문구 after send — card 1 verbatim: "결과물은 똑같이 얻었습니다. 원본을 다 줄 필요가 없었던 거죠."
*AC:* AC-5.8 (card 1).

**S1.7 — Stub end card.**
Deliverables: a minimal terminal screen reached after the last available card, reading the run's 업무/보안 totals and one neutral line, **with the `.screen-ending__dotzone` anchor already present** so E2b holds from the first stage that has an ending at all. ~25 lines. Replaced wholesale by S5.1–S5.3 at v1.0. Its purpose is that **every stage from v0.1 onward is something a human can finish** (Principle 5).
*AC:* Principle 5; E2b.

---

### Stage v0.1.5 — 부메랑 스파이크
*Gate question: **부메랑 순간에 소름이 돋는가*** — asked at stage 2 of 6 instead of stage 5 of 6.

> **Why this stage exists.** PRD §12 names v0.4's boomerang the **최대 관문**. Adopting the PRD's stage order literally would schedule the verdict on the make-or-break question *after ~80% of the build is sunk*. This stage moves the verdict forward using components v0.1 already built, at an estimated cost of **half a day**.

**S1.5a — `?phase=boomerang` spike route.**
Deliverables: a dev-only route playing exactly one beat — card-1 drag → dot flies → settles → screen darkens → the `○ 낯선 사람`'s `.bubble` renders `김OO 010-1234-XXXX` from the *same dot* flying back out → total silence → `bubbleFlood()` 파국 → freeze on **"다시 해보시겠습니까?"**.
Reuses from v0.1: card 1, shape-character SVGs, the `.bubble` component, `flyDot`/`settleDot`, `#dotReservoir` + `anchorReservoir` + `bindReservoirObserver`, `clickSound`.
New, small: the round-1 coarse **drag** handlers (B3) with the **three-condition AC-3.3b watchdog including the 12 s idle timer**, `replayDot()`, `darken()`, `freeze()`, `silence()`, `bubbleFlood()`, and the R1-as-one-screen `data-beat` structure (D1b).
**Also required here:** run AC-1.8's clauses (b) **and (c)**.
*AC:* AC-3.3, AC-3.3b, AC-3.5 (first boomerang only), AC-3.7, AC-3.8, AC-3.9, AC-3.11, **AC-1.8(b)(c) incl. I-4**.

**S1.5b — Spike credibility review.**
Deliverables: **3 fresh testers** (cohort 1 of the three budgeted — R17), no explanation given, faces watched. A written verdict plus the resulting timing constants.
*Explicitly NOT delivered here:* a verdict on **drag ergonomics**. That is v0.4 step 4.

---

### Stage v0.2 — 마스킹 에디터 추가
*PRD "확인할 것": **드래그 조작이 답답하지 않은가*** — under B3 this gate asks the **click-toggle** half; the **drag** half is asked at v0.4 step 4.

**S2.1 — M2 마스킹 에디터, 4 tools.**
Deliverables: `MASK_TOOLS` (익명화 · 마스킹 · 요약 · 가상데이터, matching 14쪽), with **익명화, 가상데이터 and 요약 reading their authored values from the F1c annotations (R-r1)** and **마스킹 as the single derived pure transform (R-r2)** — no side table, no 직책 map (AC-1.6); `applyMask(toolId)` producing the `state.turn.transformed` **overlay** per F1a — 1:1 for 익명화/마스킹/가상데이터 (never empty, R-m1), **declared-unit collapse** for 요약 (R-m2) with its two refusal messages, **R-c3's refusal** of a 1:1 tool on an already-collapsed index and **R-c4's refusal** of a 1:1 tool on a token with no substitutable value (wrong-type *and* no authored `>대체값`); **R-c2's last-write-wins**; `renderPromptTokens()` rendering transformed text distinctly and marking 요약-eligible units visually (`.unit--summarizable`); **structural bulk-select only — `문단 전체 선택` and `문장 전체 선택`** (AC-2.7; **the risk-type-keyed variant is forbidden, and the source comment above the bulk-select handler must state both reasons, including that it would fall outside `auditCardSet()` clause F3**); `마지막 동작 취소`; undo via re-click. The v0.1 fixed `████` transform is replaced by tool choice.
*AC:* AC-5.2, AC-5.2b, AC-2.3, AC-2.7, AC-1.6, AC-1.6b.

**S2.2 — Masking grader + card 2.**
Deliverables: `gradeMasking(card, transformed)` returning `clean | partial | raw` via the **ordered** clause set with **R-g's coverage test at C3**, wired to `SCORE`; `CARDS[1]` authored per §6 카드 2 at **R = 8** — **partitioned into a non-eligible 참석자 header unit (5 실명 → 익명화, each with its authored `>직책` replacement) and a 요약-eligible 논의 본문 unit (2 미공개 실적 수치 + 1 인사 논의 → collapsed away)** per R-c1 / AC-2.4b, which is exactly the PRD's "직책으로 치환, 수치는 제외"; the `unreleased_perf` tokens carry **magnitude-correct** `>대체값` per F1c; feedback verbatim.
> **Card 2 is also the clause-F3 binding case**: its 5-name 참석자 문단 is the largest single bulk application in the whole game, at 5 of 8 = 0.625 coverage. It is what sets θ's lower bound, and the v0.2 gate plays it explicitly (step 4d).
*AC:* AC-5.3, AC-5.3b, AC-4.10, AC-2.4b, AC-4.2 rows 1/3/4, AC-5.8 (card 2).

**S2.3 — Touch/mobile pass.**
Deliverables: CSS section S6 — panes stack below 820px; the 원본 switches to the line-per-clause list; ≥44px targets. Section S7's split touch targeting verified on device.
*AC:* AC-2.5.

**S2.4 — Whole-document card, early.**
Deliverables: a **minimal authored version of card 4** (미공개 정보 전체 → 가상데이터) at **R = 8 across ≤6 문단 with ≤2 risk tokens per 문단**, **declaring no 요약-eligible unit** so 가상데이터 is genuinely forced (§2.9.1), with **every `unreleased_spec` token carrying its authored fake value**. Shipped at v0.2 so the ergonomics gate can be answered against a card whose risk key is *the entire document* — and so the **coverage arithmetic is exercised on a whole-document card**, where "6 of 8" is the difference between a −8 and a −20 plus a forfeited baseline.
*AC:* AC-5.1 (card 4 minimal), AC-2.4, AC-9.3, AC-5.3b, and the numeric criterion in the v0.2 gate.

---

### Stage v0.3 — 카드 6장 + 환각 밑줄 · 검증 도구
*PRD "확인할 것": **5분에 끝나는가***

**S3.1a — Cards 3 and 4, full.**
Deliverables: `CARDS[2]` (경쟁사 뉴스 요약; **위험 요소 없음 → the C1 carve-out card**; the `"업계 관계자의 73%가..."` trap in the *answer*; the 전환점 card; the empty-key reveal line) and `CARDS[3]` (신제품 사양) promoted from S2.4. Applies the F1b 조사 rule and F1c's mandatory replacement-value slots from the first full card.
*AC:* AC-5.1, AC-5.3 (C1), AC-5.6, AC-5.9 (card 3), AC-5.10 (card 4's ≥2 decoys), AC-3.10, AC-2.4.

**S3.1b — Cards 5 and 6, full.**
Deliverables: `CARDS[4]` (지원자 서류 검토; **R = 9** as 3 entries × (`pii_name` + `pii_attr` ×2), **every one of the nine carrying an authored `>대체값`** — this is the card v4's undefined 익명화 derivation would have broken outright, since "서울시 강남구" has no ordinal alias; **no 요약-eligible unit**; 순위 근거 밑줄 → 자가검토; the `…외 9건` device) and `CARDS[5]` (계약 조항 확인; **R = 8** as a non-eligible 핵심 조항 unit (`biz_id` 거래처명 ×2 → 마스킹, `confidential_amount` 금액 ×2 → 익명화 **with authored replacements**) **plus two 요약-eligible 조항 units of 2 `confidential_doc` tokens each** — sized so that no single collapse reaches `need = 6` (R-m3 / clause F2); 지어낸 법 조항 in the answer).
> **Authoring note (round-5 merge) — card 6's 핵심 조항 must be authored as TWO 문단 units, not one.** As written above, that single unit mixes **two different masking-technique-required risk types** (`biz_id` → 마스킹, `confidential_amount` → 익명화) inside one bulk-selectable block. That is the one place in the game where the plan's own guarantee — *bulk selection is safe because a later selection does not destructively overwrite an earlier one on the same span* — is not obviously true, because both applications target the same 문단. Card 2's 참석자 문단 is homogeneous (all `pii_name` → 익명화) and therefore already safe by construction. **Author card 6's 핵심 조항 as two consecutive blocks — a 거래처명 block (`biz_id` ×2) and a 금액 block (`confidential_amount` ×2) — each 요약-ineligible, so `문단 전체 선택` addresses exactly one technique's tokens at a time.** This changes no rule, no risk-key size (R stays 8) and no clause-F3 result (2 < need = 6 either way); it only makes the bulk-select guarantee hold for card 6 the same way it already holds for card 2. Witness runs 14b and the v0.3 gate's three-application walk are unaffected: cleaning the 핵심 조항 still takes one 마스킹 and one 익명화 application.

Each tier-B card carries **exactly 5 candidate spans, exactly 2 genuine, resolved by two *different* tools** (AC-5.11).
*AC:* AC-5.1, AC-5.9, AC-5.11, AC-2.4, AC-2.4b, AC-9.3, AC-9.3b, AC-5.2b.

**S3.1c — Authored Korean copy set.**
Deliverables: every newly authored line, signed off by the content owner in the PRD's voice. The list is enumerated in **OQ-4**, now **18 items**.
*AC:* AC-5.8, AC-2.6, AC-8.2, AC-8.3, AC-8.3b, AC-3.11, AC-4.8, AC-4.8b, AC-4.12, AC-4.13, AC-5.2b, AC-5.12. *Blocked by:* **OQ-4**.

**S3.2 — M3 의심 구간 밑줄 + 확신 배지.**
Deliverables: `HALLU_TYPES` (20쪽 — OQ-3); the `!도구` / `?` annotation pipeline; `renderAnswerTokens()` with `data-act="toggleUnderline"`, **exposed on every card from the 전환점 onward including tier-A card 4** (AC-5.6); `renderBadge()`; the badge assignment table in comments adjacent to `CARDS` (AC-6.2); `gradeUnderlines()`; boot assertions for AC-5.9 and AC-5.10.
*AC:* AC-5.4, AC-5.6, AC-5.9, AC-5.10, AC-6.1, AC-6.2, AC-6.3, AC-6.4.

**S3.3 — M4 검증 도구 카드 + 2회 제한 + 지연 부메랑.**
Deliverables: `VERIFY_TOOLS` (22쪽) with §2.8's assignment; `state.turn.verifyUsed` with the `2/2` counter and disabled state; `resolveVerify(span, tool)` returning one of three outcomes — correct tool on a genuine span → reveal + `환각을 잡아냄 +5/+5` per span (AC-5.5); wrong tool on a genuine span → `−3`, no score, `"특별한 문제를 찾지 못했습니다"` (AC-5.5b); any tool on a decoy → `−3`, `"문제 없습니다"`; per-card reveal text (card 3: **"출처를 확인할 수 없습니다"**); **`검증 없이 답변 제출` firing only on a tier-B card sent with `verifyUsed === 0`** (AC-5.7); **AC-5.12's non-scoring ritual beat**; `queueBoomerang(SCORE.boomerangDelay)` / `dueBoomerangs()` / `flushPendingBoomerangs()` (R-e).
*AC:* AC-5.5, AC-5.5b, AC-5.7, AC-5.11, AC-5.12, AC-4.3, AC-4.4.

**S3.4 — 멈추기 확인창 (§9-1).**
Deliverables: `renderModal()` + `#modalRoot`; round-2-only gating; exact copy "이 내용, 밖에 나가도 괜찮은 걸까?" with `그냥 보내기` / `다시 보기`; the `다시 묻지 않기` checkbox gated on `state.turnIndex >= SCORE.checkboxTurnIndex`; Esc/Enter handling; `요청 거절` bypasses the modal; `다시 보기` → re-send does not re-award the baseline (AC-4.2c).
*AC:* AC-7.1, AC-7.2, AC-4.2c.

**S3.5 — 플랜 표시 + 숨겨진 설정 (§9-2).**
Deliverables: `.plan` badge reading `사용 중: 무료 플랜`; the ⚙ icon appearing at `turnIndex >= SCORE.gearTurnIndex`, derived from AC-7.4's three constraints **with the constraints written above it and asserted by `auditCardSet()` clause E**; the settings panel with `대화 내용을 학습에 사용` default ON; `보안 +10` once with its chip; `state.flags.learningOff`.
*AC:* AC-7.3, AC-7.4, AC-7.5, AC-4.7, AC-4.9.

**S3.6 — Mechanic gating, card-id decoupling sweep, the card-set audit, pacing instrumentation.**
Deliverables: the unlock-boundary ramp (AC-5.6); **a codebase sweep for any behavior keyed to a card id rather than a turn index**; **`auditCardSet()` implemented in full (clauses A, B, B2, C, D, E, F) and wired to `?debug=audit` and `?debug=1`** (§2.9.2, AC-1.10, AC-8.1b, AC-9.3, AC-9.3b, AC-9.5) — **this is the step that makes the plan's coverage claims, its necessity claim and its coverage-band claim machine-checked rather than asserted**, and the step whose v4 version was too narrow; `?debug=timing`; the `DEMO_MODE` flag trimming to cards **1, 3, 4, 6** with its source comment recording §2.7's accepted costs, AC-9.3b's exemption, **and that set's necessity margin (20) and one-card frontier (85)**.
> **Implementation note carried from §2.9.2:** clause B's enumeration domain must be written out as a comment above the function in the same words the plan uses, including the sentence explaining *why* enumerating grades enumerates every reachable score. The previous version's defect was not a coding error; it was an unwritten assumption about what the domain was.
*AC:* AC-1.10, AC-5.6, AC-8.1b, AC-9.1, AC-9.2, AC-9.3, AC-9.3b, AC-9.4, AC-9.5, AC-7.4.

---

### Stage v0.4 — 1회차 프롤로그 + 부메랑 연출
*PRD "확인할 것": **부메랑 순간에 소름이 돋는가 ← 최대 관문*** — the **core beat** was validated at v0.1.5; this gate tests **accumulation, pacing, and drag ergonomics**.

**S4.1 — Round 1 prologue, own renderer.**
Deliverables: `PHASES.R1_*` as `data-beat` states of **one persistent `.screen--r1`** (D1b) and `renderR1Turn()` — a **separate** renderer (D1a). No gauges, no toolbar, no send row, no modal. The coarse drag paste flow promoted from the spike, with AC-3.3b's **three-condition** watchdog; the 4-request sequence over cards 1–4; per-request praise copy.
*AC:* AC-3.1, AC-3.2, AC-3.3, AC-3.3b, AC-3.4, AC-1.7.

**S4.2 — 시간 경과 몽타주.**
Deliverables: `darken()` as a `data-beat` transition on the same screen; the montage surfacing cards 2 and 4's §6 1회차 결과 as short beats in the existing `.bubble` elements.
*AC:* AC-3.6, §11 9쪽 row.

**S4.3 — The two boomerangs + 파국.**
Deliverables: `replayDot()` pulling the card-1 dot back out of `#dotReservoir`; then the 환각 고리 — card 3's statistic rising into a news article which the AI then cites back; then **`bubbleFlood()`**; `silence()` throughout. All dwell times in `:root` constants.
*AC:* AC-3.5, AC-3.7, AC-3.9, AC-3.11, AC-1.3, AC-1.8(b).

**S4.4 — 정지 화면 + 회차 전환 + 점 배수.**
Deliverables: `freeze()` leaving exactly **"다시 해보시겠습니까?"**; `PHASES.INTERSTITIAL` establishing 「AI 안전 관제실」, **rendering `.screen-interstitial__dotzone` as its own `[data-region="dotzone-anchor"]` (E2b)**, running `drainDots()` as a visible ~2 s beat while retaining `state.log.round1Dots`, and revealing the toolbar, send row and gauges for the first time; `initRound(2)` over the same `CARDS`.
*AC:* AC-3.8, AC-3.12, AC-4.1, AC-3.10, E2b.

**S4.5 — Full-sequence credibility review + the 6-vs-4 card decision + threshold/θ tuning.**
Deliverables: ≥3 **fresh** testers (cohort 2 — R17), full 7-minute run; a written verdict on PRD §13's first open item; a **drag-ergonomics observation** (gate step 4); **the deferred 6-vs-4 card-count decision (OQ-11)**; and **the two tuning readings this plan defers to real play (OQ-5)** — the 보안 threshold, and whether R-g's "2개까지는 봐주고 3개부터는 그대로 처리" register lands as fair. **If the trim wins it changes `DEMO_MODE`'s status, not the card set's contents**, and **`auditCardSet()` must be re-run on whatever set is promoted (AC-9.5)**, with R15's sign-off rule governing whether a sub-6-card set may become the shipped default.
*AC:* AC-9.1, AC-9.2, AC-9.3, AC-9.3b, AC-9.5.

---

### Stage v1.0 — 엔딩 카드 + 프롬프트 복사
*PRD "확인할 것": **다 하고 나서 뭘 얻었다는 느낌이 드는가***

**S5.1 — 4분면 엔딩.**
Deliverables: `endingQuadrant(taskDisplayed, securityDisplayed)` against `SCORE.threshold` (`security: 60`, `taskPerCard: 10` → `10·N`, `≥` semantics — AC-8.1); `ENDINGS` with the four quadrants and their one-line comments; the conditional AC-7.6 line; AC-4.8's overcap and AC-4.8b's undercap lines; `flushPendingBoomerangs()` landing any unfired −25 with its own authored beat; **`.screen-ending__dotzone` (E2b)** so AC-4.11's three dot variants are readable at a glance here.
> **One-line hook for OQ-12(ii):** `endingQuadrant` takes the run summary, not just two numbers, so that adopting **R-h** later is a single added predicate rather than a refactor. A comment names R-h and points at OQ-12(ii).
*AC:* AC-8.1, AC-8.2, AC-7.6, AC-4.3, AC-4.8, AC-4.8b, AC-4.11, E2b.

**S5.2 — 내 직무 안전 카드.**
Deliverables: `rankMissedRisk()` over **round-2 log entries only**, with all **three** branches wired to their authored copy (AC-8.3); the single round-1 line (AC-8.3b); `ROLES = ['HR','PO','디자인','개발']` with a selector and per-role checklist copy (15쪽 — **OQ-8**); `buildSafetyCard()`.
*AC:* AC-8.3, AC-8.3b, §11 rows 15쪽 and 안전 3습관.

**S5.3 — 카드 이미지 저장 + 검증 프롬프트 복사.**
Deliverables: native `<canvas>` 2D render → `toDataURL('image/png')` → `<a download>`, with an explicit Korean font stack (`system-ui, 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif`) and a four-browser check that Korean glyphs render in the saved PNG (R13), with a `URL.createObjectURL(blob)` fallback; the opportunistic `navigator.share()` attempt (AC-8.4); the `복사하기` button with the `execCommand` fallback.
*AC:* AC-8.4, AC-8.5, AC-8.6, AC-8.7, §11 23쪽 row.

**S5.4 — 마감 연출 · 폴리시 · 원작 유사성 리뷰.**
Deliverables: the low-security ending reusing `bubbleFlood()`; title screen with 제목 + 슬로건; a consistent shape-language art pass; and the **originality review with concrete pass/fail criteria** (R11): a side-by-side screenshot comparison of five named surfaces against the reference game, passing only if **(a)** no palette hex value is shared, **(b)** character proportions differ measurably, **(c)** no copy phrase is reproduced. Written sign-off.
*AC:* AC-1.4, AC-1.3, AC-3.11 (reuse).

**S5.5 — §11 대응표 감사 + 최종 QA.**
Deliverables: a walkthrough of all 15 §11 rows against the shipped build, each marked 확인/미흡 **with the screen where it is observable and the step that implements it**. Plus: **`auditCardSet()`'s six clauses read and recorded for the shipped set** — clause B's necessity margin (AC-8.1b), **clause B2's one-card frontier**, clause C's technique necessity (AC-9.3), clause D's tool coverage with the named 자가검토 exemption (AC-9.3b), **clause F's coverage band**; a character-by-character diff of every PRD-verbatim string against §§6/8/9/10; **a read-through of every card's annotated source** against the F1b 조사 rule *and* F1c's authored replacement values and 요약 sentences, with four explicit questions:
  1. does the masked output read naturally in Korean (조사, spacing, 띄어쓰기)?
  2. **is every 가상데이터 and 익명화 replacement the same order of magnitude / the same kind of thing as the original?** — the `129,000만원 → 약 12억원대` class of check, which the boot assertion cannot make;
  3. does each summary sentence actually summarize its unit?
  4. is every 익명화 replacement *distinct* from every other on the same card (고객 A / B / C, not three identical stubs)?
Plus a four-browser `file://` smoke test; a zero-network verification; and the AC-1.3 warning-whitelist review.
*AC:* AC-1.1, AC-1.2, AC-1.3, AC-1.4, AC-1.10, AC-8.1b, AC-9.3, AC-9.3b, AC-9.5, plus the §1.5 table fully green (or explicitly 미흡 with named sign-offs per R15).

---

## 5. Risks and Mitigations

| # | Risk | Likelihood / Impact | Mitigation |
| --- | --- | --- | --- |
| R1 | **보안 게이지 산술이 PRD 안에서 모순된다.** | High / High | **Resolved** in §2.5 as G2 (earned gauge) with the 3-segment display, the baseline rule **R-f′**, both-axis arithmetic for fourteen reference runs, the R-a exclusivity rule, and the AC-4.7/4.8/4.8b/4.9/4.12 visibility fixes. Informs S1.2; **does not block it** — S0.2(B) Q1/Q6 ask the PRD author in parallel and the reversal costs are written down. |
| R2 | **드래그 선택 구현 비용.** | Low / Low | B3 confines drag to one ungraded gesture in round 1 (~40 lines of pointer code, no grading surface). Full drag-select for round 2 stays deferred and additive. |
| R2b | **1회차 드래그 자체의 조작감이 어디서도 검증되지 않는다.** | Medium / Medium | **v0.4 gate step 4** carries an explicit drag-ergonomics observation with a numeric criterion (≤1 abandoned drag across 3 testers × 4 drags). AC-3.3b gates the click fallback behind a failed, stalled **or 12-s-idle** attempt so the measurement is real **and no player can be stuck**. Remedy if it fails: widen the drop target, lengthen the drag-hint animation, shorten the idle timer — all CSS/constant-only. |
| R3 | **2회차 5분에 6장이 안 끝난다** — PRD §13's own open question. | High / Medium | `DEMO_MODE` trims to cards **1, 3, 4, 6** (AC-9.2, decided on eight criteria in §2.7). `?debug=timing` splits first-read from interaction time. **The 6-vs-4 decision is OQ-11, taken at the v0.4 gate.** Coverage deliverables ship unconditionally, and **AC-9.5 forces `auditCardSet()` to be re-run on any promoted set**, so a late trim can never *cause* a coverage, necessity or coverage-band failure silently. |
| R4 | **부메랑이 우연처럼 보인다** — PRD §13 item 1; §12's 최대 관문. | Medium / **Critical** | **Primary mitigation is scheduling:** the v0.1.5 spike gets the verdict at stage 2 of 6. Plus: dot identity (AC-3.9) structurally guaranteed across phase transitions, anchorless screens and node-recreating transitions (E2a/E2b/E2c, I-4); all dwell times are `:root` constants; the 파국 visual dresses the beat; round 1 plants cards 2 and 4 so the payoff reads as a pattern. Three tester cohorts budgeted (R17). |
| R5 | **모바일/터치 대응** — PRD §13 item 3. | Medium / Low | Click-toggle is touch-native; S2.3 adds stacked panes, the line-per-clause phone layout and 44px targets; AC-2.5's **split** touch targeting keeps page scrolling alive over tokens while protecting the one real drag; `마지막 동작 취소` recovers mis-taps. **Honestly narrowed, not retired:** scroll depth on a 200-token card at phone width remains a known cost. Scope: phone/tablet **playable**, desktop **designed**. |
| R6 | **단일 파일 길이.** | Low / Medium | Decision F cuts card data from ~2,000 lines to ~200. Revised total estimate **2,200–2,700 lines** (v5 adds ~29 inline replacement values, the coverage arithmetic, the third dot variant and clauses B2/F of the enumerator), content ~16% of bulk, behind fixed section banners. |
| R7 | **재렌더·화면 전환이 진행 중인 애니메이션과 누적 점을 끊는다.** | Medium / **High** | Decision E: `#dotReservoir` lives **outside `#app`**, is transform-anchored, **hides cleanly on anchorless screens (E2a)**, has **named anchors on every screen an AC needs dots on (E2b)**, and its observer is **re-bound to the current anchor node on every render and phase change (E2c)**. Enforced at runtime by `region()`, the `?debug=1` MutationObserver and the **I-4 identity assert**, and verified by cycling `goPhase()` **and by visiting TITLE**. |
| R8 | **`file://`에서 클립보드 API가 막힌다.** | Medium / Medium | AC-8.6's `execCommand('copy')` fallback, verified in four browsers from disk; the four lines are always selectable text. |
| R9 | **5대 위험 신호 / 환각 5대 위험지점 / 직무별 / Before-After 자료가 리포에 없다** (13·15·16·20쪽). | High / Medium | **S0.2(A)** requires the PRD author to supply the real slide content **before S3.1a begins**. If the deadline passes, proposed taxonomies ship behind an in-source `// ASSUMPTION — 자료 미확인` banner, and the v1.0 gate carries a sign-off line. See OQ-2, OQ-3, OQ-8. |
| R10 | **엔딩 4분면 경계값이 명시되지 않았다.** | High / Low | **OQ-5 / OQ-12**: `security: 60`, `taskPerCard: 10`, `≥` semantics (AC-8.1). AC-4.5's fourteen runs confirm all four quadrants reachable at N=6; the v0.3 gate confirms N=4. **The threshold is constrained from below by AC-8.1b's necessity property**, and `auditCardSet()` clauses B and B2 recompute the admissible region and the disclosed one-card frontier from the shipped content, so a tuning change that reopens the thesis hole — or that silently changes what one masked card buys — fails loudly. |
| R11 | **원작과의 유사성 수위** — PRD §13 item 5. | Low / Medium | S5.4's review has concrete pass/fail criteria: five named surfaces; pass requires no shared palette hex, measurably different character proportions, and no reproduced copy phrase. Written sign-off. |
| R12 | **문구 의역 사고.** | Medium / High | Every verbatim line lives in `COPY` as one string constant, is quoted in the ACs, and S5.5 diffs them character by character against §§6/8/9/10. |
| R13 | **저장·폰트 브라우저 편차.** | Medium / Medium | S5.3 specifies an explicit Korean font stack and a four-browser check that the **saved PNG** renders Korean correctly; a `URL.createObjectURL(blob)` fallback; the card always stays on screen. |
| R14 | **WebAudio 자동재생 정책.** | Medium / Low | `AudioContext` created lazily on the first user gesture; `clickSound()` is a no-op while suspended. No audio is load-bearing: the boomerang is silent by design (AC-3.7). |
| R15 | **콘텐츠 작성 물량.** Authoring 6 cards — ~200 source tokens each in ≤6 문단, a pinned risk-key size with bounded per-문단 concentration (F1e), **an authored replacement value for every 익명화 AND every 가상데이터 token (~29, R-r1)**, an authored canonical summary sentence per 요약-eligible unit, an answer with exactly 5 candidates of which exactly 2 are genuine and resolved by two different tools, a badge and a feedback line — plus the full OQ-4 copy set, is the **single largest work item in the build**. | High / High | Split into **S3.1a / S3.1b / S3.1c** with a named content owner. Estimate: **3–3.5 person-days of Korean writing** (raised from v4's 2.5–3 because v4 assumed 익명화 replacements were derived by a function that turned out not to exist), tracked separately from coding time. **Shortfall ladder, in order:** ① ship **6 cards** with the two weakest at reduced source length rather than dropping any — **but not below F1e's pinned risk-key sizes, because R is the coverage denominator** (a card trimmed to R = 4 would make `need = 3`, and two clicks would buy a baseline again); **§11 stays 15/15.** ② ship **5 cards `{1,2,3,4,6}`** — keeps all four masking techniques, both boomerang owners, the 전환점 and the 최종 관문, but **drops card 5, which is 자가검토's only home**, so **§11 rows 11 AND 14 both go 미흡 → 13/15**, each with a named PRD-author sign-off, and AC-9.3b's exemption is invoked. ③ only then the 4-card `DEMO_MODE` set as default — **likewise 13/15**. **Explicit rule: any set of fewer than 6 cards fails BOTH rows, the v1.0 audit records 13/15 with two named sign-offs, and `auditCardSet()` must pass clauses B, C and F on the promoted set (AC-9.5) or the rung is not available at all.** **Documentation note (round-5 merge, not a rule change):** dropping to the 5-card or 4-card configuration also breaks the **literal reproducibility of one PRD reference number** — §5's 설계 의도 outcome **「전부 그대로 → 업무 90」** reproduces exactly only at the full **6-card** count (6 × 15 = 90); it scales down proportionally to **75 at N = 5** and **60 at N = 4**. The *property* the PRD is asserting (전부 그대로 maxes the 업무 axis and destroys the 보안 axis) still holds at every card count, and AC-9.4 already scales `taskPerCard` so the quadrant classification is unaffected — but anyone checking the build against the PRD's printed figure at a trimmed card count will see a different number, and should be told so rather than filing it as a defect. Record it alongside the two §11 sign-offs. |
| R16 | **인식 비트가 안 살아난다.** | Medium / High | One `answer` record per card, consumed by both rounds; round-2 text is **byte-identical** (AC-3.10). Enforced structurally: there is no second answer string to diverge. |
| R17 | **v0.4 관문 실패 시 복구 경로가 없다.** | Medium / High | **(a)** The v0.1.5 spike means a v0.4 failure is almost certainly an *accumulation/pacing* failure. **(b)** A ranked remedy ladder: ① re-time the `:root` constants; ② add or cut montage beats; ③ move the headline boomerang earlier; ④ (last resort) restructure round 1's request count. **(c)** **Three tester cohorts of 3.** **Owner: the project lead**, who confirms all three cohorts by name at the same time S0.2 is sent. |
| R18 | **§10's "공유 가능하게" is not implementable on `file://`.** | Certain / Low | Stated as an explicit scope reduction in AC-8.4. Flagged to the PRD author rather than silently dropped. |
| R19 | **검증-측 규칙이 PRD에 없는 해석 위에 서 있다.** | Medium / High | Stated as assumptions (AC-5.7, **OQ-10**), routed as **S0.2(B) Q2** with **run 10** as the concrete discriminator. **AC-5.12's non-scoring ritual beat ships regardless.** The code change to switch readings is one predicate. |
| **R20** | **기획의 핵심 주장이 규칙 위에서 거짓일 수 있다 — 그리고 고친 자리에서 다시 열릴 수 있다.** *(rewritten in v5, because this risk has now materialized twice.)* PRD line 146 / overview.md line 51 assert that masking is the *only* path to both gauges. Under v3's rules it was false at **zero** masking. Under v4's rules — after a fix, an enumeration and a machine audit — it was false again at **one click**, because the fix keyed off a coverage-blind predicate. | Medium / **Critical** | **(a)** The claim is a normative property (**AC-8.1b**), now quantified over the **sub-θ** space rather than the zero-masking point. **(b)** It is closed at the **grade boundary** (**R-g**, §2.6.3), not at the reward, so every rule that keys off `raw` inherits the correction at once (Principle 8). **(c)** Discharged by exhaustive enumeration at every shippable N over **both** frontiers, with margins 29 / 10 / 20 and an explicit adversarial sweep (§2.6.6). **(d)** `auditCardSet()` clause B's **enumeration domain is now written out in full**, with the reason grade-enumeration is complete, and clause B2 records the disclosed boundary so it cannot drift silently. **(e)** **AC-4.5 rows 8 and 12** are the two human-readable regression rows; **row 13 = row 2** is the digit-level assertion. **(f)** The residual judgment — whether one masked card should suffice — is routed as **OQ-12(ii)** with correct numbers and **three** concrete closure options (α the structural rule R-h, β a score-based 보안 69 at the default N = 6 alone, γ a per-card-count threshold triple). **(f2)** *(round-5 merge)* The routed packet carries the **cheapest** members of the disclosed class, not only its maximum: **run 14a (72 / 67 at N = 6, reached with just TWO bulk tool applications — `문단 전체 선택` + `익명화` on card 2's 5-name 참석자 문단, then one `요약` collapse)** and **run 14b (72 / 60, exactly on the shipped threshold, three applications on card 6)**, alongside run 14 (72 / 68, four applications). A human deciding whether to close this gap must see how cheap the cheapest route is; the class maximum alone understates it. **(f3)** *(round-5 merge)* The supporting claim is stated precisely rather than absolutely: **flat** threshold closure is impossible at N = 5 (the 90 frontier sits above a minimally-verifying careful player at 88), but a **per-card-count-scaled** threshold of ≈91 at N = 5 *would* separate them while admitting a maximally-verifying careful player at ≈98 — at the cost of the flat-threshold design and of raising the verification bar. Neither the rules nor the constants change; only the accuracy of the disclosure does. **(g)** §2.6.6 records **R-f″ as tried and falsified**, so the next iteration does not re-propose a reward-side patch. |
| **R21** | **마스킹 대체 문구를 아무도 쓰지 않은 채 v1.0에 도달한다.** The Korean strings the techniques need have twice been assumed to exist somewhere they did not — v3 had no home for 가상데이터/요약 text at all, and v4 routed 익명화 through a derived function whose 직책 branch referenced a map that was never defined. | Medium / High | **(a)** F1c puts all of them inline in the annotation grammar, so they are *derived from the source* and AC-1.6 stays intact. **(b)** **R-r1 makes the `>대체값` slot mandatory for every 익명화- and 가상데이터-neutralized type**, and `tokenize()` **throws at boot** if one is missing — the omission cannot reach a playable build. **(c)** The derived `anonymize.transform` and the 직책 map are **deleted outright**; AC-1.6 now greps for them explicitly. **(d)** OQ-4 items 13–14 carry owning steps and render locations; R15 is raised to 3–3.5 person-days. **(e)** S5.5 adds four *qualitative* read-through questions, including an **order-of-magnitude check**, because a present-but-wrong replacement (v4's `129,000만원 → 약 10만원대 후반`, off by 10⁴) is a content failure no boot assertion can see. |
| **R22** | ***(new in v5)* 커버리지 분모가 조용히 바뀐다.** Under R-g every grade boundary on a card is a function of that card's `riskKeySize`. A content edit that adds two risk tokens to card 4, merges card 1's three 문의 entries into one 문단, or splits card 6's 요약 units differently changes `need`, changes how many misses are forgiven, and can make a single bulk gesture worth a baseline again — **with every reference run in this plan still passing**, because the reference runs are defined by grades. | Medium / **High** | **(a)** F1e pins every card's risk-key size, per-문단 concentration and per-unit concentration as **authoring constraints**, printed in a comment table next to `CARDS`. **(b)** **`auditCardSet()` clause F** checks all four sub-conditions at boot and throws naming the card and the failing sub-clause — F1 (both grades reachable), F2 (요약 unit < need), F3 (문단 bulk < need), F4 (θ inside its plateau). **(c)** **AC-9.5 adds "re-authoring a card's risk key" to the list of changes that force a full re-audit.** (d) R15's shortfall rung ① is explicitly forbidden from trimming a card below its pinned R. (e) The v0.2 gate plays card 2's 5-name 문단 bulk application by hand (step 4d) — the clause-F3 binding case — so a human has seen the tightest constraint at least once. |

---

## 6. Open Questions

Blocking or shaping items. **Every item below has an owner, a channel and a deadline**, and every one is routed through **S0.2**. Nothing is left as a bare unrouted question.

**OQ-1 — 보안/업무 게이지 의미론. RESOLVED as G2 (earned gauge with distributed baseline) + the 3-segment display.** Argued in DELIBERATE form in §2.5 with two options, both-axis arithmetic for fourteen reference runs and a 3-scenario pre-mortem. Routed as **S0.2(B) Q1**, non-blocking; the reversal cost is a display-layer change for any run containing no raw send. Proceeding on G2. *Owner:* PRD author. *Deadline:* none (non-blocking).

**OQ-2 — 5대 위험 신호 (자료 13쪽)의 정확한 5개 항목.** Not enumerated in the PRD. Proposed, derived bottom-up from the six cards' own 위험 요소 lists: ① 개인 식별 정보 ② 고객·거래처 식별 정보 ③ 미공개 사내 정보 ④ **인사·평가 정보** ⑤ 계약·기밀 문서. §2.9.1's map implements all five. **Marked ASSUMPTION.** *Owner:* PRD author via **S0.2(A)**. *Deadline:* before S3.1a. *Why it matters:* M1's answer key, the ending card's taxonomy, the technique-coverage guarantee — **and now also R-g's denominator**, since the risk key is what coverage is measured against.

**OQ-3 — 환각 5대 위험지점 (자료 20쪽)의 정확한 5개 항목.** Not enumerated. §4 names three (수치·출처·고유명사); the cards imply two more. Proposed: ① 수치·통계 ② 출처·인용 ③ 고유명사 ④ 법·규정 조항 ⑤ 인과·단정 판단. **Marked ASSUMPTION.** *Owner:* PRD author via **S0.2(A)**. *Deadline:* before S3.1a.

**OQ-4 — 새로 작성해야 하는 한국어 문구 일체.** The PRD authors none of these. **Items 13 and 18 changed in v5; the total is 18.**

| # | Item | Required by | Owning step |
| --- | --- | --- | --- |
| 1 | The three non-`안전한 무능` quadrant comments | AC-8.2 | S3.1c |
| 2 | Feedback lines for cards 3, 4, 5, 6 | AC-5.8 | S3.1c |
| 3 | The `요청 거절` feedback line | AC-2.6 | S3.1c |
| 4 | The AC-4.8 overcap acknowledgment line | AC-4.8 | S3.1c |
| 5 | Round-1 per-request praise copy | AC-3.4 | S3.1c |
| 6 | The **파국 flood sentences** — ≈4–6 short AI-voice lines | AC-3.11 | S3.1c |
| 7 | Gauge segment labels `남은 안전 예산` / `잃은 안전` + the overdraft marker form | AC-4.11b | S3.1c |
| 8 | The AC-4.8b **undercap** line | AC-4.8b | S3.1c |
| 9 | The two zero-miss safety-card fallback lines | AC-8.3 | S3.1c |
| 10 | The round-1 line on the safety card | AC-8.3b | S3.1c |
| 11 | Card 3's empty-risk-key reveal line | AC-5.6 | S3.1c |
| 12 | The masking editor's refusal messages — **four**: 요약's three (no eligible unit touched / spans two units / 1:1 tool on an already-collapsed index) plus **R-c4's "이 도구로는 이 부분을 바꿀 수 없습니다" for a 1:1 tool with no substitutable value** | AC-5.2b, R-c3, **R-c4** | S3.1c |
| 13 | **(expanded in v5)** **Inline replacement values — ~29 total: one per 익명화-neutralized token (19: `pii_name` on cards 1/2/5, `pii_attr` on card 5, `confidential_amount` on card 6) and one per 가상데이터-neutralized token (10: cards 2, 4)**, rendered inline in the masked prompt | **AC-5.2, F1c R-r1**; boot-asserted by `tokenize()` | **S3.1a / S3.1b** |
| 14 | **요약 canonical summary sentences** — exactly one per `@@ summarize>`-declared unit (~5–7, cards 2/6) | **AC-5.2b, F1c, R-m2**; boot-asserted | **S3.1a / S3.1b** |
| 15 | The **raw-forfeit beat** line ("이번 턴에는 지킨 게 없습니다" 계열) | AC-4.12 | S3.1c |
| 16 | The **deferred-penalty flush beat** copy at the ending transition | AC-4.3, R-e | S3.1c |
| 17 | The **ritual-verification beat** — tools spent, nothing real found | AC-5.12 | S3.1c |
| 18 | **(new in v5)** The **sub-θ raw feedback line** — a player who masked *something* and still graded 그대로 처리 must be told how many risk tokens were left exposed and why that counts as 그대로 처리 (e.g. "3곳이 그대로 나갔습니다. 이 정도면 안 가린 것과 같습니다.") | **AC-4.13, R-g** | S3.1c |

All require content sign-off in the PRD's voice. **Items 13 and 14 are the ones a boot assertion catches if *missing* but cannot catch if *bad*** — S5.5 adds the four-question read-through, including the order-of-magnitude check. *Owner:* content owner. *Deadline:* S3.1a/b for items 13–14, S3.1c for the rest.

**OQ-5 — 4분면 경계값과 R-g의 θ, 실플레이 튜닝.** Two numbers are set by this plan and re-read against real play at the v0.4 gate:
  - **`SCORE.threshold = { security: 60, taskPerCard: 10 }`** with `≥` semantics. **Two-sided:** bounded *below* by AC-8.1b's necessity property (clause B computes the admissible region; at 60 the margins are 29 / 10 / 20 for N = 6 / 5 / 4) and *above* by keeping `AI 네이티브` attainable. **Discriminators: run 6 (96/75), run 6 + ⚙ (96/85), and the one-card class — run 14a (72/67), run 14b (72/60) and run 14 (72/68).** Note that a threshold of **69** would exclude the entire one-card class at N = 6 while still admitting run 6; that is option (β) of OQ-12(ii), and it is reachable purely by moving this constant.
  - **`SCORE.maskCoverageThreshold = 0.7`.** **This is a Planner decision, not a PRD-author question** — it is derived in §2.6.3 from the shipped content's own structure, sits on a plateau `(0.667, 0.75]` where no grade changes, and is asserted at boot (clause F4). It is listed here because it is a **tunable default whose *register* deserves a playtest reading**, phrased for a human as: *"2개까지 놓친 건 「일부 놓침」, 3개부터 「그대로 처리」 — 이 정도가 맞나?"* Moving it outside the plateau is a content-and-audit change, not a tuning tweak, and clause F4 enforces that.
  *Owner:* v0.4 gate (both), PRD author for the threshold's product half. *Deadline:* v0.4.

**OQ-6 — 회차별 카드 순서 확정.** §6 marks cards 1–4 ★1회차 등장 and 5–6 ★2회차 신규; §4 puts M3/M4 in the harder tier. Round-2 order 1→2→3→4→5→6 satisfies the difficulty ramp, the recognition beat, and the 전환점 unlock at position 3 that AC-5.6's exposure model depends on. **Routed as S0.2(B) Q4.** *Owner:* PRD author. *Deadline:* none (non-blocking); the working assumption ships.

**OQ-7 — 라운드 1 요청 순서와 부메랑 소유권.** §4 names the two boomerangs as cards 1 and 3; cards 2 and 4 have their own §6 1회차 결과 and are staged as supporting montage beats (AC-3.6). **Routed as S0.2(B) Q5.** *Owner:* PRD author. *Deadline:* none (non-blocking).

**OQ-8 — 자료 15쪽 (직무별 조심할 것) · 16쪽 (Before/After 프롬프트) 원문.** Neither is in this repo, and §11 rows 9 and 10 depend on them. Needed: the four role checklists (HR/PO/디자인/개발) and the Before/After framing that cards 3–6's feedback lines should echo. *Owner:* PRD author via **S0.2(A)**. *Deadline:* before S3.1a.

**OQ-9 — 보조 장치 트리거 시점.** PRD §9 says the ⚙ appears "2회차 중반" and the 다시 묻지 않기 checkbox is available "3장째부터". Read as **0-based turn indices** — checkbox at `turnIndex >= 2`; ⚙ derived from AC-7.4's three constraints (`N ≥ 5 → 3`, `N = 4 → 1`). **Routed as S0.2(B) Q3.** *Owner:* PRD author. *Deadline:* none (non-blocking).

**OQ-10 — "검증 없이 답변 제출"의 정확한 발동 조건.** Read as **(a)**, with the tier-B narrowing also supplied. Argued in §2.6.1, priced in AC-4.5 rows 3/5/6/10, risk-tracked as R19, **routed as S0.2(B) Q2 with reading (a′) evaluated explicitly and declined on a stated arithmetic basis**. **Run 10 is the discriminator row.** *Owner:* PRD author. *Deadline:* none (non-blocking); AC-5.12's non-scoring beat ships either way.

**OQ-11 — 2회차 카드 6장 vs 4장.** PRD §13's own second open question. **Decided at the v0.4 gate (step 11)**, not v0.3, because 4 of the 6 documents are pre-read in round 1 and cold-read timing at v0.3 is unrepresentative; `?debug=timing`'s first-read/interaction split is the evidence. **A trim changes DEMO_MODE's prominence, not coverage** — but promoting any sub-6-card set to the shipped default invokes **R15's sign-off rule** (rows 11 *and* 14 미흡 → 13/15) and **requires `auditCardSet()` to pass clauses B, C and F on the promoted set (AC-9.5)**. Note the trim also raises the per-turn baseline to 25 and therefore moves both frontiers (40 and 85 at N = 4), which the audit re-reports. *Owner:* v0.4 gate; PRD author for the default-change sign-off. *Deadline:* v0.4.

**OQ-12 — 기획 핵심 주장의 성립 조건.** Two parts, both routed as **S0.2(B) Q6**, non-blocking.
  - **(i) The closure mechanism — RESOLVED by the Planner, stated for ratification.** PRD line 146 is enforced by **R-f′** (a raw send forfeits its baseline) plus **R-g** (a send is `raw` below θ = 0.7 coverage). Neither touches a §5 value; all three 설계 의도 outcomes reproduce exactly; the alternatives were enumerated rather than guessed, including the two that were *tried and falsified* (threshold-only closure, and the proportional-forfeiture variant R-f″). The one alternative the Planner cannot take is giving **거절** a 보안 cost, which breaks 전부 거절 → 보안 100, a PRD literal. *Reversal cost:* one conditional plus recomputation of AC-4.5 rows 2/7/8/9/11/12/13.
  - **(ii) The one genuinely open judgment — 한 장만 제대로 가린 런을 인정할 것인가.** AC-8.1b guarantees that a run with no meaningful masking anywhere cannot reach `AI 네이티브`. It does **not** exclude the one-card class, whose three worked members are **run 14a (72 / 67, two bulk tool applications on card 2 — the cheapest known route)**, **run 14b (72 / 60, three applications on card 6, exactly on the threshold)** and **run 14 (72 / 68, four applications, the class maximum)** — each masking one card, rejecting two requests and **sending two documents wholesale**. Excluding the class needs 보안 ≥ **69 / 91 / 86** at N = 6 / 5 / 4, and **at N = 5 no single FLAT threshold (one number reused at every card count) can do it**, because the one-card frontier (90) sits above a careful-but-imperfect player who verifies minimally (88). The reason is a PRD literal: §5 prices 거절 at 0 and 일부 놓침 at −8, so rejecting scores better on 보안 than masking imperfectly. **Three closures exist, none of them the Planner's to take:** **(α)** the structural rule **R-h** — *"any run containing ≥1 raw send is ineligible for `AI 네이티브`"*, one predicate in `endingQuadrant` (hooked at S5.1), **the only one that holds identically at every card count**, but it makes a single unmasked send permanently disqualifying and contradicts §5's forgiving register and this plan's 구원 framing; **(β)** a **purely score-based** closure at the shipped default N = 6 alone — a flat 보안 threshold of **69** excludes all three runs while still admitting the careful-but-imperfect run (75 / 85), with no new rule at all, but it does not generalize to N = 5 and narrows the band for careful players too; **(γ)** a **per-card-count threshold triple** (`{6: 69, 5: 91, 4: 86}`), which closes it everywhere but abandons the flat-threshold design and effectively demands near-maximal verification (≈98) at N = 5. **Several defensible answers; a product decision.** Proceeding **without R-h** at a flat threshold 60, with clause B2 recording the frontier on every audit load.
    > *Correction carried forward:* v4 posed this question against a "보안 ≥ 86" figure. That figure was wrong under v4's own rules — the minimal-masking frontier reached displayed **100**, so no threshold closed anything. The numbers here are recomputed under R-g and are the ones to answer against.
  *Owner:* PRD author. *Deadline:* none for (i); v0.4 for (ii), alongside OQ-5.

### Decisions taken in v5 (recorded so reviewers can challenge them as decisions, not discover them as gaps)

| # | Question | Decision | Where |
| --- | --- | --- | --- |
| 1 | Are M1 (marking) and M2 (masking) the same state? | **Same state.** `state.turn.marked`; M1 has no independent score; `gradeMasking` is the sole prompt-side grader. | AC-5.1 |
| 2 | What does the wrong **mask** tool cost? | Nothing new in §5. A non-neutralizing transform leaves the token 미가림 and therefore lowers coverage. | AC-4.10, §2.6.2 |
| 2b | What does the wrong **verification** tool cost? | `업무 −3`, no catch, span stays uncaught, a non-committal result distinct from a decoy's; no new §5 row. | AC-5.5b |
| 3 | Do round-1 dots persist into round 2? | **No** — drained in a visible ~2 s beat at the interstitial; the count is retained and surfaced as one ending line. | E1a, E2b, AC-3.12, AC-8.3b |
| 3b | Do round-2 sends accumulate dots, and how are they styled? | **Yes** — every send adds one; 거절 adds none. **(v5)** **Three variants keyed on the grade**: hollow = `clean`, half = `partial`, solid = `raw` or an untouched C1 clean. | AC-4.11, E1b |
| 4 | Does round 2 have its own leak boomerang? | **No, deliberately.** Raw paste in round 2 is punished immediately (−20 **and the forfeited baseline**) and narratively via a feedback line referencing round 1. | §1.1, AC-4.3, AC-4.12 |
| 5 | Is card 3's round-2 answer the same text as round 1's? | **Byte-identical**, structurally enforced by a single `answer` record. | AC-3.10, R16 |
| 6 | When does a pending −25 land, and where if there is no later turn? | `SCORE.boomerangDelay = 2`; otherwise flushed into the ending transition with its own beat. | R-e, AC-4.3 |
| 7 | Is §4's "4 mechanisms in difficulty order" literally implementable? | **No** — it is **one unlock boundary plus two content tiers**, deliberately non-aligned. | §1.3, AC-5.6 |
| 8 | How is "공유 가능하게" handled on `file://`? | Scoped out explicitly; save-as-image only; opportunistic `navigator.share()`. | AC-8.4, R18 |
| 9 | Does a card with an **empty** risk key expose the masking editor? | **Yes.** Grading is pre-resolved to `clean` by C1 and explained by a dedicated reveal line. | AC-5.6, §2.6.2 |
| 10 | Does round 1 feed the ending's "가장 자주 놓친 것"? | **No.** Round-2 entries only; round 1 contributes one separate non-personalized line. | AC-8.3, AC-8.3b |
| 11 | Which DEMO_MODE card set, and why? | **`{1,3,4,6}`**, on eight criteria, with accepted costs — **and now its own necessity margin (20) and one-card frontier (85)** — in a source comment. | §2.7, AC-9.2 |
| 12 | Where does 원문대조 get used? | As the `resolvedBy` tool of the **second** genuine span on each of cards 3, 5 and 6. | §2.8, AC-5.11 |
| 13 | How is 요약 represented, and at what granularity? | As a **collapse of exactly one authored `@@ summarize>` unit** inside an original-index-keyed overlay. **(v5)** And its risk-token count is **bounded below `need`** (R-m3). | F1a, R-m2, R-m3, AC-5.2b |
| 13b | Does 요약 neutralize a risk type not in its `neutralizedBy` list? | **Yes — unconditionally (leakage model).** Bounded by authored applicability, not by the grader. | R-n1, §2.9.1 |
| 13c | What happens when one card needs two techniques at once? | **It never does.** Disjoint-unit authoring, one technique per unit. | R-c1/2/3, **R-c4**, AC-2.4b |
| 13d | Where does the replacement TEXT live? | **Inline in the annotation grammar.** **(v5)** And it is **mandatory for 익명화 as well as 가상데이터** (R-r1); only 마스킹 is derived (R-r2). | F1c, AC-1.6, OQ-4 item 13 |
| 14 | Where do Korean 조사 sit relative to annotation brackets? | **Outside**, with a stated exception expressible via the `>` slot. | F1b |
| 15 | Can a content shortfall change the shipped default card set? | **Only under named PRD-author sign-offs**, recording **§11 rows 11 AND 14 as 미흡 (13/15)**, and only if the promoted set passes clauses B, C and F. | R15, AC-9.3b, AC-9.5 |
| 16 | Is the PRD's central thesis a claim or a rule? | **A rule** (**AC-8.1b**), discharged by exhaustive enumeration at every shippable N. **(v5)** Quantified over the **sub-θ** space, not the zero-masking point. | AC-8.1b, §2.6.6 |
| 17 | Is `AC-9.3`'s coverage guarantee checked by walkthrough? | **No — by non-existence check** (clause C). **(v5)** And it is explicitly a claim about *clean* play, not about every `partial`. | AC-9.3, §2.9.1 |
| 18 | Does the verification toolbar's presence reveal that a card is fabricated? | **No.** Exposure follows the unlock boundary; tier follows content; card 4 sits after the unlock with nothing genuine to find. | §2.9.3, AC-5.6 |
| **19** | **(v5) Where is the line between 「가리다 일부 놓침」 and 「그대로 처리」?** | **A coverage test at θ = 0.7 (R-g)**, derived from the content's own structure (plateau `(0.667, 0.75]`), not an existence test. In shipped terms: **놓친 게 2개까지면 일부 놓침, 3개부터는 그대로 처리.** A Planner engineering decision, boot-asserted (clause F4), playtest-ratifiable at v0.4. | **§2.6.3**, AC-5.3, AC-5.3b, OQ-5 |
| **20** | **(v5) Why fix the boundary rather than re-tune the forfeiture?** | **Principle 8.** A reward keyed off a predicate can never out-discriminate that predicate. The proportional variant **R-f″ was tried and falsified** — it buys zero closure, because the exploit's maximum fully masks the one card it touches. | **Principle 8**, §2.6.6 option (vi) |
| **21** | **(v5) Is the risk-key size content or structure?** | **Both, and therefore pinned.** Under R-g it is the coverage denominator, so F1e fixes every card's `R` and its per-문단 / per-unit concentration as authoring constraints, boot-checked by clause F, with R22 tracking the drift risk. | **F1e**, AC-2.4b, clause F, R22 |
| **22** | **(v5) Is the one-card class (한 장만 제대로) acceptable?** | **Disclosed, not hidden, and not decided by the Planner.** It is three reference rows — **14a (72/67, two tool applications, the cheapest route), 14b (72/60, exactly on the threshold) and 14 (72/68, the class maximum)** — a machine-recorded frontier (clause B2), and a routed question carrying **three** concrete closure options (α R-h, β 보안 69 at N = 6 only, γ a per-card-count triple). | **Runs 14a/14b/14**, clause B2, OQ-12(ii) |

---

## 7. Verification Steps

No test framework exists and none may be added (D3). Verification is **manual playthrough per stage**, mapped onto the PRD §12 "확인할 것" column, plus the in-file boot audits that exist precisely because the plan's hardest claims cannot be verified by playing. Each stage gate is a go/no-go.

### Standing checks (every stage)

- **V-0.1** Open `index.html` from `file://` (double-click, not a server). Game loads and is playable.
- **V-0.2** DevTools → Network: hard reload shows **0** requests.
- **V-0.3** DevTools → Console: zero errors; zero warnings outside the AC-1.3 whitelist.
- **V-0.4** `Ctrl+F` the source for `cdn` / `unpkg` / `jsdelivr` / `googleapis` / `type="module"` / `fetch(` — zero hits.
- **V-0.5** No §5 delta, threshold, `boomerangDelay`, trigger index **or coverage threshold** appears as a bare numeral inside `applyScore`, any grader, or any render path (AC-1.5). Specifically: `0.7` does not occur inside `gradeMasking` — only `SCORE.maskCoverageThreshold` does.
- **V-0.6** No index-array literal, no `replacements` key **and no 직책/title map** inside `CARDS` (AC-1.6); no `round === 1` branch inside the round-2 render/grade path (AC-1.7).
- **V-0.7** `tokenize(` appears only under the `7. BOOT` banner (AC-1.6b). `.innerHTML =` / `.textContent =` appear only on `region(...)` results or on locally-constructed detached nodes (I-1).
- **V-0.8** In `?debug=1`, **cycle `goPhase()` through every `PHASES` value 5×** and confirm `#dotReservoir`, `#fxLayer` and `#modalRoot` are never removed, that the reservoir stays visually anchored on every phase that has an anchor, **that on TITLE it is `hidden` rather than thrown or cleared and its dot count is preserved (E2a)**, and that the **I-4 observer-identity assert never fires**.
- **V-0.9** *(widened in v5)* Load `?debug=audit` and read `auditCardSet()`'s **six** clauses for the active set. **Clause B's necessity margin must be positive and must match §2.6.6's Frontier tables for the active N; clause B2's one-card value must match the declared constant; clause F must pass all four sub-conditions.** Any thrown clause is a blocking defect, not a tuning note (AC-1.10, AC-8.1b, AC-9.3, AC-9.3b, AC-9.5).
- **V-0.10** *(new in v5)* In `?debug=score`, every send prints `n/R` and its resulting grade. Spot-check one send per stage against AC-5.3b's transition table. *This standing check exists because the defect that survived round 4 was invisible in every total and visible only in the per-send grade.*

### v0.1 gate — **"게이지 규칙이 재미있는가"**

1. Play card 1 **five** times, once per path: 그대로 처리 (0/8) / 거절 / 가려서 처리 clean (8/8) / 가리다 일부 놓침 (7/8) / **흉내만 가리기 (5/8)**.
2. **Internal check.** With `?debug=score`, confirm `state.scores` moved by exactly the §5 deltas — `업무+15 / 보안−20`, `업무0 / 보안0`, `업무+15 / 보안+0`, `업무+15 / 보안−8`, **and `업무+15 / 보안−20` for the 5/8 path** — and that the `baselineAward(k,6)` of **17** was granted on the 거절, clean and partial turns and **NOT** on either the 0/8 or the 5/8 turn, with the ledger's `forfeited` marker set for both (AC-4.2c, R-f′ ∘ R-g). Then use `다시 보기` and re-send, and confirm the baseline is resolved **once**, against the outcome that actually completed the turn.
3. **The coverage boundary, walked token by token (AC-5.3b).** On card 1 (R = 8, `need` = 6), mask **1, 2, 3, 4, 5, 6, 7 and 8** tokens in eight successive runs and confirm the printed grade is exactly `raw, raw, raw, raw, raw, partial, partial, clean`. **A single masked token producing `partial` is the v4 defect and is a blocking failure.** Confirm the sub-θ runs also show **AC-4.13's exposed-count feedback line** naming how many tokens went out in the clear, and that the 1-token run's line reads sensibly (it must not congratulate the player).
4. **Display check — the 3-segment gauge.** Confirm 보안 starts the round displaying `earned 0 / 남은 안전 예산 100 / 잃은 안전 0`. Then, on **turn 1** of a fresh run:

   | path | internal | earned | 남은 예산 | 잃은 안전 | overdraft |
   | --- | --- | --- | --- | --- | --- |
   | 거절 | +17 | 0 → **17** | 100 → 83 | 0 | — |
   | 가려서 처리 (clean, 8/8) | +17 | 0 → **17** | 100 → 83 | 0 | — |
   | 가리다 일부 놓침 (7/8) | 17 − 8 = **9** | 0 → **9** | 100 → 83 | 0 → **8** | — |
   | **흉내만 가리기 (5/8)** | forfeit + (−20) = **−20** | 0 → **0** (clamped) | 100 → 83 | 0 → **17** | **−20** |
   | 그대로 처리 (0/8) | forfeit + (−20) = **−20** | 0 → **0** (clamped) | 100 → 83 | 0 → **17** | **−20** |

   **The last two rows must be indistinguishable on the gauge and distinguishable in the feedback**: identical arithmetic (R-g grades both `raw`), different copy (AC-4.13 fires only where a transform was applied). The *earned* segment must **not** move on either — what must move is the **잃은 안전** band, the overdraft marker, **and AC-4.12's forfeit beat**.
5. **Punishment-path movement on the earned segment.** Load **`?seed=clean3`** (turns 1–3 pre-set to clean sends, internal 50) and play 그대로 처리 as **turn 4**. Confirm the earned segment visibly moves **50 → 30** (`50 + 0 baseline − 20`) and the 잃은 안전 band moves **0 → 37**.
6. Confirm the 딸깍 plays and a dot flies into and stays in the AI window, **and that its variant matches the grade** (hollow on the 8/8 run, half on the 7/8 run, solid on the 5/8 and 0/8 runs — AC-4.11). Re-render the pane **50×** via `?debug=1` and confirm reservoir element identity and dot count are unchanged; then run **V-0.8**'s full cycle including the TITLE no-anchor case.
7. Confirm the card-1 feedback line reads exactly "결과물은 똑같이 얻었습니다. 원본을 다 줄 필요가 없었던 거죠."
8. Confirm the stub end card is reachable and the run can be *finished* (Principle 5).
9. **Judgment call:** does watching two gauges move in opposite directions create tension? Ask the tester, unprompted, whether they think they are doing well — and specifically whether the ghosted band reads as *potential* or as *failure*, whether the forfeit beat reads as "I lost something I had" or "I never got it", **and whether being told that 5-of-8 masking counts as 그대로 처리 reads as fair or as a bug.** Record the verdict; the last question is OQ-5's θ-register reading in miniature.

### v0.1.5 gate — **"부메랑 순간에 소름이 돋는가" (최대 관문, asked early)**

1. Recruit **3 people who have never seen the game** (cohort 1). Explain nothing. Hand them `?phase=boomerang`.
2. Watch their faces at the moment the stranger's bubble fills. Do not narrate.
3. Confirm the bubble shows exactly `김OO 010-1234-XXXX` and that it is visibly **the same dot** the player dragged (AC-3.9).
4. **Run V-0.8 against the spike route specifically**, cycling `R1_TURN → R1_MONTAGE → R1_BOOMERANG → R1_FREEZE` and back, **and visiting TITLE at least once**. The dot must survive every transition; the reservoir must hide rather than throw on TITLE; the I-4 assert must stay silent.
5. Confirm total silence for the whole sequence (AC-3.7).
6. Confirm the 파국 bubble flood plays before the freeze, using the authored flood sentences in the **existing** bubbles (AC-3.11, D1b).
7. Confirm the freeze leaves exactly one line: **"다시 해보시겠습니까?"**
8. **Judgment call:** did they react? Record verdicts verbatim. If it read as coincidence, re-time via the `:root` constants and re-test — **at this stage that costs hours, not a content rebuild.**
9. **Explicitly out of scope here:** any verdict on drag ergonomics. That is v0.4 step 4.

### v0.2 gate — **"클릭 토글 조작이 답답하지 않은가"**

1. Play cards 1 and 2 masking everything correctly (coverage 1.0); confirm `가려서 처리 (정답)` → `업무+15 / 보안+0` internally plus the turn's baseline, and the expected 3-segment movement.
2. Deliberately miss **one** risk token; confirm `가리다 일부 놓침` → `+15/−8` (clause **C4**, coverage 7/8 = 0.875 ≥ θ) **with the baseline still granted**. Then miss **two**; confirm still `partial` (6/8 = 0.75 ≥ θ). Then miss **three**; confirm it flips to **`raw`** (5/8 = 0.625 < θ) **with the baseline forfeited** and AC-4.13's line. *These three sub-steps are the coverage boundary observed from the player's side.*
3. Send with no masking at all; confirm `요청을 그대로 처리` → `+15/−20` (clause **C3**) **and that the baseline is forfeited**, with AC-4.12's beat, and that the result is **numerically identical** to step 2's three-miss case.
4. **Wrong-tool grading — four sub-steps that exercise C3 and C4 separately under coverage:**
   - **(a) genuinely partial → C4.** On **card 1**, correctly apply `마스킹` to the 3 전화번호 and 2 주문번호 tokens **and `익명화` to one of the three 실명 tokens** → **6 of 8 neutralized = 0.75 ≥ θ** → **`가리다 일부 놓침` (+15/−8)**, feedback naming **익명화** for the two names still exposed.
   - **(a′) the same play one token short → C3.** Repeat (a) but skip the 익명화 step entirely: `마스킹` neutralizes 5 of 8 (`pii_name.neutralizedBy = ['anonymize']`, and card 1 declares **no 요약-eligible unit**), **coverage 0.625 < θ → `요청을 그대로 처리` (+15/−20, baseline forfeited)**. *This pair is the single clearest demonstration that the boundary is coverage-based: the two plays differ by one click and by 29 points, and it is the **sixth** click that is worth them, not the first.*
   - **(b) nothing neutralized → C3.** On **card 4** (risk key = 미공개 정보 전체, `unreleased_spec.neutralizedBy = ['fake']`, **no 요약-eligible unit**), apply `마스킹` to the whole document. **Zero** tokens neutralized → `그대로 처리`.
   - **(c)** Confirm the feedback line differs across (a), (a′) and (b) and names the right technique in each.
   - **(d) the clause-F3 binding case, played by hand.** On **card 2**, use `문단 전체 선택` on the 참석자 문단 and apply `익명화` in **one** application. Confirm **5 of 8 tokens neutralized = 0.625 < θ = 0.7 → `raw`**, baseline forfeited. **This is the largest single bulk application anywhere in the game and the case that sets θ's lower bound (§2.6.3).** A build in which this play grades `partial` has either shipped θ ≤ 0.625 or re-authored card 2, and clause F3 must have thrown at boot; if it did not, that is a defect in the audit, not in the play.
5. **요약.** On **card 2**: select any token inside the `@@ summarize>`-declared 논의 본문 unit and press `요약`; confirm the **whole unit** collapses to its **one authored summary sentence**, that 요약 alone neutralizes the `unreleased_perf` and `hr_eval` tokens inside it **even though neither lists `summarize` in `neutralizedBy`** (R-n1), and that this alone is **3 of 8 = 0.375 → still `raw`** (R-m3 / clause F2 guarantee it cannot be enough on its own). Then apply `익명화` to all five names in the 참석자 header unit and send; confirm the grade is **`clean` (C2)** at coverage 1.0 — *this is the PRD-literal correct answer for card 2 (§6 line 171)*. Then confirm: a 요약 attempt on a selection touching **no** eligible unit is refused; one spanning **two** units is refused; applying `마스킹` to an index already inside the collapse is refused (R-c3); and with `?debug=1` that `state.turn.transformed` keys **every** index in the collapsed unit.
6. Confirm each of the four tools produces a visibly different transform and that the **transformed** text is what gets sent; that **익명화 renders the card's authored replacements** (card 2's five names become five *distinct* 직책-style aliases, not a repeated stub) and **가상데이터 renders the authored fake** (card 4's `129,000원 → 약 11만원대`, card 2's `129,000만원 → 약 12억원대`); **that no replacement is off by an order of magnitude**; and that grading is unaffected by the changed output length.
7. **Whole-document click-count criterion.** Play **card 4** (≤6 문단) to a clean mask and count pointer actions using `문단 전체 선택` / `문장 전체 선택` only. **Pass = ≤8 actions on whole-document cards and ≤25 on any card.** *(A risk-type-keyed bulk select is forbidden by AC-2.7; if present, this step fails regardless of count — and clause F3's model no longer covers the build.)* If card 4 exceeds the budget, re-author it into fewer 문단 **without reducing its risk-key size below 8** (R22), do not widen the affordance.
8. **Touch procedure.** Copy `index.html` onto the device itself and open it from the device's Files app. Run steps 1–7 at phone width and confirm the line-per-clause layout, no iOS long-press callout over tokens, that **vertical scrolling over the prompt still works**, and that `마지막 동작 취소` recovers a mis-tap.
9. **Judgment call:** does click-toggle feel like busywork on card 2 and card 4? Does the 요약-eligible unit read as *discoverable*? **And does a tester who masked most of a card but graded `raw` understand why from the feedback alone (AC-4.13)?** Record.

### v0.3 gate — **"5분에 끝나는가"**

1. With `?debug=timing`, play all 6 cards start to finish. Record per-card **first-read and interaction time separately**. **Soft pass = ≤5:30 interaction time.** Do **not** decide the card count here — that is OQ-11, at the v0.4 gate.
2. **Card 3 — the empty-risk-key card (clause C1).** Confirm the prompt contains **zero** risk tokens, that the masking editor is nonetheless **present** (AC-5.6), and that sending it — whether or not any tool was applied — grades **`가려서 처리 (정답)` (+15/0, baseline granted)**, with the dedicated reveal line. Over-mask several safe tokens and confirm the grade is still clean and no penalty applies. **Then confirm the dot it adds is SOLID when nothing was applied and HOLLOW when something was** (AC-4.11).
3. Card 3 verification: underline the `73%` figure, use `근거 요구`, confirm the AI replies **"출처를 확인할 수 없습니다"** and the score moves `업무+5 / 보안+5`.
4. Confirm `환각을 잡아냄` scores **per genuine span**: catch both genuine spans on card 3 — which requires **two different tools** (AC-5.11) — and confirm `업무 +10 / 보안 +10` total with `업무 −6` in tool cost.
5. **Wrong verification tool (AC-5.5b).** Underline card 6's genuine 법 조항 span and apply **원문대조**. Confirm: tool consumed, `업무 −3`, **no** catch, span remains uncaught, result reads **"특별한 문제를 찾지 못했습니다"** — textually distinct from a decoy's **"문제 없습니다"**. Then apply `교차 확인` and confirm it resolves.
6. Confirm each tier-B card presents **exactly 5 candidates of which exactly 2 are genuine** (AC-5.9), and that applying a tool to a decoy consumes it, costs `업무 −3`, and returns `"문제 없습니다"`.
7. **Toolbar exposure and the tell (AC-5.6 / AC-5.10).** Confirm the 검증 row is **absent on cards 1 and 2** and **present on cards 3, 4, 5 and 6** — including **card 4, which has no genuine spans**. On card 4, confirm ≥2 decoy candidates are underlinable, that spending a tool on one costs `업무 −3` and returns `"문제 없습니다"`, and that sending card 4 with **zero** tools queues **no** −25 (AC-5.7).
8. Confirm the verification counter runs `2/2` → `1/2` → `0/2` and that a third attempt is blocked with an explanation.
9. **`검증 없이 답변 제출` — the reading-(a) check, with the delay pinned.** Send card 3 having used **zero** tools; confirm `업무 +15` **once** and that the `−25` boomerang lands **exactly 2 turns later** (turn 5), with its named callback beat. Then replay and send card 3 having used **one** tool that **missed**: confirm **no** −25 is queued **and that AC-5.12's non-scoring ritual beat fires**. Then send a **tier-A** card (card 1, and separately card 4) and confirm **no** −25 is ever queued. Finally send card 6 with zero tools and confirm the pending penalty is **flushed into the ending transition**.
10. **Scripted exclusivity + R-f′ check** (pre-mortem 2): play a full paste-everything run and confirm 업무 lands on **exactly 90**, and — via `?debug=score`'s unclamped readout — 보안 internal on **exactly −158**, with `securityUndercap = 158` and the baseline ledger showing **five forfeited turns and one granted** (card 3). *(−75 means R-f′ was not implemented; −95 means the C1 carve-out was not.)*
11. **The run-13 identity check (v5).** Replay the same six cards but this time **mask 5 of 8 on cards 1, 2, 4 and 6 and 5 of 9 on card 5** before sending each — real clicking, real transforms, visibly masked text on screen. Confirm the totals are **byte-identical to step 10's**: **90 / −158, undercap 158, five forfeited turns**. **Any value above −158 means a sub-θ card was graded `partial` and R-g is not implemented.** *This is the cheapest single check in the whole gate for the defect that survived round 4.*
12. Walk all 6 cards and check each answer's badge against the source's badge table: **every** hallucinating answer shows `⭐ 확실합니다`; at least one clean answer shows a lower badge.
13. Send-confirm modal: confirm the `다시 묻지 않기` checkbox is absent on cards 1–2 and present from **card 3** (`turnIndex >= 2`, 0-based), and that using `다시 보기` then re-sending on card 2 does **not** make it appear.
14. `사용 중: 무료 플랜` visible from start; ⚙ appears at **turn 4** (`gearTurnIndex = 3` at N=6); confirm under `DEMO_MODE` (N=4) it appears at **turn 2** and **does not collide with the checkbox turn** — and that `?debug=audit` clause E passes in both modes. `대화 내용을 학습에 사용` is ON by default; turning it off gives `보안 +10` exactly once **with a visible chip even if the gauge is near 100**.
15. Play the whole round once ignoring the ⚙ entirely and confirm the run still completes.
16. **DEMO_MODE coverage and necessity.** Play a full round in `DEMO_MODE` and confirm:
    - **all four masking techniques are genuinely required** by the trimmed set — and read `?debug=audit` **clause C**, which proves it by non-existence (AC-9.3). Confirm 가상데이터's requirement traces to **card 4**, its only home.
    - **three of four verification tools are exercised and the missing one is 자가검토**, matching AC-9.3b's named exemption exactly — clause D.
    - 보안 still tops out at exactly 100 on a no-raw-send run (AC-9.4).
    - **all four quadrants remain reachable at `taskPerCard × 4 = 40`** — clause A. For `최악`, the worked example is **cards 1 and 4 sent raw, cards 3 and 6 rejected → 업무 30 / 보안 10** (baselines kept on the two 거절 turns = 50, forfeited on the two raw turns, −20 each).
    - **clause B's necessity margin is 20**, **clause B2's one-card frontier is 85**, and **clause F passes all four sub-conditions at N = 4** — all matching §2.6.6 (AC-8.1b).
17. **The two regression runs, played by hand.**
    - **Run 8 (zero masking):** raw card 1, raw card 2, card 3 with 2 tools and 2 catches, reject card 4, raw card 5 with 2 tools and 2 catches plus the ⚙, reject card 6 → must land **68 / 21 → 유출 사고**. A result of 68 / 70 → `AI 네이티브` means the round-3 hole is open again.
    - **Run 12 (minimal masking — the v5 regression row):** the same shape but with **exactly one risk token masked on each of cards 2, 5 and 6** — three clicks in the whole run — → must land **72 / 31 → 유출 사고**. **A result of 72 / 100 → `AI 네이티브` means the round-4 hole is open again and is a blocking defect, not a tuning question.** Confirm the two runs' 보안 differ only by the profile, not by the masking (31 in both cases is the frontier maximum; run 8's 21 is below it because it rejects a tier-B card).
18. **The one-card class, played by hand — all THREE rows, cheapest first.** These runs are all *expected to pass*; they are played so the team sees with their own eyes how cheaply the top ending can be reached while two documents go out in the clear, **before** answering OQ-12(ii). Playing only the expensive row would understate the gap.
    - **Run 14a (the cheapest route — play this one first):** c1 거절, c4 거절, **c2 cleaned with exactly TWO tool applications** — `문단 전체 선택` over the 5-name 참석자 문단 then `익명화` (one gesture, 5 tokens), then click any token in the 논의 본문 unit and press `요약` (one gesture, the remaining 3) → `clean` via C2 — c3 2/2, c5 raw + 2/2, c6 raw + 2/2, ⚙ found → must land **72 / 67 → AI 네이티브**. **Count the gestures out loud.** If cleaning card 2 takes more than two applications, the card was authored wrong (its two regions are not both bulk-addressable) and S2.2's partition needs re-reading.
    - **Run 14b (the exact-boundary row):** c1 거절, c4 거절, **c6 masked to exactly 6 of 8** with three applications (`마스킹` on the 핵심 조항's two 거래처명, `익명화` on its two 금액, one `요약` collapse on one 조항 unit) → `partial` via C4 — c3 2/2, c2 raw, c5 raw + 2/2, ⚙ found → must land **72 / 60 → AI 네이티브**, sitting **exactly** on the shipped threshold. Confirm the displayed value is 60, not 59 or 61; this is also the clearest live check that `≥` semantics (AC-8.1) are implemented and not `>`.
    - **Run 14 (the class maximum, which clause B2 asserts):** c1 거절, c2 raw, c3 2/2, c4 거절, **c6 fully masked** + 2/2, c5 raw + 2/2, ⚙ found → must land **72 / 68 → AI 네이티브**. Confirm `?debug=audit` clause B2 reports **68** at N = 6, matching this row.
    - **Record all three verbatim and attach them to the OQ-12(ii) packet.** The decision the PRD author is being asked for is whether *any* of these should reach the top ending — and the answer may well differ for 14a (two gestures, 67) and for 14 (four gestures, 68).
19. Nothing about round 1's absence of a confirm modal is checked at this gate — round 1 does not exist yet.

### v0.4 gate — **"부메랑이 쌓여서 설득력을 갖는가"** (the core beat was cleared at v0.1.5)

1. Recruit **≥3 fresh people** (cohort 2). Explain nothing. Play the full 7 minutes.
2. Confirm round 1 shows **no gauges, no tools, no send row, no confirm modal and no warning** at any point (AC-3.1).
3. Confirm the round-1 paste is a real drag on `[원본 문서]` (AC-3.3).
4. **Drag ergonomics.** Across 3 testers × 4 drags = **12 drag attempts**, record: (a) how many drags were abandoned or failed on first attempt; (b) how many times the AC-3.3b fallback was revealed **and by which of the three conditions** — failed, stalled, or the **12-s idle** path — and how many testers then used it instead of retrying; (c) any tester who verbally complained. **Pass = ≤1 abandoned drag out of 12, and no tester switching to the fallback permanently.** **Separately confirm that the idle path actually fires** for a tester who never touches the drag source. If the gate fails, remedy in order: widen the drop target → lengthen the drag-hint affordance → shorten the idle timer → (last resort) make the fallback visible from the second request onward, recording it as a deviation from B3.
5. Time round 1: **pass = 1:30–2:30.**
6. Confirm the stranger's window shows exactly `김OO 010-1234-XXXX` and that it is visibly the same dot the player created on card 1 — **after four intervening turns and three beat transitions**.
7. Confirm the second boomerang: `"업계 관계자의 73%가..."` → news article → AI citing that article back; then the 파국 bubble flood across **every** on-screen bubble; then total silence throughout.
8. Confirm the freeze leaves exactly **"다시 해보시겠습니까?"**, that the interstitial visibly **drains** the round-1 dots as a ~2 s beat **over its own `.screen-interstitial__dotzone` anchor** (AC-3.12, E2b), and that round 2 then starts from the same card data with gauges (보안 displayed at 0 with a full ghosted band), toolbar and send row revealed.
9. Confirm round 2 **accumulates its own dots in three legible variants** (AC-4.11): a fully-masked send adds a hollow 점, a 1–2-miss send a half 점, a raw or sub-θ send a solid 점, an untouched card-3 send a **solid** one, a 거절 none — and that the reservoir **at the ending screen** visibly differs between a careful run and a 흉내만 가리기 run. **Ask a tester to say, looking only at the ending reservoir, roughly how careful they were**; if they cannot, the three variants are not distinguishable enough and the styling needs contrast work.
10. Confirm card 3's round-2 answer text is **identical** to round 1's, and that testers notice (AC-3.10). Ask afterwards whether anything felt familiar.
11. **OQ-11 — the 6-vs-4 decision.** Compare v0.3's per-card first-read times against the observed round-2 times now that round 1 has pre-read cards 1–4. Decide 6 cards or the AC-9.2 trim. **A trim changes DEMO_MODE's prominence, not coverage** — but promoting any sub-6-card set to the shipped default invokes R15's sign-off rule (**rows 11 AND 14 미흡 → 13/15**) and **requires `?debug=audit` clauses B, C and F to pass on the promoted set** (AC-9.5), with clause B2's new value recorded against OQ-12(ii).
12. **OQ-5 — the two tuning readings.** (a) Ask each tester, after a run in which they missed 3 tokens on some card and were told 그대로 처리: *was that fair?* (b) Ask, after a 대충 가리기 run that landed `AI 네이티브` at 75: *did that feel earned?* Record both verbatim. These are the θ-register and 보안-threshold readings, and they are the only two numbers in this plan whose final value is deliberately deferred to real play.
13. **Judgment call + rollback.** If the sequence reads as coincidence *despite* v0.1.5 passing, work the R17 remedy ladder in order and re-test with **cohort 3**. Record verdicts verbatim.

### v1.0 gate — **"다 하고 나서 뭘 얻었다는 느낌이 드는가"**

1. **Play all fourteen runs of AC-4.5's reference table and confirm each literal value** — internal (via `?debug=score`, **unclamped**) and displayed:

   | # | Run | 업무 int / disp | 보안 int / disp | Quadrant |
   | --- | --- | --- | --- | --- |
   | 1 | 전부 거절 | 0 / 0 | 100 / 100 | 안전한 무능 |
   | 2 | 전부 그대로 | 90 / 90 | **−158** / 0 | 유출 사고 |
   | 3 | 가려서 + 최소 검증 | 96 / 96 | 125 / 100 | AI 네이티브 |
   | 4 | 가려서 + 최대 검증 | 102 / 100 | 140 / 100 | AI 네이티브 |
   | 5 | 마스킹 완벽 · 검증 전무 | 90 / 90 | 25 / 25 | 유출 사고 |
   | 6 | 대충 가리기 (1개씩 놓침) | 96 / 96 | 75 / 75 | AI 네이티브 |
   | 7 | 최악(강) | 45 / 45 | **−10** / 0 | 최악 |
   | 8 | 마스킹 전무 · 거절 2 · 검증 최대 | 68 / 68 | **21** / 21 | 유출 사고 |
   | 9 | 마스킹 전무 · 최적해 | 72 / 72 | 31 / 31 | 유출 사고 |
   | 10 | 의식적 검증 | 81 / 81 | 100 / 100 | AI 네이티브 |
   | 11 | 최악(약) | 30 / 30 | 27 / 27 | 최악 |
   | **12** | **최소 마스킹 (3클릭)** | **72 / 72** | **31 / 31** | **유출 사고** |
   | **13** | **흉내만 가리기 (3개씩 놓침)** | **90 / 90** | **−158 / 0** | **유출 사고** |
   | **14** | **한 장만 제대로** | **72 / 72** | **68 / 68** | **AI 네이티브** |

   Any deviation is a defect, not a tuning question (pre-mortem 3). **Seven rows must be read, not ticked:** row 2's **−158**; **row 5** (reading (a)); **row 7's −10** (R-f′'s keep half); **row 8** (zero-masking regression, 70 → hole open); **row 10** (the (a)/(a′) discriminator); **row 12** (minimal-masking regression, **100 → hole open**); **row 13 must equal row 2 to the digit** (the coverage boundary is live). **Row 14 is expected to pass and is shown to the PRD author alongside OQ-12(ii) — together with its two cheaper siblings 14a (72/67, two tool applications) and 14b (72/60, exactly on the threshold), both played at the v0.3 gate step 18.** Showing only row 14 understates how cheap the disclosed class is.
2. **Read `?debug=audit` on the shipped set and record all six clauses**, in particular **clause B's necessity margin (29 at N=6)**, **clause B2's one-card frontier (68 at N=6)** and **clause F's four sub-conditions** — AC-8.1b is the one claim in this plan that a human playthrough cannot verify, since it is a statement about runs nobody played.
3. Confirm each quadrant shows its own comment and that `안전한 무능` reads exactly "안전했지만, 아무 일도 못 했습니다. 가려서 쓰면 둘 다 가능했어요."
4. On a run where the security clamp clipped **above** 100 (run 3), confirm the AC-4.8 overcap line; on a run where it clipped **below** 0 (runs 2 and 13), confirm the AC-4.8b undercap line naming **158**; on a run where neither applies (run 11), confirm **both** lines are absent. Confirm the undercap value is the **deepest excursion**, not a sum of clipped events.
5. On a run that never opens the ⚙, confirm the ending includes exactly "설정에 학습 사용을 끄는 옵션이 있었습니다. 무료·유료·기업용은 정책이 다릅니다."
6. **Safety card, all three branches:**
   - **Run 6** (misses > 0) → `당신이 가장 자주 놓친 것` renders the PRD format with a count, matching what was actually missed.
   - **Run 3, 5 or 10** (zero misses, sends > 0) → the authored zero-miss line renders; the block is **not** empty.
   - **Run 1** (no sends at all) → the authored no-sends line renders.
   - On every run, confirm the single round-1 line (AC-8.3b) is present and that round-1 misses did **not** contaminate the personalized count.
   - Switch the role selector across HR / PO / 디자인 / 개발 and confirm the copy changes; confirm `멈추기 · 가리기 · 확인하기` is present.
7. Save the card as an image in **all four** browsers from `file://`; open each downloaded PNG and confirm Korean glyphs render (R13). Note any browser that refuses the data-URI download and confirm the blob fallback works there.
8. Press `복사하기`, paste into a plain text editor, and **diff character by character** against the four §10 lines. Repeat in all four browsers from disk.
9. Confirm the verification-prompt screen is the last thing left on display.
10. Walk all 15 rows of §11's 강의 자료 대응표 against the build, naming for each row the screen where it is observable **and the step that implements it**. **Pass = 15/15 — with one widened exception: if R15's rung ② or ③ was invoked and fewer than 6 cards ship, BOTH row 11 AND row 14 are recorded as 미흡 → 13/15, each with the PRD author's name attached to its own sign-off. Up to two named sign-off-required 미흡 rows are permitted; a third is a fail. A shortfall may never be recorded as a pass.**
11. Confirm every OQ-4 item is authored, not placeholder — **all 18 rows**, including the 파국 flood sentences, the gauge segment labels, all three safety-card branches, **all ~29 inline replacement values and every 요약 canonical sentence (items 13–14)**, the raw-forfeit beat, the flush beat, the ritual beat, **and the sub-θ raw line (item 18)**. For items 13 and 14 the check is **qualitative as well as present/absent**, using S5.5's four questions: natural Korean, **correct order of magnitude**, faithful summaries, distinct aliases. The boot assertion catches absence only.
12. Sign off on the R9 assumption status: state explicitly whether 13/15/16/20쪽 were confirmed against the real slides or shipped under the ASSUMPTION banner.
13. **Sign off on the supplied-rule status**, one line each: **(a)** reading (a) of 검증없이제출 (OQ-10 / Q2); **(b)** **R-f′ + R-g and the 60 threshold (OQ-12(i) / Q6)**; **(c)** **whether R-h was adopted (OQ-12(ii))**; **(d)** the index readings of OQ-9; **(e)** OQ-6 / OQ-7; **(f)** **the playtest reading on θ's register (OQ-5)**. If any is unconfirmed, name the reference run to show the author: run 10 for (a), runs 12 and 13 for (b), **runs 14a, 14b and 14 for (c) — all three, cheapest first**.
14. Run the S5.4 originality comparison and record the three-criterion verdict (R11).
15. Full-session console and network check (V-0.2, V-0.3) plus V-0.7 / V-0.8 / **V-0.9 / V-0.10** on the final build, including the AC-1.3 warning-whitelist review.

---

## 8. ADR

**Decision.** Build 「우리는 우리가 넣은 대로 된다」 as a single `index.html` that: renders with DOM/CSS plus inline SVG and a CSS-driven FX overlay; **splits its input grammar by gradedness** — a coarse, ungraded pointer **drag** for round 1's paste, uniform **단어 단위 클릭 토글** for every graded mechanic, with the click fallback revealed only after a failed, stalled or 12-second-idle drag; authors all card content as **annotated strings tokenized once at boot**, with every answer key **and every risk-key size** derived rather than hand-indexed, **every replacement string carried inline in the annotation grammar and mandatory for every 익명화 and 가상데이터 token** (`[텍스트|유형>대체값]`, `@@ summarize> 문장`) so that no index-keyed side table and no undefined 직책 map exists, and every mask transform expressed as an **original-index-keyed overlay** in which **요약 collapses exactly one authored 문단 unit** and **neutralization is decided by one rule — erasure neutralizes unconditionally, substitution by the technique map**; structures the script as one IIFE with seven banner-delimited sections; updates the UI through a single `state` object with **region-scoped** re-render behind a throwing `region()` accessor, delegated `data-act` events, separate renderers for round 1 and round 2, and round 1's four beats as `data-beat` states of one persistent screen; persists the accumulating dot reservoir in a **boot-created element outside `#app`**, transform-anchored to a per-screen named anchor that **hides cleanly when absent** and whose **`ResizeObserver` is re-bound on every render and phase change**, with a `?debug=1` MutationObserver and identity assert that throw the moment any structural invariant is violated; models the 보안 게이지 as an **earned gauge with a distributed baseline that a raw send forfeits (R-f′)**, displayed as **three segments** plus an overdraft marker, with deferred penalties landing at a **pinned two-turn delay**; **grades the prompt side through an ordered, exclusive, total clause set whose `raw`/`partial` boundary is a COVERAGE test at θ = 0.7 (R-g) rather than an existence test**, with `검증 없이 답변 제출` firing **only when zero verification tools were used on a card that actually contains a hallucination**; exposes M3/M4 by **unlock boundary rather than content tier** so toolbar presence is not a tell; and **states the PRD's central thesis as a normative necessity constraint over the whole sub-θ outcome space, discharged by a boot-time exhaustive enumerator whose enumeration domain is written out in full**. It inserts a new **v0.1.5 부메랑 스파이크** stage so the PRD's own 최대 관문 is answered at stage 2 of 6 rather than stage 5 of 6.

**Drivers.** (D1) 부메랑 연출 신뢰도 / 정서적 적중 — the product's whole payload, and the driver that governs Decisions A, B and E. (D2) 텍스트 상호작용 채점 정확도 — three of four mechanics are precise selection graded against an answer key. (D3, a **gate** rather than a tradeable driver) zero dependencies, single file, `file://` — which is also why the necessity, coverage and coverage-band proofs are an in-file boot enumerator rather than a test suite.

**Alternatives considered.** Full-canvas and canvas/DOM-hybrid rendering; uniform click-toggle everywhere and uniform drag-selection everywhere; multi-`<script>`, JSON-island and ES-module file structures; per-token-object, regex-matcher and re-tokenizing content models; imperative DOM mutation without a state object; a formal phase transition table; round 1 as a parameterization of round 2's renderer; three competing fixes for reservoir survival, of which two were adopted together, plus observing `.pane-ai` versus observing the anchor, and throw / clear / hide as the three candidate no-anchor behaviours; **two DEMO_MODE card sets** compared on eight criteria; the depleting 100-point trust reserve against the earned distributed-baseline gauge, and the bare one-segment gauge against the three-segment gauge; **three readings of §5's 검증 없이 답변 제출 row**, of which the round-3 Architect's (a′) was evaluated arithmetically and declined; **two neutralization models** (technique-hierarchy versus leakage); arbitrary-range versus declared-unit 요약 granularity; **a derived 익명화 transform with a 직책 map versus mandatory inline authoring**; **two-variant versus three-variant dot styling**; and — the decision of this iteration — **six ways to make the PRD's thesis true**: raise the 보안 threshold, raise the 업무 threshold, charge 거절, forfeit the baseline on a raw send (R-f′), **scale the forfeiture proportionally (R-f″)**, and **make the grade boundary itself coverage-based (R-g)** — all six enumerated over the full outcome space, with **two of them tried in a shipped draft and falsified by enumeration** before the sixth was chosen.

**Why chosen.** DOM makes the boomerang re-timable by editing a CSS constant, and independently makes the text-precision majority of the work nearly free. The gesture split recovers PRD §2's drag-complicity correspondence at the one place it narratively matters. Annotated strings cut card data from ~2,000 lines to ~200 and make Principle 2's proofreadability true rather than aspirational; putting **every** replacement string inside that grammar — 익명화 included — is what keeps AC-1.6's ban on side tables intact *and* removes the one remaining undefined concept in the content model, after two rounds in which "the replacement text is derived somewhere" turned out to be false in a new place each time. The single leakage-model neutralization rule is chosen because the alternative scores the safest possible transform identically to the least safe one; bounding 요약's applicability per authored unit, and now its *size* below `need`, is what keeps it from becoming either a universal solvent or a one-click grade lift. Putting the reservoir outside `#app` is the only candidate fix that does not depend on future callers behaving correctly. The earned-gauge model is what PRD line 128 literally says and keeps the discovery rewards visible instead of clamping them into no-ops.

**R-g is chosen over the five other closures because it is the only one that fixes the predicate rather than the payout.** Threshold-only closure was *verified and found insufficient* — under the existence boundary the minimal-masking frontier reached displayed 100, so no threshold at any value closed it. Raising the 업무 threshold would make a single 거절 permanently disqualifying. Charging 거절 breaks a PRD literal and is properly the author's call. R-f′ is necessary and retained, but on its own is exactly as discriminating as the predicate it keys off — which is how a fixed, enumerated, machine-audited plan shipped a *relocated* version of the same defect. R-f″ was tried and buys zero closure, because the exploit's maximizing profile fully masks the one card it touches. **R-g touches no §5 value (the PRD never defined this boundary), preserves all three 설계 의도 outcomes exactly, derives its one constant from the shipped content's own structure rather than from taste, collapses the minimal-masking frontier onto the zero-masking frontier by construction, and has a one-sentence teachable semantics: 3개부터는 안 가린 것과 같다.**

**Consequences.** One long file (~2,200–2,700 lines), mitigated by fixed section order. `render()` is permanently constrained to `region()` and `goPhase()` to `#app`, enforced at runtime. Two input gestures coexist, gated separately. **Four supplied rules the PRD does not contain — the per-request security award, its forfeiture on a raw send, the two-turn boomerang delay, and now the coverage threshold θ — are derived, marked in-source, and open to challenge.** `그대로 처리` is meaningfully worse than `거절`, which is the intended pedagogy but a heavier hand than §5's bare −20 implies. **Under R-g, a player who masks a third of a document gets exactly what a player who masks nothing gets** (runs 2 and 13 are identical to the digit) — deliberate, and the single thing most likely to read as harsh in playtest, which is why AC-4.13 makes it explained rather than silent and why OQ-5 puts the register to real testers. **Every card's risk-key size is now load-bearing content** (F1e), so content edits carry an audit obligation they did not before (R22, AC-9.5). **The 검증없이제출 reading remains the second-largest unratified assumption** (OQ-10 / R19). Correct masking alone lands in `유출 사고` (run 5) — deliberate. Ritual verification (run 10) still reaches `AI 네이티브` under reading (a). **A run that masks exactly one card, rejects two and leaks two still reaches `AI 네이티브`** — at the class maximum (run 14, 72/68), at the cheapest known cost of **two bulk tool applications** (run 14a, 72/67), and all the way down to the threshold itself (run 14b, 72/60) — disclosed, machine-recorded, and routed to the PRD author with **three** closure options written out (α the structural rule R-h, the only one holding at every card count; β a score-only 보안 69 at the default N = 6; γ a per-card-count threshold triple). `DEMO_MODE` — and any card-set-trimming fallback — does not exercise 자가검토, a named exemption costing **two** §11 rows. Content authoring grew again (~29 inline replacements) and is estimated at 3–3.5 person-days. The game is desktop-designed and phone-playable; §10's "공유 가능하게" is scoped out.

**Follow-ups.** Send S0.2's two-part packet — (A) the blocking slide content before S3.1a, (B) six non-blocking questions including **Q6, now carrying the corrected arithmetic, the three cheapest-first discriminator runs (14a / 14b / 14) and all three closure options (α R-h, β 보안 69 at N = 6 only, γ a per-card-count triple)** — and name R17's three tester cohorts, all at the same time. Author the OQ-4 copy set (**18 items**, ~29 of the lines being inline replacement values). Implement `auditCardSet()` with all six clauses at S3.6, **with clause B's enumeration domain written out as a comment in the plan's own words**, and read it at every card-set *or risk-key* change (AC-9.5). Set `SCORE.threshold` after the v0.4 playtest within the admissible region clause B computes, and take the θ-register reading at the same gate (OQ-5). Take OQ-11's 6-vs-4 decision at v0.4 under R15's two-row sign-off rule. Get an answer on OQ-12(ii) before v1.0 sign-off, **putting runs 14a (72/67, two tool applications), 14b (72/60, exactly on the threshold) and 14 (72/68) in front of the author together, and offering all three closures — (α) R-h, (β) a flat 보안 69 at the default N = 6 alone, (γ) a per-card-count threshold triple** — since adopting R-h is one predicate but changes four reference rows, and adopting (β) is one constant. Evaluate drag-select for round 2 as a post-v1.0 additive enhancement.

---

## 9. What a reviewer should push on

Offered so any further pass can spend its attention where this Planner is least confident. *(This is the final iteration of the 5-round cap, so these are stated as ratification items for the approver rather than as work for another round.)*

1. **θ = 0.7 is derived from the shipped content, which means the content and the constant are now coupled.** The derivation (§2.6.3) is sound *given* F1e's pinned risk-key sizes — but those sizes are themselves a Planner choice, made partly so the band would be wide. An approver should check that F1e's sizes are plausible **as content** (is card 5 really 3 entries × 3 risk tokens?), not just as arithmetic. Clause F is what keeps them honest afterwards; it cannot validate them in the first place.
2. **R-g makes "masked a third of the document" score exactly like "masked nothing" (runs 2 and 13 are identical).** That is the correct pedagogy and the correct closure, but it is the harshest single consequence of this iteration and the one most likely to feel wrong in the hand. AC-4.13 and OQ-5's playtest question exist for it. A reviewer who thinks the register is wrong should say so against run 13, not against the principle.
3. **A run that leaks two documents reaches `AI 네이티브` — and the cheapest route in costs only TWO tool applications (run 14a, 72/67); the class reaches down to exactly the threshold (run 14b, 72/60).** The plan discloses this, records it mechanically (clause B2), states precisely what threshold arithmetic can and cannot do about it (**flat** closure is impossible at N = 5; **scaled** closure is possible there but raises the verification bar; a **score-only** closure at 보안 69 works at the default N = 6 alone), and routes all three closure options to the PRD author. **This is the largest remaining gap between the letter of the thesis and the feel of it**, and it is genuinely a product judgment — but it should be *answered*, not left drifting, and it should be answered against **run 14a**, not only against run 14.
4. **The audit is now trusted twice over, and it has been wrong once.** Clause B's domain is written out and its completeness argument stated (grades quotient the masking state space with respect to scoring). If that argument is wrong, everything downstream of it is. It is worth one reviewer reading only that paragraph adversarially. The known boundary is stated: the audit reasons over grades, not pointer actions, so a future bulk affordance at a granularity other than 문단/요약-unit would fall outside clause F3.
5. **R-f′ is retained but is now doing less work than its §9-in-v4 defence suggested.** With R-g in place, the forfeiture's marginal contribution is smaller — it still separates 거절 from 그대로 처리, which is what runs 7 and 11 test. A reviewer could reasonably ask whether R-f′ is still needed at all now that the boundary is fixed. The answer is yes (without it the zero-masking frontier returns to 80 at N=6), but it is worth confirming rather than assuming.
6. **Reading (a) still lets ritual verification pass (run 10, 81/100).** The Architect's (a′) closes it; §2.6.1 declines (a′) because ~2 of 3 random-play testers would eat a −25. The change is one predicate.
7. **The leakage model makes 요약 neutralize everything, and its brakes are authorial plus clause F2.** If an author declares a 요약-eligible unit on a card where the intended answer is 익명화, that card's technique requirement evaporates — caught by clause C at set level, not per card.
8. **Exposing M3/M4 on card 4 means a player can spend −3 twice on a card with nothing to find.** Defended as the judgment PRD line 148 trains; a reviewer may argue it is a tax on caution.
9. **The v0.1.5 stage is a deviation from PRD §12's stage table** and should be ratified as one.
10. **Draining the round-1 dots (E1a) and round 2 having no leak boomerang of its own** are both authored decisions, not PRD requirements.

---

## 10. Changelog — v4 → v5, with attribution

Legend: **[BOTH]** = Architect and Critic raised it independently in round 4 (higher confidence; fixed once); **[A]** = Architect only; **[C]** = Critic only; **[P]** = Planner-initiated while making another fix.

> **On the attribution itself, and why this iteration fixes a boundary rather than a reward.**
>
> **Round 4's two reviews were run separately and did not see each other. They converged, independently, on the same root-cause diagnosis.** Both accepted that v4's **R-f′** genuinely closed the zero-masking hole round 3 had found. Both then showed, by **exhaustive enumeration rather than spot-checking**, that it had **relocated** the exploit rather than removed it — from "zero masking" to "minimal masking" — and both traced that to the same structural cause: **R-f′ keys off the same binary existence test (`neutralized.size === 0`) that decides the masking grade, so a single mask click on a single risk token was worth the entire forfeited baseline chunk (~29–37 points), with 7 of 8 risk tokens still going out in the clear.** Both independently found that the target ending was reachable at **1–2 clicks** at every shippable card count, and that **3 clicks reached a perfect displayed 보안 of 100** — an ending screen visually indistinguishable from a careful player's. Both found that **v4's own machine audit was structurally blind to the entire class**, because clause B enumerated only the strictly-zero-masking subspace. Both found that v4's stated closure figure ("보안 ≥ 86") was **arithmetically wrong**, since the minimal-masking frontier reached 100 and no threshold could close it. And both arrived at the same recommendation: **fix the grade boundary to be coverage-based rather than existence-based, instead of patching the reward side again** — because any reward keyed off a coverage-blind predicate inherits that blindness no matter how the payout is tuned.
>
> That convergence is why v5 does not re-tune R-f′ and does not adopt the proportional variant **R-f″** — which was tried and shown by enumeration to buy **zero** additional closure, since the exploit's maximizing profile fully masks the one card it touches (fraction = 1.0) and proportional forfeiture degenerates to the all-or-nothing rule at exactly that point. The diagnosis is now **Principle 8**, stated so it outlives this defect: *when an enumeration finds an exploit, the first question is which predicate the exploit is exploiting, not how much that predicate should pay.*
>
> **The pattern across four rounds, recorded because it has now repeated three times:** v3's defect lived in v2's newest subsystem; v4's defects lived in v3's newest subsystem; **v5's defect lived in v4's own fix, and inside the audit written to guard that fix.** The response this round is not only to fix it but to widen what the guard *quantifies over*, and to write the enumeration domain out in full — because the previous failure was not a coding error, it was an unwritten assumption about scope.

### Applied — CRITICAL

| Finding | Raised by | Where fixed |
| --- | --- | --- |
| **The masking-grade boundary is an EXISTENCE test, so R-f′ made one mask click worth an entire baseline chunk (~29–37 points).** `AI 네이티브` reachable at **1–2 clicks** at N = 6/5/4; at **3 clicks** a run reaches **perfect displayed 보안 100** with 21 of 24 risk tokens sent in the clear. Both reviewers verified by exhaustive enumeration, not spot-check. | **[BOTH]** — the convergent central finding of round 4 | **New Principle 8**; **R-g** (§2.6.3) replaces clause C3's `neutralized.size === 0` with a **coverage test at θ = 0.7**, with θ *derived* from the shipped content — lower bound 0.625 (card 2's 5-name 문단 bulk application), upper bound 0.875 (miss-one must stay `partial`), grade-invariant plateau `(0.667, 0.75]`, boot-asserted by clause F4; **§2.6.5's entire reference table recomputed from scratch** (all 11 v4 rows re-derived and unchanged; **runs 12, 13, 14 added**); **§2.6.6's necessity property restated as N-1′ over the sub-θ space**, with **both frontiers recomputed at N = 6/5/4** and shown equal by construction (31/50/40, margins **29/10/20**) plus an explicit adversarial sweep; **R-f″ enumerated and falsified** and recorded as a dead end; **AC-5.3 rewritten, AC-5.3b added** (the transition table as an observable), **AC-4.13 added** (the boundary must be *explained*, not just correct); **AC-4.11** re-keyed to three grade-based dot variants; **R20 rewritten**, **R22 added**; **OQ-12 rewritten with correct arithmetic**; v0.1 gate step 3 walks all eight coverage points, v0.2 gate steps 2/4a′/4d exercise the boundary and its binding case, v0.3 gate steps 11/17 are the regression runs, v1.0 gate row 12 and the row-13 = row-2 identity are the digit-level assertions |
| **`auditCardSet()` clause B enumerated only the strictly-zero-masking subspace, so the audit would pass green on a build with the exploit live.** Its domain was never written down, which is why nobody — including the Planner and two reviewers — noticed what it excluded. | **[BOTH]** | **§2.9.2's enumeration domain is now written out exhaustively**, including the per-card profile set, the Cartesian product, and the **completeness argument** (under R-g the three grades quotient the masking state space with respect to scoring, so enumerating grades enumerates every reachable score — which is *why* the widened domain costs nothing). Clause **B** now ranges over the whole **sub-θ** subspace and compares against a declared constant; **clause B2 is new** and records the one-card frontier as a change detector; **clause F is new** (four sub-conditions: both grades reachable, 요약 unit < need, 문단 bulk < need, θ inside its plateau). **AC-1.10, AC-9.5, V-0.9 and S3.6 updated**; S3.6 additionally requires the domain comment to be written in the plan's own words. **The audit's remaining blind spot is now stated explicitly** (it reasons over grades, not pointer actions) so the next reader does not have to rediscover it |

### Applied — MAJOR

| Finding | Raised by | Where fixed |
| --- | --- | --- |
| **The 익명화 replacement derivation referenced an undefined "직책 map"** — named exactly once in v4 and specified nowhere (not in the card shape, not in the grammar, not in the authoring checklist, not boot-asserted) — **and the same derived function was designated for two risk types it cannot handle**: `pii_attr` (학교·나이·주소·사진) and `confidential_amount` (계약 금액), both PRD-designated 익명화-only. Same class of gap as round 3's CRITICAL-C, surviving in the one remaining technique. | **[BOTH]** MAJOR-1 | **R-r1**: the inline `>대체값` slot is **mandatory for every token whose type is neutralized by `anonymize` or `fake`** — `pii_name`, `pii_attr`, `confidential_amount`, `unreleased_spec`, `unreleased_perf`. **The derived `anonymize.transform` and the 직책 map are deleted outright**; **R-r2** keeps only 마스킹 derived, as the one genuinely mechanical transform. `tokenize()` **throws at boot** on any missing value (**AC-5.2b**); **AC-1.6 greps for the absence of any title/직책 map**; §2.9.1's table gains a `>대체값 required?` column; **OQ-4 item 13 expanded from "~8–12 가상데이터 values" to "~29 values across 익명화 and 가상데이터"** with the per-card breakdown; **R15 raised to 3–3.5 person-days**; **R21 rewritten**; S1.3/S2.2/S3.1b deliverables name the authored values per card; **S5.5 gains a distinctness check** (five names must become five distinct aliases) |
| **The 가상데이터 worked example was off by ~4 orders of magnitude** — `129,000만원` (1.29 billion won) replaced with `약 10만원대 후반` (~180,000 won), and `158,000만원` with `약 15만원대`. A fake that wrong is not a plausible fake; it is a nonsense sentence. | **[BOTH]** MAJOR-1 (secondary) | Corrected in **F1c** and in §4's card-object example to **`약 12억원대`** and **`약 16억원대`**, with a note naming the error class; the unrelated card-4 example adjusted to `129,000원 → 약 11만원대`. **S5.5's read-through gains an explicit order-of-magnitude question** (question 2 of four), and **v1.0 gate step 11 checks it**, because this is precisely the content error a boot assertion cannot see. **v0.2 gate step 6 names both corrected values** so an implementer meets them early |

### Applied — MINOR and consequential-consistency

| Finding | Raised by | Where fixed |
| --- | --- | --- |
| Dot styling keyed on "clean AND any transform applied" was the best proxy available under the existence boundary, but is now strictly worse than the grade itself | **[P]** (forced by R-g) | **E1b / AC-4.11** define **three** variants keyed on the grade — hollow `clean`, half `partial`, solid `raw`/untouched-C1 — with `.dot--partial` added to the CSS section list and S1.1/S1.5 deliverables; v0.1 gate step 6 and v0.4 gate step 9 check them, the latter by asking a tester to read their own carefulness off the ending reservoir |
| `riskKeySize` was an incidental derived property; under R-g it is the coverage denominator and therefore load-bearing content that can drift silently | **[P]** (forced by R-g) | **F1e** pins every card's `R`, per-문단 concentration and per-unit concentration as authoring constraints with a comment table next to `CARDS`; **clause F** checks all of it at boot; **AC-2.4b** extended; **AC-5.1** carries the pinned sizes and `need` values; **R22 added**; **AC-9.5 adds "re-authoring a card's risk key" to the re-audit trigger list**; R15's shortfall rung ① is forbidden from trimming a card below its pinned R |
| v0.2 gate step 4(a)'s wrong-tool example (마스킹 on 5 of card 1's 8 tokens) graded `partial` under the old boundary and grades `raw` under the new one | **[P]** (consistency pass) | **Step 4 rewritten into four sub-steps**, with **(a)** re-authored to 6-of-8 so it still demonstrates C4, **(a′)** added as the 5-of-8 case that now demonstrates C3, and **(d)** added as the clause-F3 binding case. The (a)/(a′) pair is now the gate's clearest demonstration that **the sixth click is worth 29 points, not the first** |
| v4's "boundary of the claim" and OQ-12(ii) were written against a threshold figure (~86) that did not correspond to any reachable frontier | **[BOTH]** | **§2.6.6's "boundary of the claim" fully recomputed**: sub-θ 31/50/40, one-card **68/90/85**, 대충 가리기 75/78/86 (85/88/96 with ⚙). Exclusion of the one-card class needs **69/91/86**, and **at N = 5 no single FLAT threshold can do it** because the one-card frontier (90) exceeds the minimally-verifying careful run (88) — with the reason traced to a PRD literal (거절 = 0 vs 일부 놓침 = −8). **R-h is written out**, hooked in `endingQuadrant` at S5.1, and routed as **OQ-12(ii)**. *(Refined in the round-5 merge: R-h is the only closure that holds at every card count simultaneously, but two non-structural options also exist — a flat 보안 69 at the default N = 6 alone, and a per-card-count threshold triple — and the discriminators are now runs 14a / 14b / 14, cheapest first.)* |
| Consistency sweep: every AC, gate step, risk, decision row and ADR clause that referenced the existence-based boundary | **[P]** (final-iteration requirement) | **AC-1.5** (θ must not be a literal), **AC-1.6** (no 직책 map), **AC-1.10** (six clauses), **AC-2.4** (the `…외 N건` line contributes nothing to the denominator), **AC-2.4b**, **AC-4.2c** (`raw` is decided by coverage), **AC-4.5** (14 rows), **AC-4.11**, **AC-4.13**, **AC-5.1**, **AC-5.2**, **AC-5.2b**, **AC-5.3**, **AC-5.3b**, **AC-8.1b**, **AC-9.3** (scope note: a claim about *clean* play), **AC-9.5**; §2.5.2's R-f′ (trigger restated, rule unchanged), §2.5.6 (run 13's undercap), §2.5.8 (pre-mortem 3 rewritten), §2.7 (DEMO_MODE comment carries its margins), §2.9.1 (the partial-grade interaction note); **V-0.5, V-0.9, V-0.10**; the v0.1, v0.2, v0.3, v0.4 and v1.0 gates; Decisions E, F, G, H, I in §2.4; decision rows 3b, 13, 13d, 19–22; the ADR's Decision, Alternatives, Why-chosen and Consequences paragraphs |
| Both reviewers re-verified v4's eleven AC-4.5 rows, R-f′'s arithmetic, the E2a/E2b/E2c reservoir fixes, the §2.9.3 exposure decoupling and the R15 two-row correction as correct | **[BOTH]** | No action — recorded because it is what let this round's attention go entirely to the boundary and to MAJOR-1 |

### Carried forward unchanged from v4 (neither round-4 review challenged these)

DOM/CSS + inline SVG rendering (Decision A); the single-IIFE seven-section structure (C1); click-toggle for all **graded** mechanics (B3) with AC-3.3b's three reveal conditions and the v0.4 ergonomics gate (R2b); the `state` + delegated-events model (D1), round 1's separate renderers (D1a) and R1-as-one-screen (D1b); annotated-string authoring with derived keys (F1), AC-1.6/1.6b, and the 조사 rule (F1b); the `@@ summarize>` unit grammar and R-m2's declared-unit granularity; F1d's disjoint-region composition rules (R-c1/2/3); the earned-gauge model **G2**, `baselineAward(k,N)`, **R-f′ itself**, the R-a exclusivity rule, R-e's pinned `boomerangDelay = 2`, the 3-segment display and the dead-bonus mitigations AC-4.7/4.8/4.8b/4.9/4.12; **reading (a)** of 검증없이제출 with (a′) evaluated and declined, and the C1/C2 clauses of the ordered clause set; the entire Decision E reservoir design (E-a + E-c, E2a/E2b/E2c, AC-1.8 I-1…I-4); the v0.1.5 부메랑 스파이크 stage; drain-at-interstitial (E1a); AC-3.10's byte-identical recognition beat and R16; AC-2.6's 거절 affordance; AC-2.4's `…외 N건` device; AC-2.7's forbidden risk-type bulk select (now with a second stated reason); AC-5.5b's wrong-verification-tool outcome; AC-5.9's exactly-5-candidates and AC-5.10's re-scoped decoys; §2.8's 원문대조 assignment and AC-5.11; §2.9.3's exposure/tier decoupling; AC-6.1–6.4's badge rules; AC-7.1–7.6 including AC-7.4's derived `gearTurnIndex`; AC-8.3/8.3b's three-branch safety card; AC-8.4–8.7's ending outputs and R18's scope reduction; §2.7's eight-criterion DEMO_MODE decision; R15's two-row shortfall ladder and AC-9.3b's widened exemption; the §11 correspondence-table method with S5.5 as a dedicated audit; every PRD-verbatim Korean string; and risks R2, R3, R4, R5, R7, R8, R9, R11, R12, R13, R14, R16, R17, R18, R19.

### Not resolvable inside this plan — the complete list, all routed

Everything below is either a **PRD-author decision**, a **human content decision**, or a **playtest reading**. Nothing engineering or arithmetic remains open, and every item names its owner, channel and deadline.

1. **OQ-2, OQ-3, OQ-8 — the missing Day-9 slide content** (13·15·16·20쪽). **PRD-author-dependent.** Routed **S0.2(A)**, blocking before S3.1a, fallback = the in-source ASSUMPTION banner plus a v1.0 sign-off line. OQ-2 carries extra weight now: the risk taxonomy is both AC-9.3's proof input **and R-g's coverage denominator**.
2. **OQ-4's copy set — 18 items, ~30 new Korean lines plus ~29 inline replacement values and ~5–7 요약 sentences.** **Human content decision.** The plan specifies what must exist, where it renders, when it is due, and makes absence a boot error — but the lines themselves, and their *quality* (plausibility, order of magnitude, distinctness, summary fidelity), need a human content owner. Routed to the content owner with S5.5's four read-through questions as the acceptance rubric.
3. **OQ-10 — the reading of 검증없이제출.** **PRD-author-dependent, working resolution in place.** Routed **S0.2(B) Q2**, run 10 as discriminator, one-predicate reversal.
4. **OQ-12(i) — ratification of R-f′ + R-g.** **PRD-author-dependent, working resolution in place.** Routed **S0.2(B) Q6(i)**. The Planner has taken every decision here that is a Planner's to take, including θ; what remains is the author confirming the register, and the one alternative the Planner cannot take (charging 거절, which breaks a PRD literal).
5. **OQ-12(ii) — should a run containing any raw send be eligible for `AI 네이티브`?** **PRD-author-dependent, genuinely undecided.** The discriminators are **runs 14a (72/67, two tool applications — the cheapest route), 14b (72/60, exactly on the threshold) and 14 (72/68, the class maximum)**. **No single flat 보안 threshold closes the class at N = 5**; three closures are written out and routed: **(α)** the structural rule **R-h** (the only one that holds at every card count), hooked at S5.1; **(β)** a score-only flat 보안 **69** at the shipped default N = 6 alone; **(γ)** a per-card-count threshold triple. Routed **S0.2(B) Q6(ii)**, deadline v0.4.
6. **OQ-5 — the 보안 threshold, and the playtest register reading on θ.** **Playtest- and PRD-author-dependent.** The threshold is bounded below by clause B's computed region; θ is *decided* (0.7, on a grade-invariant plateau) and only its *feel* is deferred, phrased for testers as "2개까지는 봐주고 3개부터는 그대로 처리 — 맞나?". Routed to the v0.4 gate, steps 12(a) and 12(b).
7. **OQ-11 — 6 cards vs 4.** **Playtest-dependent.** PRD §13's own question; needs round-1-inclusive timing that does not exist until v0.4. A trim also moves both frontiers, which the audit re-reports.
8. **OQ-6, OQ-7, OQ-9 — card ordering, boomerang ownership, and the index readings.** **PRD-author-dependent, non-blocking.** Working assumptions ship; routed **S0.2(B) Q3/Q4/Q5**.
9. **Phone-width scroll depth** on 200-token cards is mitigated but not solved; AC-2.5 and R5 record it honestly rather than claiming PRD §13's mobile item is retired.
10. **The v0.1.5 stage is a deviation from PRD §12's stage table** and should be ratified as one at S0.2.

---

## 11. Round-5 review merge — changelog for this filing

**Round 5 outcome: APPROVED by both independent reviewers.** The round-5 Architect review and the round-5 Critic review were run without sight of each other. Both re-derived the scoring arithmetic independently, both re-checked the fourteen reference runs and both machine-checked frontiers, and **both recommended approval. Neither found a blocking defect.** What follows is the complete list of their accepted, explicitly non-blocking improvement suggestions, merged into this file before filing.

**Nothing in this merge changes a rule, a constant, an acceptance criterion or a gate in substance.** Every edit is either a prose/disclosure-accuracy correction, an additional worked example of an already-disclosed class, an authoring note, or a documentation note. The θ = 0.7 coverage boundary, the flat 보안 60 threshold, R-f′, R-g, the fourteen reference rows, the six audit clauses and all margins (29 / 10 / 20) are **unchanged**.

### Applied — from the round-5 Critic (both MAJOR-severity, both explicitly non-blocking)

| # | Finding | What changed |
| --- | --- | --- |
| **C5-1** | **The plan characterized the disclosed one-card residual through run 14 alone (72/68, four tool applications on card 6), which is not the cheapest member of that class.** The Critic independently found and verified two cheaper members: one reaching **업무 72 / 보안 67 with only TWO bulk applications** (card 2 — `문단 전체 선택` + `익명화` over the 5-name 참석자 문단, then a single `요약` collapse over the 논의 본문 unit), and one reaching **exactly 업무 72 / 보안 60**, the threshold's own boundary value, with **three** applications on card 6. Routing the question with only the expensive example attached understates how cheap the gap is. | **Runs 14a and 14b added as fully worked rows in §2.6.5**, with their per-card arithmetic, and surfaced everywhere the residual is disclosed: **§2.6.6's "boundary of the claim"**, **AC-8.1b's scope note**, **R20 (f2)**, the **S0.2(B) Q6(ii)** packet, **OQ-12(ii)**, **OQ-5's discriminator list**, decision row 22, §9 item 3, and the ADR's Consequences and Follow-ups. **The v0.3 gate's step 18 — which previously played only run 14 — now plays all three by hand, cheapest first**, with an explicit gesture count on 14a and an `≥`-semantics check on 14b. **No rule, constant or AC changed**; the class maximum clause B2 asserts is still 68 / 90 / 85. |
| **C5-2** | **An overstated "provably impossible" claim about the 5-card fallback configuration.** The plan stated in absolute terms that *no* 보안 threshold can separate the disclosed exploit from a careful-but-imperfect legitimate run at N = 5. The Critic recomputed this and found the claim true only for a **single flat threshold shared across all card counts**: a **per-card-count-scaled** threshold of roughly **91 at N = 5** *does* separate them, excluding the exploit (90) while admitting a careful player who uses **maximum** verification effort (≈98) rather than minimal (88). | The absolute phrasing is replaced everywhere with the precise version: **flat** closure is impossible at N = 5; **scaled** closure is possible there, at the cost of abandoning the flat-threshold design and of effectively requiring near-maximal verification from a careful player at that card count. Corrected in **§2.6.6**, **AC-8.1b**, the **S0.2(B) Q6(ii)** packet, **OQ-12(ii)**, **R20 (f3)**, §9 item 3, §10's MINOR table and §10's closing list. **The recommendation is unchanged** — the decision still routes to the PRD author; only the supporting arithmetic claim is now accurate rather than overstated. |

### Applied — from the round-5 Architect (all MINOR, all non-blocking)

| # | Finding | What changed |
| --- | --- | --- |
| **A5-1** | No stated behaviour for applying a 1:1 masking tool to a token that has **neither** a matching `neutralizedBy` entry **nor** an authored `>대체값` — there is no string to substitute and R-m1 forbids an empty one. | **R-c4 added** next to R-c3, in the same refusal-rule pattern: refuse with an inline message. **Deliberately narrow** — a wrong-type tool applied to a token that *does* carry an authored value still applies (AC-4.10's "wrong tool, still 미가림" case is untouched), and grades are unchanged either way. Reflected in **AC-5.2b**, **S2.1's deliverables**, **OQ-4 item 12** (now four refusal messages) and decision row 13c. |
| **A5-2** | Card 6's **핵심 조항** unit mixes two different masking-technique-required risk types (`biz_id` → 마스킹, `confidential_amount` → 익명화) in one bulk-selectable block, so the plan's "bulk selection is safe because later selections do not destructively overwrite earlier ones on the same span" guarantee is only explicitly true for card 2's homogeneous 참석자 문단. | **Authoring note added to S3.1b:** author the 핵심 조항 as **two** consecutive 요약-ineligible blocks (거래처명 ×2, 금액 ×2) so `문단 전체 선택` addresses one technique's tokens at a time. **R stays 8, need stays 6, clause F3 is unaffected (2 < 6 either way), and the application count in runs 14b / gate step 18 is unchanged.** |
| **A5-3** | "The only closure available is structural" overstates the case — it is true only under the requirement that closure hold identically across **all** shipped card counts simultaneously. | Softened wherever it appears. **Three options are now presented together** to the PRD author: **(α)** the structural rule **R-h** — still the only one holding at every card count; **(β)** a **purely score-based** closure at the shipped default N = 6 alone, where a flat 보안 **69** excludes the whole disclosed class (68 / 67 / 60) while still admitting the careful-but-imperfect run (75, 85 with the ⚙), with **no new rule at all**; **(γ)** a per-card-count threshold triple. Applied in **§2.6.6**, **AC-8.1b**, **S0.2(B) Q6(ii)**, **OQ-12(ii)**, **OQ-5**, **R20 (f)**, §9 item 3, and the ADR's Consequences and Follow-ups. |
| **A5-4** | The fallback ladder's documentation did not note that trimming the card set also breaks the literal reproducibility of a PRD reference number. | **One documentation sentence added to R15:** §5's 설계 의도 outcome **「전부 그대로 → 업무 90」** reproduces exactly only at **N = 6**; it scales to **75 at N = 5** and **60 at N = 4**. The property the PRD asserts still holds at every card count and AC-9.4 already scales `taskPerCard`, so quadrant classification is unaffected — but a reviewer checking the printed figure at a trimmed count should be told, not left to file it as a defect. **Not a rule change.** |

### Also applied at filing (housekeeping, not review findings)

- The document was retitled and given the **PENDING APPROVAL** status block at the top, recording the 5-round consensus process, both round-5 approvals, and the explicit prohibition on beginning implementation before a human approves.
- **§0 "Summary for the approving human"** was added — what the plan builds, the staged v0.0 → v1.0 plan, an honest account of what the five rounds found and fixed, and the six genuinely-open items that need a human. §§1–10 are unchanged in substance and remain authoritative where the summary compresses them.
- Section numbering of §§1–10 was left untouched so every internal cross-reference in the plan still resolves.

### Round-5 reviewer items deliberately NOT actioned

None. Both reviews' findings are merged in full. No round-5 finding was judged to require re-deriving arithmetic, and none was declined.

