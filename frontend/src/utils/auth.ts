import { Dispatch } from "redux"
import { IStoreUser } from "../types/models"
import { axios } from "./axios"

// Server-side OIDC handler lives in the TanStack Start server route at
// src/routes/api/auth.$.ts. This module is the client/shared helper
// surface — redux + axios sync only.

export interface SessionLike {
  user: { sub: string; username?: string } & Record<string, unknown>
  accessToken?: string
}

export function sync(user: IStoreUser | null): void {
  axios.defaults.headers.common.Authorization = user?.accessToken
    ? `Bearer ${user.accessToken}`
    : ""
}

export function login(session: SessionLike, dispatch: Dispatch): void {
  dispatch({
    type: "SET_USER",
    payload: {
      id: session.user.sub,
      username: (session.user.username as string) ?? "",
      accessToken: session.accessToken ?? "",
    },
  })

  axios.defaults.headers.common.Authorization = `Bearer ${
    session.accessToken ?? ""
  }`
}

export function logout(dispatch: Dispatch): void {
  axios.defaults.headers.common.Authorization = ""
  dispatch({ type: "UNSET_USER" })
}
