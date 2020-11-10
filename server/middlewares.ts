import express from "express"

export function ensureAuthenticated(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (req.isAuthenticated()) {
    return next()
  }

  res.status(401).json({
    success: false,
    message: "You must be logged in to perform this action",
  })
}
