import { NextApiRequest, NextApiResponse } from "next"
import { mockedBuilds } from "../../../utils/mock-builds-data"

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(mockedBuilds)) {
      throw new Error("Cannot find build data")
    }

    res.status(200).json(mockedBuilds)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
