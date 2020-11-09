import express from "express"
import passport from "passport"
import DiscordStrategy from "passport-discord"
import { ensureConnection } from "../db"
import { User } from "../db/entities/user.entity"

export const authRoutes = express.Router()

authRoutes.get(
  "/login",
  passport.authenticate("discord", {
    scope: ["identify", "email", "guilds", "guilds.join"],
  }),
  (req, res) => {
    const backURL = req.header("Referer") || "/"

    res.redirect(backURL)
  }
)

authRoutes.get("/auth/discord/callback", (req, res, next) => {
  passport.authenticate("discord", (err, user) => {
    if (err) return next(err)
    if (!user) return res.redirect("/login")
    req.logIn(user, (err) => {
      if (err) return next(err)
      res.redirect("/")
    })
  })(req, res, next)
})

authRoutes.get("/logout", (req, res) => {
  const backURL = req.header("Referer") || "/"

  req.logout()
  res.redirect(backURL)
})

export const discordStrategy = new DiscordStrategy(
  {
    clientID: "774468058176684033",
    clientSecret: "TTL-3jdBCfRl7e6IMsd1iIcpLjgtXOP7",
    callbackURL: "http://localhost:3000/auth/discord/callback",
    scope: ["identify", "email"],
  },
  async function (_accessToken, _refreshToken, profile, cb) {
    const connection = await ensureConnection()

    const userRepository = connection!.getRepository(User)
    const user = await userRepository.findOne({
      where: { discordId: profile.id },
    })

    if (!user) {
      const user = await userRepository.save({
        name: profile.username,
        discordId: profile.id,
      })

      // TODO: error handle
      return cb(null, user)
    }

    return cb(null, user)
  }
)
