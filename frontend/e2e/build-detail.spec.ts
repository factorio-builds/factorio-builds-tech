import { expect, fixtures, test } from "./fixtures"

test.describe("build detail page", () => {
  test("renders an existing build", async ({ page }) => {
    const { owner, slug, title } = fixtures.existingBuild
    await page.goto(`/${owner}/${slug}`)

    await expect(page).toHaveTitle(new RegExp(title))
    await expect(page.getByRole("heading", { name: title })).toBeVisible()
    await expect(page.getByRole("link", { name: /details/i })).toBeVisible()
  })

  test("shows an error message for an unknown build", async ({ page }) => {
    const { owner, slug } = fixtures.missing
    await page.goto(`/${owner}/${slug}`)
    await expect(page.getByText(/error/i).first()).toBeVisible()
  })
})
