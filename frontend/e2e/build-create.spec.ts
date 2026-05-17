import { expect, test } from "./fixtures"

test.describe("/build/create — create build page", () => {
  test("renders the create form heading when logged out", async ({ page }) => {
    await page.goto("/build/create")
    await expect(page.getByRole("heading", { name: /create a build/i })).toBeVisible()
  })

  test("does not show the 'Add a build' button in the header when logged out", async ({
    page,
  }) => {
    await page.goto("/")
    // Anchor on something we know is present before asserting absence,
    // so we don't pass simply by checking before the page hydrates.
    await expect(page.getByRole("link", { name: /login/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /add a build/i })).toHaveCount(0)
  })
})
