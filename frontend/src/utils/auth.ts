import { Dispatch } from "redux"

// Server-side OIDC handler lives in the TanStack Start server route at
// src/routes/api/auth.$.ts. Bearer tokens are read from the redux auth slice
// per request by the http wrapper, so no global header sync is needed here.

export function logout(dispatch: Dispatch): void {
  dispatch({ type: "UNSET_USER" })
}
