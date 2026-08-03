 # Checkout Release Passport — Separate-Repository Browser Acceptance Demo

[![Separate-repository browser acceptance demo](https://github.com/Muhammad-Zonain/checkout-release-passport-consumer-proof/actions/workflows/consumer-proof.yml/badge.svg)](https://github.com/Muhammad-Zonain/checkout-release-passport-consumer-proof/actions/workflows/consumer-proof.yml)

This repository is maintained by the creator of Checkout Release Passport.

It demonstrates that a separate caller repository can run the published
Checkout Release Passport v0.3.1 Action in browser capture mode.

## Verified acceptance sequence

The repository-owned checkout fixture is tested in three controlled states:

- Unchanged checkout → `PASS`
- Harmless controlled script change → `REVIEW_REQUIRED`
- Restored checkout → `PASS`

The workflow verifies that every generated passport reports browser capture
mode and checks the caller repository, Action provenance, expected decision,
and canonical passport digest.

## Immutable Action reference

```yaml
uses: Muhammad-Zonain/checkout-release-passport@4cf7cf45a39bbdca6891be60b96a7590a8d61d31 # v0.3.1
```

## Latest verified run

[View the successful browser acceptance run](https://github.com/Muhammad-Zonain/checkout-release-passport-consumer-proof/actions/runs/30803025860)

The run produces separate evidence artifacts for:

- Unchanged checkout
- Controlled script change
- Rollback

Each artifact contains the release passport, comparison, snapshot, and
readable HTML report.

## Scope

The fixture is harmless and repository-owned. It does not submit a checkout
form, collect payment data, attempt authentication, or inspect a third-party
checkout.

## Disclosure

This repository is maintained by the creator of Checkout Release Passport.

It demonstrates cross-repository installation and a browser-mode fixture
acceptance sequence.

It is not an independent audit, external customer validation, certification,
PCI DSS assessment, or third-party endorsement.

It does not demonstrate production security, complete attack prevention, or
continuous production monitoring.
