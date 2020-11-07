import express, { Request, Response } from "express"
import session from "express-session"
import next from "next"
import passport from "passport"
import uid from "uid-safe"
import { authRoutes, discordStrategy } from "./auth"

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

;(async () => {
  try {
    await app.prepare()
    const server = express()

    const sessionConfig = {
      secret: uid.sync(18),
      cookie: {
        maxAge: 86400 * 1000, // 24 hours in milliseconds
      },
      resave: false,
      saveUninitialized: true,
    }
    server.use(session(sessionConfig))

    passport.use(discordStrategy)
    passport.serializeUser((user, done) => done(null, user))
    passport.deserializeUser((user, done) => done(null, user))

    server.use(passport.initialize())
    server.use(passport.session())
    server.use(authRoutes)

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res)
    })
    server.listen(port, (err?: any) => {
      if (err) throw err
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`)
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
