import { expect, fixtures, test } from "./fixtures"

test.describe("[user]/[slug]/edit — edit build page", () => {
  test("renders the edit form for an existing build", async ({ page }) => {
    const { owner, slug } = fixtures.existingBuild
    await page.goto(`/${owner}/${slug}/edit`)
    await expect(page.getByRole("heading", { name: /edit build/i })).toBeVisible()
  })

  test("shows an error message when the build does not exist", async ({ page }) => {
    const { owner, slug } = fixtures.missing
    await page.goto(`/${owner}/${slug}/edit`)
    await expect(page.getByText(/error/i).first()).toBeVisible()
  })
})
