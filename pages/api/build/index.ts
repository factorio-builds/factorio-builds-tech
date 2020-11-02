import { IncomingForm, Fields, Files } from "formidable"
import { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"
import { connectDB } from "../../../db"
import { Build } from "../../../db/entities/build.entity"
// import { User } from "../../../db/entities/user.entity"
import { uploadFile } from "../../../utils/upload"

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
    // const userRepository = connection!.getRepository(User)

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
        const { fields, files } = await parseForm(req)

        const id = uuidv4()
        const file = await uploadFile(id, files.image.path).catch(console.error)

        // TODO: restore
        // const owner = await userRepository
        //   .findOne("8358cfb0-2675-4651-a9c2-0d7cf57d6110")
        //   .catch((error) => {
        //     console.error(error)
        //     throw new Error("Cannot find user data")
        //   })

        const build: Build = buildsRepository.create({
          // @ts-ignore
          id,
          name: fields.name as string,
          blueprint: fields.blueprint as string,
          description: fields.description as string,
          json: {},
          image: file ? file.Location : null,
          metadata: {
            state: (fields.state as string).toLowerCase(),
            categories: fields.categories.length ? fields.categories : [],
            tileable: fields.tileable,
          },
        })
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
