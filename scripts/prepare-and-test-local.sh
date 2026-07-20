#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/prepare-and-test-local.sh /path/to/checkout-release-passport"
  exit 1
fi

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
action_root="$(cd "$1" && pwd)"
config_path="$repo_root/.checkout-evidence/demo.json"
temp_dir="$(mktemp -d)"
server_pid=""

cleanup() {
  if [[ -n "$server_pid" ]]; then
    kill "$server_pid" 2>/dev/null || true
    wait "$server_pid" 2>/dev/null || true
  fi
}
trap cleanup EXIT

node "$repo_root/scripts/server.mjs" > /tmp/checkout-release-passport-consumer-local.log 2>&1 &
server_pid=$!

for _ in {1..30}; do
  if curl --fail --silent http://127.0.0.1:4174/checkout.html >/dev/null; then
    break
  fi
  sleep 0.1
done

curl --fail --silent http://127.0.0.1:4174/checkout.html >/dev/null
node "$action_root/src/cli.js" baseline --config "$config_path" --ack-authorized --force-baseline
GITHUB_OUTPUT="$temp_dir/check-output.txt" \
node "$action_root/src/cli.js" check --config "$config_path" --ack-authorized

status="$(sed -n 's/^status=//p' "$temp_dir/check-output.txt")"
passport_sha256="$(sed -n 's/^passport_sha256=//p' "$temp_dir/check-output.txt")"
passport_path="$(sed -n 's/^passport_path=//p' "$temp_dir/check-output.txt")"
snapshot_path="$(sed -n 's/^snapshot_path=//p' "$temp_dir/check-output.txt")"
comparison_path="$(sed -n 's/^comparison_path=//p' "$temp_dir/check-output.txt")"
report_path="$(sed -n 's/^report_path=//p' "$temp_dir/check-output.txt")"

test "$status" = "PASS"
env \
  EXPECTED_PROVIDER=local \
  EXPECTED_TARGET_ID=marketplace-consumer-proof \
  PASSPORT_SHA256="$passport_sha256" \
  SNAPSHOT_PATH="$snapshot_path" \
  COMPARISON_PATH="$comparison_path" \
  REPORT_PATH="$report_path" \
  node "$repo_root/scripts/verify-passport.mjs" "$passport_path"

echo "Local consumer baseline and PASS proof created successfully."
