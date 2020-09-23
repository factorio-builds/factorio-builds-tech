import { NextApiRequest, NextApiResponse } from "next"
import db from "../../../db/models"

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.sequelize.authenticate()
    console.log("Connection has been established successfully.")

    const builds = await db.builds
      .findAll({
        attributes: ["id", "owner_id", "name", "metadata"],
      })
      .catch((error) => {
        console.error(error)
        throw new Error("Cannot find build data")
      })

    res.status(200).json(builds)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
