import assert from "node:assert/strict"
import test from "node:test"
import { selectMacInstaller } from "./release-assets.mjs"

function asset(name, overrides = {}) {
  return {
    name,
    state: "uploaded",
    browser_download_url: `https://github.com/zeytun-labs/zeytun-app/releases/download/v1/${name}`,
    ...overrides,
  }
}
function release(date, assets, overrides = {}) {
  return {
    tag_name: "v1",
    published_at: date,
    draft: false,
    assets,
    ...overrides,
  }
}

test("drafts and unpublished releases never expose a download", () => {
  assert.equal(
    selectMacInstaller([
      release("2026-10-13T00:00:00Z", [asset("Zeytun_arm64.dmg")], {
        draft: true,
      }),
      release(null, [asset("Zeytun_arm64.dmg")]),
    ]),
    null
  )
})

test("selects newest published prerelease and prefers Apple Silicon over Intel", () => {
  const latest = selectMacInstaller([
    release("2026-10-12T00:00:00Z", [asset("old_arm64.dmg")]),
    release(
      "2026-10-13T00:00:00Z",
      [
        asset("Zeytun_x64.dmg"),
        asset("Zeytun.dmg"),
        asset("Zeytun_aarch64.dmg"),
      ],
      { prerelease: true, tag_name: "v2-alpha" }
    ),
  ])
  assert.equal(latest.assetName, "Zeytun_aarch64.dmg")
  assert.equal(latest.version, "v2-alpha")
})

test("skips signatures, source archives, unfinished assets, and wrong repositories", () => {
  assert.equal(
    selectMacInstaller([
      release("2026-10-13T00:00:00Z", [
        asset("Zeytun.dmg.sig"),
        asset("source.tar.gz"),
        asset("Zeytun_arm64.dmg", { state: "starter" }),
        asset("Zeytun.dmg", {
          browser_download_url:
            "https://github.com/other/repo/releases/download/v1/Zeytun.dmg",
        }),
      ]),
    ]),
    null
  )
})

test("keeps a usable published installer when a newer release has no DMG", () => {
  const latest = selectMacInstaller([
    release("2026-10-13T00:00:00Z", [asset("source.tar.gz")]),
    release("2026-10-12T00:00:00Z", [asset("Zeytun.dmg")]),
  ])
  assert.equal(latest.assetName, "Zeytun.dmg")
})
