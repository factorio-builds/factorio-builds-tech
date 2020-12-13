import MeiliSearch, { EnqueuedUpdate } from "meilisearch"
import { Build } from "../../db/entities/build.entity"

export const client = new MeiliSearch({ host: "http://127.0.0.1:7700" })

interface IBuildIndexDocument {
  id: Build["id"]
  name: Build["name"]
  metadata: Build["metadata"]
  ownerId: Build["ownerId"]
  image: Build["image"]
  views: Build["views"]
  updatedAt: Build["updatedAt"]
}

export const syncIndexes = async (
  buildsToIndex: Build[]
): Promise<EnqueuedUpdate> => {
  const buildsIndex = await client.getOrCreateIndex<IBuildIndexDocument>(
    "builds"
  )

  console.info("*** DELETING ALL DOCUMENTS FROM BUILDS INDEX ***")
  await buildsIndex.deleteAllDocuments()

  /* prettier-ignore */
  console.info(`*** INDEXING ${buildsToIndex.length} DOCUMENTS TO BUILDS INDEX ***`)
  const buildDocuments = buildsToIndex.map(mapBuildToIndexDocument)
  const enqueuedUpdate = await buildsIndex.addDocuments(buildDocuments)

  console.info(`*** DONE ***`)
  return enqueuedUpdate
}

const mapBuildToIndexDocument = (build: Build): IBuildIndexDocument => {
  return {
    id: build.id,
    name: build.name,
    metadata: build.metadata,
    ownerId: build.ownerId,
    image: build.image,
    views: build.views,
    updatedAt: build.updatedAt,
  }
}
