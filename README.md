# Checkout Release Passport — Independent Consumer Proof

[![Marketplace consumer proof](https://github.com/Muhammad-Zonain/checkout-release-passport-consumer-proof/actions/workflows/consumer-proof.yml/badge.svg)](https://github.com/Muhammad-Zonain/checkout-release-passport-consumer-proof/actions/workflows/consumer-proof.yml)

This small repository proves that a separate caller can resolve and run the public Action release referenced by the Marketplace listing:

```yaml
uses: Muhammad-Zonain/checkout-release-passport@v0.3.0
```

The workflow starts a harmless checkout fixture owned by this repository, invokes the released Action, and requires a `PASS` result. It does not collect payment data, submit a form, or contact a third-party checkout.

## What a green run proves

- GitHub can resolve the public `v0.3.0` Action tag.
- The remote Action can create a one-time onboarding baseline in the caller repository.
- The Action installs its own dependencies in a caller repository.
- The caller's approved baseline can be compared with a current observation.
- The Action returns `PASS` and uploads the generated passport, comparison, and HTML report.
- The consumer independently recomputes the passport digest and verifies caller/Action provenance.

## Run it

Open **Actions → Marketplace consumer proof → Run workflow**.

The expected result is a green job whose summary contains `Decision: PASS`.

This is installation and integrity evidence, not PCI DSS certification or a security guarantee.
