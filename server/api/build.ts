import express from "express"
import { IncomingForm, Fields, Files } from "formidable"
import imageSize from "image-size"
import { promisify } from "util"
import { v4 as uuidv4 } from "uuid"
import { ensureConnection } from "../../db"
import { Build } from "../../db/entities/build.entity"
import { User } from "../../db/entities/user.entity"
import { EState } from "../../types"
import { uploadFile } from "../../utils/upload"
import { ensureAuthenticated } from "../middlewares"

const imageSizeAsync = promisify(imageSize)

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
  const connection = await ensureConnection()
  const buildsRepository = connection!.getRepository(Build)
  const builds = await buildsRepository.find().catch((error) => {
    console.error(error)
    throw new Error("Cannot find build data")
  })

  res.status(200).json(builds)
})

/*
 * SAVE A NEW BUILD
 */
buildRoutes.post("/build", ensureAuthenticated, async (req, res) => {
  const connection = await ensureConnection()
  const buildsRepository = connection!.getRepository(Build)
  const userRepository = connection!.getRepository(User)

  const { fields, files } = await parseForm(req)

  const id = uuidv4()
  const file = await uploadFile(id, files.image.path).catch(console.error)
  const dimensions = await imageSizeAsync(files.image.path)

  if (!file || !dimensions) {
    return res.status(500).json({
      success: false,
      message: "Could not parse image",
    })
  }

  const owner = await userRepository
    .findOne(req.session!.passport.user.id)
    .catch((error) => {
      console.error(error)
      throw new Error("Cannot find user data")
    })

  const buildData: Build = {
    id,
    name: fields.name as string,
    blueprint: fields.blueprint as string,
    description: fields.description as string,
    // @ts-ignore
    json: {},
    image: {
      src: file.Location,
      width: dimensions.width || 0,
      height: dimensions.height || 0,
    },
    metadata: {
      state: fields.state as EState,
      // @ts-ignore
      categories: JSON.parse(fields.categories).length
        ? JSON.parse(fields.categories as string)
        : [],
      tileable: Boolean(fields.tileable as string),
      area: 0,
    },
    owner: owner as User,
  }

  const build = buildsRepository.create(buildData)
  buildsRepository.save(build)

  res.status(200).json(build)
})

/*
 * GET BUILD BY ID
 */
buildRoutes.get("/build/:id", async (req, res) => {
  const connection = await ensureConnection()
  const buildsRepository = connection!.getRepository(Build)
  const build = await buildsRepository
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
  // @ts-ignore
  const { fields, files } = await parseForm(req)

  const connection = await ensureConnection()
  const buildsRepository = connection!.getRepository(Build)
  const build = await buildsRepository
    .findOne(req.query.id as string)
    .catch((error) => {
      console.error(error)
      throw new Error("Cannot find build data")
    })

  if (!build) {
    throw new Error("Cannot find build data")
  }

  const file = await uploadFile(build.id, files.image.path).catch(console.error)

  const dimensions = await imageSizeAsync(files.image.path)

  build.name = fields.name as string
  build.blueprint = fields.blueprint as string
  build.description = fields.description as string
  build.metadata = {
    ...build.metadata,
    state: fields.state as EState,
    // @ts-ignore
    categories: JSON.parse(fields.categories).length
      ? JSON.parse(fields.categories as string)
      : [],
    tileable: Boolean(fields.tileable as string),
  }
  if (file && dimensions) {
    build.image = {
      src: file.Location,
      width: dimensions.width as number,
      height: dimensions.height as number,
    }
  }

  await buildsRepository.save(build)

  res.status(200).json(build)
})
