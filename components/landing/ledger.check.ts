/**
 * Runnable check for the ledger churn rule, no framework:
 *   node --experimental-strip-types components/landing/ledger.check.ts
 *
 * The Active tab is `rows.filter(r => r.active)`. It used to show one row that
 * blinked out and back on every churn; these asserts pin that down.
 */
import assert from "node:assert/strict"

import { churnRows, initialRows, jitterRows, type Row } from "./ledger.ts"

const active = (rows: Row[]) => rows.filter((r) => r.active).length

let rows = initialRows()
assert.equal(rows.length, 5, "seed keeps five rows")
assert.equal(active(rows), 3, "seed starts with three live connections")

// 40 churns ≈ 100s of the real interval, and every intermediate state counts.
for (let n = 1; n <= 40; n++) {
  rows = churnRows(rows, n)
  assert.equal(rows.length, 5, `churn ${n}: list stays five long`)
  assert.equal(active(rows), 3, `churn ${n}: Active tab always shows three`)
  assert.ok(rows[0].active, `churn ${n}: newest row is live`)
  assert.equal(
    new Set(rows.map((r) => r.id)).size,
    5,
    `churn ${n}: ids stay unique (AnimatePresence keys)`
  )
}

// Jitter must not knock the numbers out of the fixed digit columns:
// down is w-[3ch], up is w-[2ch].
let j = initialRows()
for (let i = 0; i < 500; i++) {
  j = jitterRows(j)
  for (const r of j) {
    assert.ok(
      String(r.down).length <= 3,
      `down ${r.down} overflows the 3ch column`
    )
    assert.ok(String(r.up).length <= 2, `up ${r.up} overflows the 2ch column`)
  }
}

console.log("ledger.check.ts: ok")
