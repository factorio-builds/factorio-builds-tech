import { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"
import { connectDB } from "../../../db"
import { Build } from "../../../db/entities/build.entity"
// import { User } from "../../../db/entities/user.entity"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const connection = await connectDB()
    const buildsRepository = connection!.getRepository(Build)
    // const userRepository = connection!.getRepository(User)
    console.log("Connection has been established successfully.")

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
        const body = JSON.parse(req.body)

        // TODO: restore
        // const owner = await userRepository
        //   .findOne("8358cfb0-2675-4651-a9c2-0d7cf57d6110")
        //   .catch((error) => {
        //     console.error(error)
        //     throw new Error("Cannot find user data")
        //   })

        const build = buildsRepository.create({
          id: uuidv4(),
          name: body.name,
          blueprint: body.blueprint,
          description: body.description,
          json: {},
          metadata: {
            state: body.state.toLowerCase(),
            categories: body.categories.length ? body.categories : [],
            tileable: body.tileable,
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

export default handler
