import { IsNull, Not } from "typeorm"
import { BuildRepository } from "../db/repository/build.repository"
import { syncIndexes } from "../server/services/search.service"

async function execute() {
  try {
    const buildRepo = await BuildRepository()
    const builds = await buildRepo.find({ image: Not(IsNull()) })

    const done = await syncIndexes(builds)

    if (done) {
      process.exit(0)
    } else {
      throw new Error("Could not sync indexes")
    }
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

execute()
