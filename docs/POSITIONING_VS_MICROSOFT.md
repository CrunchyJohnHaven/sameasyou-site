# Positioning: AAO-Governed vs. Microsoft Agent Governance Toolkit

*One-page strategic note. 2026-05-12.*

## What Microsoft shipped

On April 2, 2026, Microsoft Open Source published the [Agent Governance Toolkit](https://opensource.microsoft.com/blog/2026/04/02/introducing-the-agent-governance-toolkit-open-source-runtime-security-for-ai-agents/) (AGT) — an MIT-licensed, seven-package, five-language (Python · TypeScript · Rust · Go · .NET) open-source runtime-security stack for autonomous AI agents. By v3.5 it carries 9,500+ tests, ClusterFuzzLite fuzzing, SLSA build provenance, an OpenSSF Scorecard, and a stated trajectory toward a neutral foundation home (LF AI & Data / OWASP). It maps all ten OWASP Agentic AI Top 10 risk categories. It enforces policy at sub-millisecond p99 latency via a stateless kernel-equivalent design borrowed from operating systems. It integrates natively with every agent framework in current use — LangChain, CrewAI, AutoGen, the Microsoft Agent Framework, Foundry Agent Service, ADK, LangGraph, LlamaIndex, the OpenAI Agents SDK, PydanticAI, Haystack, Dify.

This is a real piece of infrastructure. It is the right design for the layer it occupies. We should not pretend otherwise.

## The runtime-enforcement layer is now solved (well) in the open

That is good for the field. It is good for AAO-Governed in particular. We do not have to build it. We do not have to argue against it. We do not have to compete with Microsoft on procurement.

Three things AGT does at its layer that we acknowledge as state-of-the-art:

- **Stateless kernel-style enforcement.** Every action is gated by a pre-execution policy check at sub-ms latency. The architectural choice — stateless, horizontally scalable, deterministic — is exactly right for the kernel-equivalent role.
- **Framework neutrality.** AGT plugs into the existing extension points of every major agent framework. There is no proprietary runtime; there is no demand that agent code be rewritten.
- **OWASP alignment.** The 10/10 coverage of the Agentic Top 10 is structurally credible, with the right primitive at each row (semantic intent classification, MCP gateway, DID identity, execution rings, IATP, circuit breakers, approval workflows with quorum logic).

## What the AGT explicitly does not address

The AGT is a *runtime* layer. It answers the question "did this individual action violate the policy?" with sub-ms latency. It does **not** answer three other questions, all of which are *cryptographic* in nature rather than runtime:

1. **Mandate-equality between two agents.** Can agent A and agent B prove to each other that `directive_A == directive_B` *without revealing the directive*? This is a Diffie-Hellman Private Equality Test — a zero-knowledge proof of byte-equality. AGT's Agent Mesh provides DID-based identity and behavioral trust scoring, but no protocol for two parties to verify aligned commitments without disclosure. AAO-Governed's **BGP** (Bradley-Gavini Protocol) is exactly this protocol.

2. **Publicly-attested action chain.** Every action an agent takes can be policy-checked by AGT, but the *history* of those actions lives in an AGT-internal audit log under the vendor's control. There is no public, append-only, cryptographically-linked, subject-annotatable record. AAO-Governed's **OBAC** (Origin-Bound Attestation Chain) is the Certificate-Transparency-lineage Merkle log that makes agent history a public artifact rather than a vendor-controlled record.

3. **Public-quorum halt switch.** AGT ships an emergency kill switch as part of Agent Runtime — but the kill is administered by the operator. There is no path by which an outside witness who *observes* a verified violation can flip a halt bit. AAO-Governed's **HARP** (Halt-and-Rescue Protocol) is a stake-bonded any-witness flip with a FROST threshold counter-flip — any honest observer can pull the halt, and a quorum of registered counter-witnesses can rescue against false halts within `T_c`.

None of these three properties is a policy problem. They are cryptographic problems. They sit *above* the policy engine. They define what the policy engine is enforcing.

## The composability move

Therefore: **AAO-Governed is the cryptographic-governance layer that composes on top of AGT.** Not next to it. Not against it.

Concretely, the composition is wired through AGT's documented public interfaces — `ToolCallInterceptor`, `BaseIntegration`, `PluginInterface`, `PolicyProviderInterface`. The wrapper is on the order of 150 lines of TypeScript (see [`demo/ms-composability/`](../demo/ms-composability/)). Three composition points:

- **Pre-call**: BGP gates inter-agent calls. If the two parties' mandates are not byte-equal, AGT's ToolCallInterceptor is never invoked.
- **Post-decision**: every gated decision is appended to a public OBAC log entry, with AGT's decision payload recorded verbatim alongside.
- **Out-of-band**: a HARP halt subscriber drives AGT's emergency kill switch on quorum flip.

The wrapper is additive. Remove it and AGT runs exactly as before. Swap AGT for any runtime that exposes a comparable interceptor surface and the wrapper still functions.

## Why composability is the durable narrative

Three reasons we frame this as composition rather than competition:

- **The layers are different.** AGT solves runtime enforcement. AAO-Governed solves cryptographic governance — mandate-commitments, attested chains, public-quorum halt. Treating these as alternatives is a category error. A buyer who needs both should not be forced to choose.
- **Procurement asymmetry favors composition.** Enterprises default to Microsoft for reasons unrelated to technical merit — Azure integration, vendor consolidation, MSA terms, audit posture. Asking those buyers to pick a non-Microsoft runtime is asking them to pay a procurement tax. Asking them to add a thin cryptographic layer *on top of* what they already adopted is asking them to use one MIT-licensed library. The path of least friction is the path most buyers will take.
- **Honest credit is durable.** The Microsoft toolkit's open-source posture is real and is being delivered to community standards (MIT, foundation trajectory, OWASP alignment, public fuzzing, public test counts, public Scorecard). Naming Microsoft as the runtime layer and AAO-Governed as the governance layer is the version of the story that survives Microsoft eventually moving AGT into a foundation. It does not depend on us being the only people with public-quorum halt; it depends on us being the people who *defined* public-quorum halt and *shipped the wrapper* that lets it ride on the dominant runtime.

## What this means tactically

- Ship the comparative table and the composability demo together. Both are in this PR.
- Cite AGT by name in every venue. Do not refer to it as "the Microsoft toolkit" euphemistically; refer to it as the *Agent Governance Toolkit*.
- Submit a reference adapter upstream once the wrapper is stable. Open-source norms reward integrations that are framework-native rather than competitive.
- Keep the language layered, not adversarial: *L1 enforces · L2 verifies · They compose*.

## What this means strategically

The failure mode this note mitigates is: "enterprise procurement defaults to Microsoft for reasons unrelated to technical merit; AAO-Governed is locked out of the adoption story." The composability move converts that failure mode into a tailwind. Every AGT adoption becomes a candidate AAO-Governed adoption. We sell into Microsoft's funnel rather than against it.

The cryptographic-governance layer is a real, separable, defensible technical contribution. The runtime-enforcement layer is now an open-source commodity. These are two different things. Compose them.

— *Same As You · 2026-05-12*
