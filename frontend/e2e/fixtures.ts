import { test as base, expect } from "@playwright/test"

export const fixtures = {
  existingBuild: {
    owner: "brian-white",
    slug: "brians-bootstrap",
    title: "Brian's Bootstrap",
  },
  existingUserWithBuilds: {
    username: "brian-white",
  },
  missing: {
    owner: "nonexistent-user-zzz",
    slug: "nonexistent-build-zzz",
  },
}

export const test = base

export { expect }
