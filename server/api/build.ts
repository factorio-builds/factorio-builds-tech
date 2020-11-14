import express from "express"
import { IncomingForm, Fields, Files } from "formidable"
import { BuildRepository } from "../../db/repository/build.repository"
import {
  EntityNotFoundException,
  EntityPermissonException,
} from "../exceptions/entity.exceptions"
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
  try {
    const buildRepository = await BuildRepository()
    const builds = await buildRepository.find()

    res.status(200).json(builds)
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

/*
 * SAVE A NEW BUILD
 */
buildRoutes.post("/build", ensureAuthenticated, async (req, res) => {
  try {
    const { fields, files } = await parseForm(req)

    const build = await createBuildUseCase({
      ownerId: req.session!.passport.user.id,
      fields,
      files,
    })

    res.status(200).json(build)
  } catch (error) {
    if (error instanceof EntityNotFoundException) {
      res.status(409).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
})

/*
 * GET BUILD BY ID
 */
buildRoutes.get("/build/:id", async (req, res) => {
  try {
    const buildRepository = await BuildRepository()
    const build = await buildRepository
      .findOne(req.query.id as string)
      // TODO: reproduce with TypeORM
      // .findByPk(req.query.id, {
      //   // @ts-ignore
      //   include: [{ model: db.user, as: "owner" }],
      // })
      .catch(() => {
        throw new EntityNotFoundException("Build not found")
      })

    res.status(200).json(build)
  } catch (error) {
    if (error instanceof EntityNotFoundException) {
      res.status(404).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
})

/*
 * SAVE AN EXISTING BUILD
 */
// TODO: convert to put
buildRoutes.post("/build/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { fields, files } = await parseForm(req)

    const build = await updateBuildUseCase({
      buildId: req.params.id,
      ownerId: req.session!.passport.user.id,
      fields,
      files,
    })

    res.status(200).json(build)
  } catch (error) {
    if (error instanceof EntityNotFoundException) {
      res.status(406).json({ success: false, message: error.message })
    }
    if (error instanceof EntityPermissonException) {
      res.status(403).json({ success: false, message: error.message })
    }
    res.status(500).json({ success: false, message: error.message })
  }
})
