import { NextApiRequest, NextApiResponse } from "next"
import { connectDB } from "../../../db"
import { Build } from "../../../db/entities/build.entity"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const connection = await connectDB()
    console.log("Connection has been established successfully.")

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
        res.status(400).json({})
        break
      }
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
