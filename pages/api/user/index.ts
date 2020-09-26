import { NextApiRequest, NextApiResponse } from "next"
import { mockedUsers } from "../../../utils/mock-users-data"

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(mockedUsers)) {
      throw new Error("Cannot find user data")
    }

    res.status(200).json(mockedUsers)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
