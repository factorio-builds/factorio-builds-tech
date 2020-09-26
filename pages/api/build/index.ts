import { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"
import db from "../../../db/models"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.sequelize.authenticate()
    console.log("Connection has been established successfully.")

    switch (req.method) {
      case "GET":
        {
          // @ts-ignore
          const build = await db.build
            .findAll({
              attributes: ["id", "owner_id", "name", "metadata"],
            })
            // @ts-ignore
            .catch((error) => {
              console.error(error)
              throw new Error("Cannot find build data")
            })

          res.status(200).json(build)
        }
        break
      case "POST": {
        const body = JSON.parse(req.body)
        // @ts-ignore
        const build = await db.build.create({
          id: uuidv4(),
          name: body.name,
          blueprint: body.blueprint,
          json: {},
          metadata: {
            state: body.state.toLowerCase(),
            type: body.categories.length ? body.categories : [],
            something: false,
          },
        })

        res.status(200).json(build)
        break
      }
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
