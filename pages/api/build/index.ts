import { IncomingForm, Fields, Files } from "formidable"
import { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"
import { connectDB } from "../../../db"
import { Build } from "../../../db/entities/build.entity"
import { User } from "../../../db/entities/user.entity"
import { uploadFile } from "../../../utils/upload"
import imageSize from "image-size"
import { promisify } from "util"
import { EState } from "../../../types"

const imageSizeAsync = promisify(imageSize)

interface IParsedForm {
  fields: Fields
  files: Files
}

const parseForm = (req: NextApiRequest): Promise<IParsedForm> => {
  return new Promise(function (resolve, reject) {
    const form = new IncomingForm()
    form.parse(req, function (err, fields, files) {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const connection = await connectDB()
    const buildsRepository = connection!.getRepository(Build)
    const userRepository = connection!.getRepository(User)

    switch (req.method) {
      case "GET":
        {
          const builds = await buildsRepository.find().catch((error) => {
            console.error(error)
            throw new Error("Cannot find build data")
          })

          res.status(200).json(builds)
        }
        break
      case "POST": {
        // @ts-ignore
        if (!req.session?.passport?.user) {
          res.status(401).json({
            success: false,
            message: "You must be logged in to perform this action",
          })
          break
        }

        const { fields, files } = await parseForm(req)

        const id = uuidv4()
        const file = await uploadFile(id, files.image.path).catch(console.error)
        const dimensions = await imageSizeAsync(files.image.path)

        const owner = await userRepository
          // @ts-ignore
          .findOne(req.session.passport.user.id)
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
            // @ts-ignore
            src: file.Location,
            width: dimensions?.width!,
            height: dimensions?.height!,
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

        const build: Build = buildsRepository.create(buildData)
        buildsRepository.save(build)

        res.status(200).json(build)
        break
      }
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
