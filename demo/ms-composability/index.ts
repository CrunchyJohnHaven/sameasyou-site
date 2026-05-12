/**
 * ms-composability/index.ts
 *
 * AAO-Governed × Microsoft Agent Governance Toolkit — composability demo.
 *
 * Demonstrates how the cryptographic-governance layer (BGP mandate-equality,
 * OBAC attested action chain, HARP halt-switch) composes ON TOP OF Microsoft's
 * runtime-enforcement layer (Agent OS / Agent Mesh / Agent Runtime / kill switch).
 *
 * Three wrapper points around MS AGT's public extension surfaces:
 *
 *   1. withBgpGate(interceptor)
 *        → pre-call: run a 2-round Diffie-Hellman Private Equality Test on the
 *          mandate of caller and callee. If their mandates are not byte-equal,
 *          MS AGT's ToolCallInterceptor is never invoked. Sub-ms handshake.
 *
 *   2. withObacAttestation(interceptor, log)
 *        → post-decision: every gated decision is appended (Ed25519-signed,
 *          Merkle-linked) to a public OBAC log entry. The MS AGT policy
 *          decision payload is recorded verbatim alongside.
 *
 *   3. subscribeHarpHalt(runtime, witnessQuorum)
 *        → out-of-band: subscribe to HARP halt-quorum events. On a stake-bonded
 *          witness flip (with no FROST counter-flip within T_c), drive MS AGT's
 *          emergency kill switch via the documented runtime API.
 *
 * Real implementations of BGP / OBAC / HARP primitives live in
 *   github.com/CrunchyJohnHaven/aiap (proto/pet.ts, proto/s5.ts, paper §6).
 * Real MS AGT SDK lives at @microsoft/agent-governance-sdk (npm).
 *
 * This file is the *composition* — ~150 lines that wires the two layers.
 * License: MIT.
 */

// ── 1. Types we depend on from Microsoft AGT (kept narrow / structural) ────
// In a real integration: `import { ToolCallInterceptor, AgentRuntime, ...
// } from '@microsoft/agent-governance-sdk'`. Here we declare the structural
// subset so this file type-checks without the SDK installed.

export interface MSToolCall { caller: string; callee: string; tool: string; args: unknown }
export interface MSDecision { allow: boolean; reason: string; policyId: string; latencyMicros: number }
export interface MSToolCallInterceptor { intercept(call: MSToolCall): Promise<MSDecision> }
export interface MSRuntime { killSwitch(reason: string): Promise<void> }

// ── 2. Types we depend on from AAO-Governed (aiap reference impl) ─────────
// In a real integration: `import { startSession, firstMessage, respondMessage,
// isAligned } from '@credexai/aiap/proto/pet'` (or the npm-published wrapper).

export interface BgpMandate { did: string; directive: string }       // L1 — BGP input
export interface ObacAppendEntry { actor: string; tool: string; decision: MSDecision; ts: string }
export interface ObacLog { actor: string; append(e: ObacAppendEntry): Promise<{ seq: number; root: string }> }
export interface HarpHaltEvent { target: string; reason: string; witness: string; bondWei: bigint; counterFlipDeadline: number }
export interface HarpWitness { subscribe(cb: (e: HarpHaltEvent) => void): void; counterFlipCount(target: string): Promise<number> }

// ── 3. BGP gate: mandate-equality check BEFORE MS AGT sees the call ───────
// Two ZTAAOs each commit to their mandate and exchange two messages. They learn
// only one bit: "equal" or "not equal." Information leaked on inequality: zero.
// See aiap/proto/pet.ts for the production P-256 implementation (12/12 tests).

export function withBgpGate(
  inner: MSToolCallInterceptor,
  mandateOf: (did: string) => BgpMandate,
  pet: { startSession(d: string): unknown; firstMessage(s: unknown): Buffer;
         respondMessage(s: unknown, m: Buffer): Buffer; isAligned(a: Buffer, b: Buffer): boolean }
): MSToolCallInterceptor {
  return {
    async intercept(call: MSToolCall): Promise<MSDecision> {
      const mA = mandateOf(call.caller).directive
      const mB = mandateOf(call.callee).directive
      const sA = pet.startSession(mA), sB = pet.startSession(mB)
      const α = pet.firstMessage(sA), β = pet.firstMessage(sB)
      const αp = pet.respondMessage(sA, β), βp = pet.respondMessage(sB, α)
      if (!pet.isAligned(αp, βp)) {
        return { allow: false, reason: 'bgp:mandate-mismatch', policyId: 'aao-bgp-v1', latencyMicros: 0 }
      }
      return inner.intercept(call) // mandate-equal: hand off to MS AGT for runtime gating
    },
  }
}

// ── 4. OBAC attestation: every decision recorded on the append-only chain ──
// Subjects can annotate entries but cannot rewrite them. CT-style (RFC 9162).
// See aiap/proto/s5.ts for the production Ed25519 + Merkle implementation.

export function withObacAttestation(
  inner: MSToolCallInterceptor,
  log: ObacLog
): MSToolCallInterceptor {
  return {
    async intercept(call: MSToolCall): Promise<MSDecision> {
      const decision = await inner.intercept(call)
      await log.append({
        actor: call.caller,
        tool: call.tool,
        decision,                                  // verbatim MS AGT decision payload
        ts: new Date().toISOString(),
      })
      return decision
    },
  }
}

// ── 5. HARP halt subscriber: drives MS AGT kill switch on quorum flip ─────
// Any witness can flip a stake-bonded halt bit. A FROST quorum of independent
// witnesses can counter-flip during T_c. If no counter-flip, MS AGT kills.

export async function subscribeHarpHalt(
  runtime: MSRuntime,
  witness: HarpWitness,
  opts: { counterFlipDeadlineSec?: number; counterFlipQuorum?: number } = {}
): Promise<void> {
  const deadline = opts.counterFlipDeadlineSec ?? 3600
  const quorum = opts.counterFlipQuorum ?? 7
  witness.subscribe(async (e: HarpHaltEvent) => {
    const waitMs = Math.max(0, e.counterFlipDeadline - Date.now())
    await new Promise<void>(r => setTimeout(r, Math.min(waitMs, deadline * 1000)))
    const ratifications = await witness.counterFlipCount(e.target)
    if (ratifications >= quorum) {
      // Counter-flip succeeded → status is contested, NOT killed. Do nothing.
      return
    }
    // No quorum counter-flip within T_c → drive the MS AGT runtime kill switch.
    await runtime.killSwitch(`harp:halt-upheld witness=${e.witness} bond=${e.bondWei} reason=${e.reason}`)
  })
}

// ── 6. Putting it together: a single composed interceptor + halt subscriber ──

export function composeAaoOverMs(
  msInterceptor: MSToolCallInterceptor,
  msRuntime: MSRuntime,
  primitives: {
    mandateOf: (did: string) => BgpMandate
    pet: Parameters<typeof withBgpGate>[2]
    obacLog: ObacLog
    harpWitness: HarpWitness
  }
): { interceptor: MSToolCallInterceptor; ready: Promise<void> } {
  const bgp = withBgpGate(msInterceptor, primitives.mandateOf, primitives.pet)
  const obac = withObacAttestation(bgp, primitives.obacLog)
  const ready = subscribeHarpHalt(msRuntime, primitives.harpWitness)
  return { interceptor: obac, ready }
}

// ── 7. Example main() — runnable demo with stub primitives ─────────────────
// Replace the stubs with `@microsoft/agent-governance-sdk` + `@credexai/aiap`
// to run against the real toolkit and the real cryptographic implementations.

if (typeof require !== 'undefined' && require.main === module) {
  const msInterceptor: MSToolCallInterceptor = { async intercept(c) {
    return { allow: true, reason: 'ms-agt:policy-allow', policyId: 'demo', latencyMicros: 87 } } }
  const msRuntime: MSRuntime = { async killSwitch(r) { console.log('[MS AGT] killSwitch:', r) } }
  const mandateOf = (did: string) => ({ did, directive: 'serve-the-mandate-faithfully' })
  const pet = {
    startSession: (d: string) => ({ d }),
    firstMessage: (s: { d: string }) => Buffer.from(s.d),
    respondMessage: (_s: unknown, m: Buffer) => m,
    isAligned: (a: Buffer, b: Buffer) => a.equals(b),
  }
  const obacLog: ObacLog = { actor: 'did:demo:alice', async append(e) {
    console.log('[OBAC] append:', e.actor, e.tool, e.decision.policyId); return { seq: 1, root: 'merkle-root' } } }
  const harpWitness: HarpWitness = { subscribe(_cb) { /* no-op for demo */ }, async counterFlipCount() { return 0 } }

  const { interceptor } = composeAaoOverMs(msInterceptor, msRuntime, { mandateOf, pet, obacLog, harpWitness })
  interceptor.intercept({ caller: 'did:demo:alice', callee: 'did:demo:bob', tool: 'transfer-funds', args: {} })
    .then(d => console.log('[COMPOSED] decision:', d))
}
