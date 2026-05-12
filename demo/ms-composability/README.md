# MS AGT × AAO-Governed — composability demo

A ~150-line TypeScript wrapper that demonstrates how the **AAO-Governed** cryptographic-governance layer (BGP · OBAC · HARP) composes ON TOP OF **Microsoft's Agent Governance Toolkit** (MS AGT) runtime-enforcement layer.

This is a **composability** demo, not a competitor to MS AGT. MS AGT enforces policy at runtime. AAO-Governed adds three cryptographic guarantees MS AGT does not address.

- **L1 (MS AGT)** — runtime policy enforcement, sub-ms latency, framework integrations, OWASP coverage.
- **L2 (AAO-Governed)** — mandate-equality between agents (BGP), public attested action chain (OBAC), public-quorum halt switch (HARP).

See [`/vs-microsoft.html`](https://sameasyou.ai/vs-microsoft.html) for the full comparative table and positioning.

## What this file does

Three wrapper points around MS AGT's public extension surfaces (`ToolCallInterceptor`, `AgentRuntime.killSwitch`):

1. **`withBgpGate(inner, mandateOf, pet)`**
   Pre-call: run a 2-round Diffie-Hellman Private Equality Test on the mandates of the caller and callee. If the mandates are not byte-equal, MS AGT's interceptor is **never invoked**. Sub-ms handshake. Information leaked on inequality: zero.
2. **`withObacAttestation(inner, log)`**
   Post-decision: every gated decision is appended (Ed25519-signed, Merkle-linked) to a public OBAC log entry. MS AGT's decision payload is recorded verbatim alongside.
3. **`subscribeHarpHalt(runtime, witness)`**
   Out-of-band: subscribe to HARP halt-quorum events. On a stake-bonded witness flip with no FROST counter-flip within `T_c` (default 1h), drive MS AGT's emergency kill switch via `runtime.killSwitch()`.

The convenience function `composeAaoOverMs(...)` wires all three into a single composed interceptor + a halt subscriber, returned together.

## Run the demo

```bash
# No dependencies needed — the file ships with stub primitives that run end-to-end.
npx tsx demo/ms-composability/index.ts
```

Expected output (the demo allows a single tool call through both layers, prints the OBAC append, then prints the composed decision):

```
[OBAC] append: did:demo:alice transfer-funds demo
[COMPOSED] decision: { allow: true, reason: 'ms-agt:policy-allow', policyId: 'demo', latencyMicros: 87 }
```

## Run against the real toolkits

Replace the stub primitives in the bottom `main()` block with real implementations.

### Microsoft AGT

```bash
npm install @microsoft/agent-governance-sdk
```

```ts
import { ToolCallInterceptor, AgentRuntime } from '@microsoft/agent-governance-sdk'
// …pass a real ToolCallInterceptor + AgentRuntime into composeAaoOverMs()
```

The MS AGT public interfaces are `ToolCallInterceptor`, `BaseIntegration`, `PluginInterface`, `PolicyProviderInterface` — all stable surface area per [microsoft/agent-governance-toolkit](https://github.com/microsoft/agent-governance-toolkit).

### AAO-Governed (BGP / OBAC / HARP)

Clone the reference implementation:

```bash
git clone https://github.com/CrunchyJohnHaven/aiap
```

Wire its exports into the demo:

```ts
import * as pet from '../../../aiap/proto/pet'        // BGP — DH-PET on P-256
import { createS5Log, appendEntry } from '../../../aiap/proto/s5'  // OBAC — Merkle log
// HARP is described in aiap/paper/AIAP_v0.3.md §6; the witness interface
// modeled here matches the spec.
```

The aiap reference impl passes 38/38 protocol tests across three suites. BGP is ~12 LOC of cryptographic core (Pedersen commitments + Σ-equality on NIST P-256); OBAC is Ed25519 + sha256-Merkle; HARP is stake-bonded any-witness flip + FROST threshold counter-flip.

## What this file deliberately does NOT do

- It does not re-implement MS AGT. Policy enforcement, trust scoring, framework integrations, OWASP coverage — all delegated to MS AGT verbatim.
- It does not re-implement BGP / OBAC / HARP. The cryptographic primitives live in aiap.
- It does not introduce new dependencies on either side. The wrapper is type-only at the boundary; either toolkit can be swapped out without modifying the other.

## Integration shape

```
                        ┌─────────────────────────────────────────┐
   agent-to-agent call  │                                         │
   ───────────────────► │  withBgpGate (L2, AAO-Governed)         │
                        │    ├─ mandate-equality (BGP / DH-PET)   │
                        │    │  fail → reject without entering L1 │
                        │    └─ pass → forward to L1              │
                        │                                         │
                        │    withObacAttestation (L2)             │
                        │    ├─ pass through to MS AGT (L1)       │
                        │    └─ append decision to OBAC chain     │
                        │                                         │
                        │                  ▼                      │
                        │  MS AGT ToolCallInterceptor (L1)        │
                        │    ├─ Agent OS policy engine            │
                        │    ├─ trust scoring (Agent Mesh)        │
                        │    └─ execution rings (Agent Runtime)   │
                        └─────────────────────────────────────────┘
                                          ▲
                                          │ killSwitch(reason)
                                          │
                        ┌─────────────────────────────────────────┐
                        │  subscribeHarpHalt (L2)                 │
                        │    ├─ witness.subscribe(haltEvent)      │
                        │    ├─ wait T_c for FROST counter-flip   │
                        │    └─ no counter-flip → drive L1 kill   │
                        └─────────────────────────────────────────┘
```

## License

MIT. Use freely. Upstream improvements welcome — see [/critics](https://sameasyou.ai/critics.html).

## Credit

- **Microsoft Open Source**, [Agent Governance Toolkit](https://github.com/microsoft/agent-governance-toolkit) (April 2026, MIT) — the runtime-enforcement layer this wrapper sits on top of.
- **Bradley & Gavini**, [AIAP v0.3](https://github.com/CrunchyJohnHaven/aiap/blob/main/paper/AIAP_v0.3.md) — the cryptographic-governance layer this wrapper plugs in.
- **OWASP Agentic Top 10** (December 2025) — the taxonomy both layers map to.
