import { describe, expect, it } from "vitest"

import { normalizeBaalTotalShares, normalizeTotalSupplyMemberCount } from "./member-count"

describe("normalizeTotalSupplyMemberCount", () => {
  it("returns 0 for zero supply", () => {
    expect(normalizeTotalSupplyMemberCount(0n)).toBe(0)
  })

  it("keeps small integer NFT supply without decimal normalization", () => {
    expect(normalizeTotalSupplyMemberCount(18n)).toBe(18)
    expect(normalizeTotalSupplyMemberCount(42n)).toBe(42)
  })

  it("normalizes 18-decimal governance token supply", () => {
    expect(normalizeTotalSupplyMemberCount(100n * 10n ** 18n)).toBe(100)
    expect(normalizeTotalSupplyMemberCount(1100n * 10n ** 18n)).toBe(1100)
  })
})

describe("normalizeBaalTotalShares", () => {
  it("normalizes featured Moloch share totals", () => {
    expect(normalizeBaalTotalShares(4n * 10n ** 18n)).toBe(4)
    expect(normalizeBaalTotalShares(100n * 10n ** 18n)).toBe(100)
    expect(normalizeBaalTotalShares(1100n * 10n ** 18n)).toBe(1100)
    expect(normalizeBaalTotalShares(1204n * 10n ** 18n)).toBe(1204)
  })
})
