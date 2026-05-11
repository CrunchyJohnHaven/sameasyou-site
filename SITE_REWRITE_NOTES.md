# Same As You — site rewrite notes

**Date:** 2026-05-11
**Author:** Calm (Claude Opus 4.7) on behalf of John Bradley
**Status:** Local only. Not pushed. Awaiting John's approval to deploy.

## Summary of the pivot

Primary brand for both book and product is now **Same As You.** The long-form title becomes the subtitle:

> Autonomous AI Orgs: All you need to know is I'm the same as you. How to design AI for the future.

Tone shifts from product-marketing to a personal, meta-artistic statement framed around radical transparency and a falsifiable claim.

## What changed

### `index.html` (rewritten in place)

- **Hero.** New H1 leads with the tagline directly — `All you need to know is I'm the same as you.` — preserving the existing gradient on that phrase. Subtitle: `Autonomous AI Orgs · How to design AI for the future.`
- **The frame.** New section using John's verbatim pull-quote (`I myself am this cancelled figure…`). His voice; attribution to him.
- **The claim.** Tightened to the philosophy-thesis language: `deployment-relevant subset of AI alignment` and `coordination and accountability subset` — not "we've solved alignment." Links to `/bounty.html`.
- **The technology.** Replaced the prior "how it works" + properties table with the four named primitives, one sentence each:
  - BGP — Bradley-Gavini Protocol
  - OBAC — Origin-Bound Attestation Chain
  - AVS — Alignment Verification Service
  - HARP — Halt-and-Replay Protocol
- **Origin story.** Preserved verbatim from the prior site (John's family WhatsApp text).
- **Authors.** Kept John / Koushik / Calm. Tightened Koushik's bio to the precise public-record description (Head of Blockchain Engineering at Charles Schwab; Hyperledger Fabric contributor) per the memory rule against invention. Removed `Creativity Machine LLC, Delaware` line from John's entry (was speculative scaffolding, not in evidence for this site).
- **Bug bounty teaser.** Brief block linking to `/bounty.html`.
- **The book.** Title card now `Same As You` with the full subtitle line. Forthcoming.
- **Independent timestamp anchors.** Expanded list: prior 4 anchors plus this repo, Resend logs (private), Cloudflare zone activation, family WhatsApp, K&K thread. Noted that the list will grow as anchors are independently confirmed.
- **Footer.** License note changed from `Apache 2.0` to "MIT-style permissive" per brief. Added Repo + Calm Oath + Contact.
- **Navigation.** New top-of-page nav bar across all four pages: Home · Bounty · Attest · John · GitHub. `current` styling on the active page.

### `bounty.html` (new)

- Hero: "Falsify the claim."
- Pool box: explicit `$0 — pending funding announcement May 12, 2026, 9:00 AM ET.`
- Full tier table — seven tiers, replicated exactly per brief (Documentation $100 → Complete deceptive-alignment $100K → Halt-quorum bypass $50K).
- Rules: submission path, public OBAC attestation, 90-day statute of limitations, originality, scope, safe harbor.
- "Acknowledged breaks" section — empty placeholder, will grow.
- Page weight 9.3 KB.

### `attest.html` (new)

- Hero: "See something, say something."
- Explains OBAC as append-only public log of signed statements about any subject (human or AI).
- Rules: anyone can submit; subjects can annotate but not delete; attestation is permanent; falsity is itself attestable.
- v1 = command-line tool (`obac.py` forthcoming inside `calm-vault`); sample CLI flow shown.
- v2 = web form, forthcoming.
- Closing pull-quote from John: `Persecute me, but at least align to the facts…`
- Page weight 7.0 KB.

### `john.html` (new)

- Per the brief: intentionally held slot.
- Renders just `John Bradley` + `Same As You — Personal Chain — Coming Soon.`
- A small note clarifies the first entries on this personal chain will be authored by John on his timing.
- **No medical-history claims rendered.** Per the no-invention rule and John's own instruction that he will add specifics himself.
- Page weight 2.9 KB.

## Constraints honored

- Pure HTML + inline CSS. No JS framework, no build step.
- Dark mode, system font, no images, fast.
- Each page under 30 KB (largest is `index.html` at 12.0 KB).
- Mobile responsive (single media query at 560px breakpoint per page).
- Semantic HTML: `<nav>`, `<header>`, `<section>` with `aria-labelledby`, `<main>` on the John page, `<blockquote>` with attribution, `<table>` with `<th scope="col">`.
- No animations beyond a 1px hover lift on the primary CTA.
- Hero gradient preserved on `I'm the same as you` exactly as in the prior site (same `linear-gradient(90deg,#7fd1ff,#a3a3ff)`).
- Per-page CSS is duplicated by design (no shared file); identical visual system, scoped tweaks per page.
- Internal links use `.html` suffix so GitHub Pages (Jekyll default, no extension stripping) serves them correctly.

## Content constraints honored

- John's voice preserved verbatim where the brief supplied it (the cancelled-figure pull-quote, the origin-story WhatsApp text, the persecute-me-but-align quote).
- No invention about John or Koushik. Specifically:
  - John bio kept to first-principles description ("articulated the autonomous-AI-organization framing…") with no rank, no employer, no location.
  - Koushik bio limited to public-record description in memory: Head of Blockchain Engineering at Charles Schwab; Hyperledger Fabric contributor.
  - "Cancelled figure" framing is rendered conceptually only. No specific medical-history claims appear on any page.
- Claim language uses the precise thesis phrasing (`deployment-relevant subset…coordination and accountability subset`) — explicitly NOT "we've solved AI alignment."
- License: MIT-style permissive per brief; footer reflects that.

## What's still pending for John's review

1. **Deploy.** Local only. John fires `git push origin main` when ready.
2. **Bounty funding amount and announcement copy.** Page currently says `$0 — pending funding announcement May 12, 2026, 9:00 AM ET.` If the amount is decided, update the `poolbox` block in `bounty.html` and re-anchor.
3. **AVS / OBAC / HARP one-line definitions.** I wrote first-pass one-sentence descriptions on `index.html`. John should confirm each is the exact phrasing he wants for the public record before this becomes the canonical reference.
4. **The author bios.** Confirm John's bio paragraph — currently held to "articulated the autonomous-AI-organization framing and recognized the synthesis with Koushik's zero-trust verification tech." No employer, no location, no titles. Add specifics if he wants them.
5. **Independent timestamp anchors.** Several entries are descriptive rather than linked (Resend logs marked private; Cloudflare zone records; family WhatsApp; K&K thread). If John wants to swap any to public-linkable anchors, the list in `index.html#anchors` is the place.
6. **`john.html` content.** Held empty per his instruction. He populates when ready.
7. **Acknowledged breaks list on `/bounty.html`.** Empty placeholder. Will populate as submissions are validated.
8. **Email address `bounty@sameasyou.ai`.** Referenced in the bounty page. Confirm it routes to a mailbox John actually reads (or change to an existing address).
9. **`/john.html` SEO posture.** Currently indexable. If John prefers `noindex` until he authors the content, add a meta robots tag.

## Commit prepared (not executed)

The brief asks for one commit with all changes. Commit message:

```
Same As You site rewrite — primary brand pivot + bounty + attest pages
```

Files in the commit:
- `index.html` (modified)
- `bounty.html` (new)
- `attest.html` (new)
- `john.html` (new)
- `SITE_REWRITE_NOTES.md` (new — this file)

## No push performed

Per brief: changes staged locally; not pushed to `origin/main`. John approves the deploy.
