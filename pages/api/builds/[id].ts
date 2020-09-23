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
          const build = await db.builds
            .findByPk(req.query.id)

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
