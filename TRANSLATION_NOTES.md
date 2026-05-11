# Translation Notes — bounty.html → bounty-zh.html (Simplified Chinese, zh-CN)

Translator: Claude Opus 4.7 via Anthropic API
Date: 2026-05-11
Source: `/tmp/sameasyou-site/bounty.html` (English)
Target: `/tmp/sameasyou-site/bounty-zh.html` (Simplified Chinese)
Intended audience: Mainland-China-based and Sinophone security researchers (Pwn2Own / Tianfu Cup caliber, university crypto/security researchers, IACR-paper readers)

These notes are intended for John Bradley and for any native-Chinese-speaking reviewer who looks at the rendered page before public distribution. Every item flagged "REVIEW" below is a place where a native reader's eye is wanted before claiming the translation is shippable.

---

## 1. Core protocol terminology

| English | Chinese rendering used | Rationale | Confidence |
|---|---|---|---|
| Bradley-Gavini Protocol | `Bradley-Gavini 协议` | Personal names stay Latin. `协议` = "protocol" — standard in Chinese networking/crypto papers. | High |
| Origin-Bound Attestation Chain (OBAC) | `源绑定证明链 (OBAC)` | `源` = origin/source, `绑定` = bound (verb-adjective standard in CS Chinese), `证明链` = attestation chain. The acronym OBAC is preserved verbatim. | Medium-High. An alternative is `源签名证明链` (origin-signed) but "bound" carries the cryptographic meaning of binding/commitment more precisely than "signed", so I kept `绑定`. **REVIEW: a native Chinese cryptographer may prefer `源约束证明链` or `源锚定证明链` (anchored).** |
| Alignment-Verified Synthesizer (AVS) | The term does not appear by name in `bounty.html` — only the acronym AVS does, in the sentence listing `BGP/OBAC/AVS/HARP`. The acronym is preserved verbatim with no Chinese gloss inline. | Note: `index.html` uses "Alignment Verification Service" for AVS, while the task brief lists "Alignment-Verified Synthesizer". There is an inconsistency in the source English. I did not coin a Chinese expansion for it in this page — the acronym alone is sufficient for the bounty context. **REVIEW: when AVS is given a stable Chinese expansion sitewide, this page should be re-synced.** Suggested candidates: `对齐验证服务 (AVS)` matching index.html, or `对齐验证合成器 (AVS)` matching the brief. | Medium — depends on canonical decision |
| Halt-and-Rescue Protocol (HARP) | `停止-救援协议 (HARP)` | Literal: `停止` = halt, `救援` = rescue. Preserves the hyphenated structure. | Medium-High. **REVIEW: an alternative I considered was `终止与接管协议` (terminate-and-take-over), which a Chinese reader may find more idiomatic for what HARP actually does. The literal rendering keeps the acronym mnemonic intact (Halt + Rescue → 停止 + 救援) which I think the original author values, so I kept the literal. Note also that `index.html` uses "Halt-and-Replay" not "Halt-and-Rescue" — that's an English-source inconsistency that I did not try to resolve.** |
| AI alignment | `人工智能对齐` | Established term in the Chinese AI-safety literature (used in Chinese translations of Anthropic, OpenAI, ARC papers). | High |
| deployment-relevant subset of AI alignment | `与部署相关的人工智能对齐子问题` (in the body) and `部署阶段的AI对齐` (in shorter phrasings) | Two registers: long form for the technical claim, shorter form for prose. `子问题` = sub-problem, which preserves the careful "subset" framing. | High |
| autonomous AI organization | `自主AI组织` | "AI" left as Latin-acronym (very common in Chinese technical writing). `自主` = autonomous/self-directed; `自治` = self-governing is the alternative but reads more politically loaded. `自主` is the safer technical-paper register. | High |
| AI Agent | Did not appear in this page. If it appears in sister pages, prefer `AI Agent` left in Latin or `AI 代理`. | — | — |
| bug bounty | `漏洞赏金` | Established standard. | High |
| watermark / watermarked trace | `水印` / `带水印的执行轨迹` | Standard. | High |
| zero-knowledge / commitment / Pedersen / Σ-protocol | Not surfaced by name in `bounty.html`. The technical underpinnings live in `index.html`. | — | — |

## 2. The "mandate" disambiguation (important)

The task brief flagged that English `mandate` has two senses on the site:

- **Sense A — operating principle / charter / governing rule** (e.g. "act against its mandate", "the mandate's plain English"). I rendered this as **`运行准则`** throughout, except where contextual flow made `公开运行准则` (public mandate) more readable. `运行准则` literally reads "operating principles" and is the register a Chinese security paper would use for a system's published normative ruleset.
  - I deliberately did *not* use `授权` (mandate-as-authorization), because in Chinese `授权` strongly connotes payment / agency / delegation, which would confuse the bounty / payment language elsewhere on the page.
  - Alternative I considered: `章程` (charter), which is more legalistic; or `指令` (directive), which is too imperative-singular. `运行准则` won on register fit.
- **Sense B — financial authorization** — does not appear in this document.

**REVIEW: a Chinese AI-safety academic reader may suggest `章程` over `运行准则`. Both are defensible. I prefer `运行准则` because the source English emphasizes the *plain-English* readability of the mandate text by any third-party reviewer — `运行准则` reads more like an operational document, `章程` reads more like a corporate constitution.**

## 3. Currency, numerals, and dates

- **Currency policy: chose `100美元` (100 USD spelled out) over `$100`.**
  - Reason: Chinese technical writing prefers the unit suffix (`美元`, `元`, `欧元`) over the Latin currency symbol. The dollar symbol is read but the suffix is more natural in continuous prose. Consistent across the entire page.
  - The compound-amount ranges (e.g. $200–$500/hour) are rendered as `200–500 美元/小时` with the en-dash preserved.
  - Larger tiers: `1,000美元、10,000美元、100,000美元` — used the Chinese serial comma `、` between enumerated items. I did NOT switch to the Chinese myriad-grouping (万 = 10K) because the source uses Latin-numeral grouping and Chinese technical readers handle both natively; keeping Latin grouping preserves the source's hyperlink integrity to the original tiers.
- **Numerals: Latin numerals throughout** (standard in Chinese technical writing).
- **Dates: kept ISO-8601** (`2026-05-11`) — standard in Chinese technical writing and avoids Chinese-numeral-date ambiguity.

## 4. Register and tone

- **Register choice: technical-academic, mid-formal.** This is the register of IACR Chinese papers, ACM-China translations, Tsinghua / SJTU / Fudan crypto group writing. It is more formal than tech-blog Chinese (e.g. 36Kr, InfoQ China) but less formal than legal Chinese.
- **Pronoun choice for the reader: `您`** (formal "you") throughout. The English source uses "you" which is informal; Chinese academic register defaults to `您` when addressing peer professionals. This is the respectful address used when writing to recipients whose expertise the author honors. The task brief specifically asked for "respectful — these researchers are world-class and should be addressed as peers", which is exactly what `您` carries.
- **Headings: kept terse and noun-phrase form** (e.g. `奖金池`, `挑战`, `规则`) rather than verbose alternatives (e.g. `奖金池详情`). Chinese technical-document headings strongly prefer the terse form.
- **Avoided US-marketing-ese.** I removed exclamation-energy and "you can do this!" warmth where it appeared in the English source's hiring section, and used flatter, more declarative Chinese.

## 5. Specific phrases I want a reviewer to check

These are the lines where my confidence is lowest:

1. **`让我们的AI组织偏离对齐目标`** — for "Misalign our AI org."
   - `偏离对齐目标` = "deviate from the alignment objective". This is a technical paraphrase of "misalign" rather than a literal translation. The literal `失准` (mis-calibrated) is too narrow; `对齐失败` (alignment failed) loses the *causative* sense ("YOU make it misalign"). I chose `让...偏离对齐目标` ("make ... deviate from the alignment objective") because it preserves the active causative voice of "Misalign our AI org" in the imperative form.
   - **REVIEW** — a native reader may suggest `让我们的AI组织失准` or `攻破我们AI组织的对齐` (break the alignment).
2. **`运行准则的明示文义`** — for "the mandate's plain English".
   - `明示文义` is a legal-Chinese phrase for "the plain meaning of the text". `平白英语` (literally "plain English") is jarring in Chinese because there is no plain-English convention. `明示文义` correctly captures the underlying concept: the literal, unambiguous textual meaning that a reviewer would read on the face of the document.
   - **REVIEW** — this is a register call; a different translator may prefer `字面含义` (literal meaning) which is plainer.
3. **`现场可证伪性测试 · 现已开放`** — for "Live Falsification Test · Open Now".
   - `现场` = live/on-site, `可证伭性` = falsifiability, `测试` = test. Reads correctly to a Chinese philosophy-of-science or security reader. A native reader may prefer `实时` (real-time) over `现场` (live/on-site) — both are defensible.
4. **`完美的欺骗性对齐`** — for "perfect deceptive alignment".
   - This is the established Chinese term used in translations of Hubinger et al.'s "Risks from Learned Optimization" and related AI-safety papers. Confidence: high.
5. **`内嵌优化`** for **mesa-optimization** — included parenthetically with the English term `(mesa-optimization)` for the reader who knows the English-language literature. `内嵌优化` is one of three competing Chinese renderings (others: `次级优化`, `内层优化`); I included the English in parens for safety. **REVIEW.**
6. **`安全港`** for "safe harbor" — established legal Chinese term in privacy/data-protection literature, used unchanged. Confidence: high.
7. **`电汇`** for "wire (international)" — standard banking term. Confidence: high.
8. **`首次提交有效演示者获奖`** — "first valid demonstration wins it" rendered as "the first submitter of a valid demonstration wins the prize". Slightly more explicit than English; better in Chinese which is less tolerant of pronoun gaps.
9. **`让我们的自主AI组织偏离对齐目标`** as the recurring action phrase — used `偏离对齐目标` consistently throughout. **Consistency note for reviewer: I did NOT vary this between sections; this is intentional, not lazy.**

## 6. Things I deliberately did NOT translate

Preserved in their original English/Latin form:

- All hyperlinks (URLs).
- All email addresses (`bounty@sameasyou.ai`, `press@sameasyou.ai`).
- All GitHub references (`github.com/CrunchyJohnHaven/calm-vault`, `calm-vault/issues`).
- All personal names (`John Bradley`).
- All cryptocurrency / payment processor names (`Stripe`, `USDC`, `Ethereum`, `Base`, `Polygon`, `Cloudflare`).
- All four-letter protocol acronyms (`BGP`, `OBAC`, `AVS`, `HARP`).
- Hash strings, SHA-256 digests (none appeared on this page but the pattern is established).
- ISO-8601 dates and SHA-format identifiers.

## 7. Navigation: language toggle implementation

Added at the right edge of the existing `<nav>` element on both `bounty.html` and `bounty-zh.html`. Implementation:

- Uses `margin-left:auto` in the new `.lang-toggle` flex item to push it to the right.
- On mobile (≤560px), the toggle wraps to a full-width row below the nav.
- The current language is rendered in white (`#fff`) matching the existing `nav a.current` convention.
- The inactive language is a clickable link to its counterpart.
- `<link rel="alternate" hreflang="…">` tags added to both files for search-engine-correct alternate-language signaling.

## 8. Idioms I could not translate one-to-one

- **"Pull requests with translations are welcome"** — kept the technical term "Pull Request" untranslated (`欢迎在 … 提交翻译的 Pull Request`). This is universal in Chinese open-source culture; translating it as `合并请求` is technically correct but reads as overformal and not how Chinese developers speak.
- **"Statute of limitations"** — rendered as `有效期` (validity period) rather than the literal `诉讼时效` (prescription period), because the latter is a strict legal-jurisprudence term that would be misleading here (no actual statute is invoked; it's a policy validity window).
- **"Safe harbor"** — rendered as `安全港` per established usage in Chinese data-protection law. The semantic transplant is clean.
- **"Subsequent valid demonstrations of different vulnerabilities get public credit AND a paid follow-up engagement offer"** — the AND-emphasis in English (capitalized "AND") was rendered in Chinese as a clear two-clause sentence with `以及` connector and full enumeration of both rewards. Chinese doesn't have the same all-caps emphasis convention.
- **"$100 is small enough that we can lose it and survive"** — rendered as `100美元小到我们可以承担损失而生存`. Slightly more formal than the English. A native reader may prefer `100美元金额很小,我们可以承担损失` which is plainer.

## 9. Things that may need John's explicit decision

1. **AVS expansion sitewide.** `index.html` says "Alignment Verification Service", brief says "Alignment-Verified Synthesizer". Pick one; resync.
2. **HARP expansion sitewide.** `index.html` says "Halt-and-Replay Protocol", `bounty.html` says "Halt-and-Rescue Protocol", brief says "Halt-and-Rescue". Pick one; resync. The Chinese rendering here is `停止-救援` matching `bounty.html`.
3. **Domain handling: `sameasyou.ai`** in URLs — left unchanged. If you ever stand up a `.cn` or `.中国` mirror for in-China reachability (`.ai` resolves but may be slow), tell me and I'll update the alternate-language signals.
4. **The chair / reviewer panel.** The Chinese text says `选自公开的AI安全研究社区,并在提交时具名公布`. If the review panel is going to be a defined named entity (e.g. "Calm Alignment Review Panel"), specifying that in the Chinese version may carry more authority with academic readers.

## 10. Font / typography

- Used a Chinese-aware font stack: `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei"` as fallbacks after the Latin stack. These are the macOS / Windows defaults that Chinese readers expect. On Linux / unusual environments, the page falls through to system sans-serif.
- Increased the base `line-height` from `1.55` to `1.7` on the body — Chinese typography needs more vertical breathing room than Latin because of dense glyphs.
- Set `blockquote font-style: normal` (English source had `italic`). Italic-rendered Chinese characters look distorted in most browsers; the convention in Chinese typography is to use a different color or a left border (which I retain) instead of italics.
- Reduced `h1` font-size somewhat (`clamp(36px,5.5vw,56px)` vs source `clamp(40px,6vw,64px)`) — Chinese characters are visually denser per glyph; the same display weight is achieved at smaller sizes.
- Header `letter-spacing` reduced from `-0.02em` to `-0.01em` for h1 because tight letter-spacing reads awkwardly on Hanzi.

## 11. Self-assessment

I would put this translation at **roughly 80–85% ship-ready**. The terminology choices are defensible from the IACR / CCS-Asia register and the tone is correct for the audience the brief described. What it needs before publication:

- A pass by a native Chinese-speaking AI-safety researcher (ideally someone who has read or translated alignment papers in Chinese before) — specifically to validate items 1, 2, 5 in §5 above and to confirm `运行准则` vs `章程` for "mandate".
- A pass by a native Chinese-speaking security researcher — to confirm the hiring-section register feels respectful-peer rather than vendor-talking-down.
- If reachability inside Mainland China is in scope, a quick check of whether any phrase or any external link triggers GFW-level blocking. (No phrase in this translation references anything politically sensitive, but `github.com` links are intermittently slow from the mainland and that may affect engagement.)

If a reviewer-pass surfaces issues, I'd appreciate seeing the specific edits — I can then propagate the same terminology choices to future translations (Russian, Hindi, Hebrew per the source page's stated roadmap) for consistency.
