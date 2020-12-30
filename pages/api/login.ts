import { NextApiRequest, NextApiResponse } from "next"
import auth from "../../utils/auth"

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await auth.handleLogin(req, res)
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}
