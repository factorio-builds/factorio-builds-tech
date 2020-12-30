import { NextApiRequest, NextApiResponse } from "next"
import auth from "../../utils/auth"

export default async function callback(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await auth.handleCallback(req, res, { redirectTo: "/" })
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}
