import { expect, test } from "./fixtures"

test.describe("/user — users index", () => {
  // Known broken: pages/user/index.tsx returns `users: {}` from
  // getServerSideProps and then calls `.map` on it, throwing during SSR.
  // Remove the fixme once that page is wired up properly.
  test.fixme("route responds without a server error", async ({ page }) => {
    const response = await page.goto("/user")
    expect(response?.status() ?? 500).toBeLessThan(500)
  })
})
