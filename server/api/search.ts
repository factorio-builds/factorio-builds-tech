import express from "express"
import { Brackets } from "typeorm"
import { BuildRepository } from "../../db/repository/build.repository"

export const searchRoutes = express.Router()

interface ISearchQuery {
  q?: string
  categories?: string
  state?: string
}

/*
 * SEARCH BUILDS
 */
searchRoutes.get<any, any, any, ISearchQuery>(
  "/search/build",
  async (req, res) => {
    try {
      const buildRepository = await BuildRepository()

      const msStart = new Date().getMilliseconds()

      let searchQuery = buildRepository
        .createQueryBuilder("build")
        .setParameters({
          name: req.query.q || "",
        })
        .select(["build.id", "build.name", "build.metadata", "build.image"])
        .where("build.image IS NOT NULL")

      if (req.query.q) {
        searchQuery = searchQuery.andWhere(
          new Brackets((qb) => {
            return qb
              .where("build.name ILIKE :likeName", {
                likeName: `%${req.query.q}%`,
              })
              .orWhere("SIMILARITY(build.name, :name) > 0.1")
          })
        )
      }

      if (req.query.categories) {
        searchQuery = searchQuery.andWhere(
          "build.metadata -> 'categories' ?| :categories",
          { categories: req.query.categories.split(",") }
        )
      }

      if (req.query.state) {
        searchQuery = searchQuery.andWhere(
          "build.metadata -> 'state' ?| :state",
          { state: req.query.state.split(",") }
        )
      }

      searchQuery = searchQuery.orderBy("SIMILARITY(name, :name)", "DESC")

      const builds = await searchQuery.cache(5000).getMany()

      const msEnd = new Date().getMilliseconds()

      res.status(200).json({
        success: true,
        result: {
          nbHits: builds.length,
          hits: builds,
          processingTimeMs: msEnd - msStart,
        },
      })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
)
