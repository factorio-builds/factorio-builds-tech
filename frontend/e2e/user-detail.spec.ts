import { expect, fixtures, test } from "./fixtures"

// Note: pages/user/[id].tsx is a stub — only stores { id }, never resolves the
// username. This test just guards that the route doesn't return a server error.

test.describe("/user/[id] — user profile", () => {
  test("route responds without a server error", async ({ page }) => {
    const response = await page.goto(`/user/${fixtures.existingUserWithBuilds.username}`)
    expect(response?.status() ?? 500).toBeLessThan(500)
  })
})
