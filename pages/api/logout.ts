import { NextApiRequest, NextApiResponse } from "next"
import auth from "../../utils/auth"

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await auth.handleLogout(req, res, {
      returnTo: "http://localhost:3000/hello-world",
    })
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}
