import { expect, fixtures, test } from "./fixtures"

test.describe("[user]/builds — user's build list", () => {
  test("renders builds for a known user", async ({ page }) => {
    const { username } = fixtures.existingUserWithBuilds
    await page.goto(`/${username}/builds`)
    await expect(page.getByRole("link", { name: /factorio builds/i })).toBeVisible()
    await expect(
      page.getByRole("link", { name: new RegExp(fixtures.existingBuild.title, "i") })
    ).toBeVisible()
  })

  test("route responds without a server error for an unknown user", async ({ page }) => {
    const response = await page.goto(`/${fixtures.missing.owner}/builds`)
    expect(response?.status() ?? 500).toBeLessThan(500)
  })
})
