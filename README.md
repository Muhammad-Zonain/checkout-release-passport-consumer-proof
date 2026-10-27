# Checkout Release Passport — Creator-Maintained Consumer Proof

[![Separate-repository browser acceptance demo](https://github.com/Muhammad-Zonain/checkout-release-passport-consumer-proof/actions/workflows/consumer-proof.yml/badge.svg)](https://github.com/Muhammad-Zonain/checkout-release-passport-consumer-proof/actions/workflows/consumer-proof.yml)

[Product website](https://checkout.transferverity.com) ·
[Main repository](https://github.com/Muhammad-Zonain/checkout-release-passport) ·
[GitHub Marketplace](https://github.com/marketplace/actions/checkout-release-passport)

This repository is maintained by the creator of Checkout Release Passport. It is a deterministic product fixture, not independent customer evidence.

## v0.4.1 publication status

The workflow is prepared to test the unpublished v0.4.1 candidate at the immutable Action commit `5e4e634f443fd433b1dc1a7f6fba369fbe3e4f05`. This commit must be pushed to the main Action repository before GitHub can resolve it.

1. Push the Action candidate and require its product-proof, CodeQL and dependency-review checks.
2. Run this consumer pull request's complete browser acceptance workflow at the pinned candidate SHA.
3. Publish only the reviewed revision after both repositories' required checks pass. If the release commit differs, update every Action and expected-provenance SHA here and rerun.
4. Verify the published release's release-integrity artifacts before describing it as a verified release.

Local verification is not a GitHub Actions run. The live website and historical v0.3.1 evidence are preserved; this branch does not claim that v0.4.1 has been published.

## Acceptance sequence

The repository-owned checkout fixture is exercised in three controlled states:

```text
unchanged checkout       -> PASS / NONE
harmless script change   -> REVIEW_REQUIRED / P2
restored checkout        -> PASS / NONE
```

The workflow verifies:

- browser capture mode;
- successful expected checkout page and visible `status` marker;
- caller repository and commit provenance;
- Action repository and immutable revision;
- expected decision and review priority;
- passport, snapshot, comparison, HTML report, monitoring event, and alert payload; and
- canonical content digests.

For deterministic testing, the workflow creates a fresh baseline for its own harmless fixture. Production baselines must instead be reviewed and committed separately.

## Preserved earlier evidence

[View the creator-maintained browser acceptance evidence release](https://github.com/Muhammad-Zonain/checkout-release-passport-consumer-proof/releases/tag/browser-acceptance-2026-08-03).

That preserved release predates v0.4.1. It remains historical evidence of the earlier cross-repository sequence and must not be described as v0.4.1 proof.

## Safety boundary

The fixture is local, harmless, and repository-owned. It does not submit a checkout form, collect payment data, authenticate to another system, or inspect a third-party checkout.

This repository is not:

- an independent audit or external customer validation;
- certification, a PCI DSS assessment, or a QSA opinion;
- a vendor adapter or vendor endorsement;
- production security evidence;
- complete attack prevention, attack blocking, or real-user-session monitoring; or
- proof that a paid partner or customer exists.

The separate functional practice in the main Action repository clicks an owned cart and verifies its total. This consumer workflow remains a script/header evidence test, not a real payment or order-processing test.
