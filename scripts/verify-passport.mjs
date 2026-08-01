import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalize(value[key])]),
    );
  }

  return value;
}

function digest(value) {
  return createHash("sha256")
    .update(JSON.stringify(canonicalize(value)))
    .digest("hex");
}

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

const passportPath = process.argv[2];
const expectedDecision = process.argv[3] ?? "PASS";

requireValue(passportPath, "Missing passport path");
requireValue(
  ["PASS", "REVIEW_REQUIRED"].includes(expectedDecision),
  `Unsupported expected decision: ${expectedDecision}`,
);

const passport = JSON.parse(await readFile(passportPath, "utf8"));

const {
  passport_id: passportId,
  passport_sha256: expectedDigest,
  ...core
} = passport;

const actualDigest = digest(core);

requireValue(
  passport.kind === "checkout-release-passport",
  "Unexpected passport kind",
);

requireValue(
  passport.schema_version === "1.0",
  "Unexpected passport schema",
);

requireValue(
  passport.decision?.status === expectedDecision,
  `Expected ${expectedDecision}, received ${passport.decision?.status}`,
);

requireValue(
  passport.authorization?.confirmed === true,
  "Authorization confirmation is missing",
);

requireValue(
  expectedDigest === actualDigest,
  "Passport digest does not match its content",
);

requireValue(
  passportId === `crp_${actualDigest.slice(0, 20)}`,
  "Passport ID does not match its digest",
);

const expectedProvider = process.env.EXPECTED_PROVIDER;
const expectedRepository = process.env.EXPECTED_REPOSITORY;
const expectedCommitSha = process.env.EXPECTED_COMMIT_SHA;
const expectedActionRepository = process.env.EXPECTED_ACTION_REPOSITORY;
const expectedActionRef = process.env.EXPECTED_ACTION_REF;
const expectedTargetId = process.env.EXPECTED_TARGET_ID;
const expectedCaptureMode = process.env.EXPECTED_CAPTURE_MODE;
const expectedOutputDigest = process.env.PASSPORT_SHA256;

if (expectedProvider) {
  requireValue(
    passport.release?.provider === expectedProvider,
    "Unexpected release provider",
  );
}

if (expectedRepository) {
  requireValue(
    passport.release?.repository === expectedRepository,
    "Unexpected caller repository",
  );
}

if (expectedCommitSha) {
  requireValue(
    passport.release?.commit_sha === expectedCommitSha,
    "Unexpected caller commit SHA",
  );
}

if (expectedActionRepository) {
  requireValue(
    passport.release?.action_repository === expectedActionRepository,
    "Unexpected Action repository",
  );
}

if (expectedActionRef) {
  requireValue(
    passport.release?.action_ref === expectedActionRef,
    "Unexpected Action ref",
  );
}

if (expectedTargetId) {
  requireValue(
    passport.target?.target_id === expectedTargetId,
    "Unexpected target ID",
  );
}

if (expectedCaptureMode) {
  requireValue(
    passport.target?.capture_mode === expectedCaptureMode,
    "Unexpected target capture mode",
  );

  requireValue(
    passport.generator?.capture_mode === expectedCaptureMode,
    "Unexpected generator capture mode",
  );
}

if (expectedOutputDigest) {
  requireValue(
    actualDigest === expectedOutputDigest,
    "Action digest output does not match passport",
  );
}

requireValue(
  passport.generator?.version === "0.3.0",
  "Unexpected generator version",
);

const snapshotPath = process.env.SNAPSHOT_PATH;
const comparisonPath = process.env.COMPARISON_PATH;
const reportPath = process.env.REPORT_PATH;

if (snapshotPath) {
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
  const {
    snapshot_sha256: snapshotDigest,
    ...snapshotCore
  } = snapshot;

  requireValue(
    snapshotDigest === digest(snapshotCore),
    "Snapshot digest does not match its content",
  );

  requireValue(
    passport.evidence?.current_snapshot_sha256 === snapshotDigest,
    "Passport does not bind the current snapshot",
  );

  if (expectedCaptureMode) {
    requireValue(
      snapshot.engine?.capture_mode === expectedCaptureMode,
      "Unexpected snapshot capture mode",
    );
  }
}

if (comparisonPath) {
  const comparison = JSON.parse(
    await readFile(comparisonPath, "utf8"),
  );

  requireValue(
    comparison.status === expectedDecision,
    `Comparison does not contain ${expectedDecision}`,
  );

  requireValue(
    passport.evidence?.comparison_sha256 === digest(comparison),
    "Passport does not bind the comparison",
  );
}

if (reportPath) {
  const report = await readFile(reportPath);

  const reportDigest = createHash("sha256")
    .update(report)
    .digest("hex");

  requireValue(
    passport.evidence?.report_sha256 === reportDigest,
    "Passport does not bind the HTML report",
  );
}

console.log(
  `Consumer passport content, evidence and ${expectedDecision} decision: VERIFIED`,
);
