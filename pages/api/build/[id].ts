import { IncomingForm, Fields, Files } from "formidable"
import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "../../../db"
import { Build } from "../../../db/entities/build.entity"
import { EState } from "../../../types"
import { uploadFile } from "../../../utils/upload"

// TODO: extract
interface IParsedForm {
  fields: Fields
  files: Files
}

// TODO: extract
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

    switch (req.method) {
      case "GET":
        {
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
        }
        break
      case "POST": {
        const { fields, files } = await parseForm(req)

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

        const file = await uploadFile(build.id, files.image.path).catch(
          console.error
        )

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
        if (file) {
          build.image = file.Location
        }

        await buildsRepository.save(build)

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
