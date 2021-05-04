import { initAuth0, Session } from "@auth0/nextjs-auth0"
import getConfig from "next/config"
import { Dispatch } from "redux"
import { IStoreUser } from "../types/models"
import { axios } from "./axios"

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

export default initAuth0({
  secret: "this value is ignored by IdentityServer",
  issuerBaseURL: publicRuntimeConfig.identityUrl,
  baseURL: publicRuntimeConfig.webUrl,
  clientID: serverRuntimeConfig.clientId,
  clientSecret: serverRuntimeConfig.clientSecret,
})

export function sync(user: IStoreUser | null): void {
  axios.defaults.headers.common.Authorization = user?.accessToken
    ? `Bearer ${user.accessToken}`
    : ""
}

export function login(session: Session, dispatch: Dispatch): void {
  dispatch({
    type: "SET_USER",
    payload: {
      id: session.user.sub,
      username: session.user.username,
      accessToken: session.accessToken,
    },
  })

  axios.defaults.headers.common.Authorization = `Bearer ${session.accessToken}`
}

export function logout(dispatch: Dispatch): void {
  axios.defaults.headers.common.Authorization = ""
  dispatch({ type: "UNSET_USER" })
}
