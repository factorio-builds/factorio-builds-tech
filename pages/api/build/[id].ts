import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "../../../db"
import { Build } from "../../../db/entities/build.entity"

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

        const body = JSON.parse(req.body)

        build.name = body.name
        build.blueprint = body.blueprint
        build.description = body.description
        build.metadata = {
          ...build.metadata,
          state: body.state.toLowerCase(),
          categories: body.categories.length ? body.categories : [],
          tileable: body.tileable,
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

export default handler
