import { expect, test } from "./fixtures"

test.describe("about page", () => {
  test("renders the about content", async ({ page }) => {
    await page.goto("/about")
    await expect(page.getByRole("heading", { name: "About", level: 1 })).toBeVisible()
    await expect(page.getByRole("heading", { name: /how to help/i })).toBeVisible()
    await expect(page.getByRole("heading", { name: /who/i })).toBeVisible()
  })

  test("links to the GitHub repo", async ({ page }) => {
    await page.goto("/about")
    const repoLink = page.getByRole("link", { name: /open source on github/i })
    await expect(repoLink).toHaveAttribute(
      "href",
      "https://github.com/factorio-builds/factorio-builds-tech"
    )
  })
})
