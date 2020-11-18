import express from "express"
import passport from "passport"
import DiscordStrategy from "passport-discord"
import { UserRepository } from "../db/repository/user.repository"

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
    clientID: process.env.DISCORD_CLIENT_ID as string,
    clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    callbackURL: "http://localhost:3000/auth/discord/callback",
    scope: ["identify", "email"],
  },
  async function (_accessToken, _refreshToken, profile, cb) {
    const userRepository = await UserRepository()
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
