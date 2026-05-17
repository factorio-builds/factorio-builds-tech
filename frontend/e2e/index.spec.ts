import { expect, fixtures, test } from "./fixtures"

test.describe("index (build list)", () => {
  test("renders the build list with results from the API", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("link", { name: /factorio builds/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /login/i })).toBeVisible()

    await expect(page.getByText(fixtures.existingBuild.title)).toBeVisible()
  })

  test("search input is present and accepts text", async ({ page }) => {
    await page.goto("/")
    const search = page.getByPlaceholder("Search")
    await expect(search).toBeVisible()
    await search.fill("reactor")
    await expect(search).toHaveValue("reactor")
  })
})
