import express from "express"
import { IncomingForm, Fields, Files } from "formidable"
import { BuildRepository } from "../../db/repository/build.repository"
import { ensureAuthenticated } from "../middlewares"
import {
  createBuildUseCase,
  updateBuildUseCase,
} from "../usecase/build.usecase"

export const buildRoutes = express.Router()

// TODO: extract
interface IParsedForm {
  fields: Fields
  files: Files
}

// TODO: extract
const parseForm = (req: express.Request): Promise<IParsedForm> => {
  return new Promise(function (resolve, reject) {
    const form = new IncomingForm()
    form.parse(req, function (err, fields, files) {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

/*
 * GET ALL BUILDS
 */
buildRoutes.get("/build", async (_req, res) => {
  const buildRepository = await BuildRepository()
  const builds = await buildRepository.find().catch((error) => {
    console.error(error)
    throw new Error("Cannot find build data")
  })

  res.status(200).json(builds)
})

/*
 * SAVE A NEW BUILD
 */
buildRoutes.post("/build", ensureAuthenticated, async (req, res) => {
  const { fields, files } = await parseForm(req)

  const build = await createBuildUseCase({
    ownerId: req.session!.passport.user.id,
    fields,
    files,
  })

  // TODO: error handling
  res.status(200).json(build)
})

/*
 * GET BUILD BY ID
 */
buildRoutes.get("/build/:id", async (req, res) => {
  const buildRepository = await BuildRepository()
  const build = await buildRepository
    .findOne(req.query.id as string)
    // TODO: reproduce with TypeORM
    // .findByPk(req.query.id, {
    //   // @ts-ignore
    //   include: [{ model: db.user, as: "owner" }],
    // })
    .catch((error) => {
      console.error(error)
      throw new Error("Cannot find build data")
    })
  res.status(200).json(build)
})

/*
 * SAVE AN EXISTING BUILD
 */
// TODO: convert to put
buildRoutes.post("/build/:id", ensureAuthenticated, async (req, res) => {
  const { fields, files } = await parseForm(req)

  const build = await updateBuildUseCase({ fields, files })

  // TODO: error handling
  res.status(200).json(build)
})
