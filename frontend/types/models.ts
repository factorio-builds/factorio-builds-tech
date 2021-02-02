import { components } from "./generated-api"

type schemas = components["schemas"]

export type IThinBuild = schemas["ThinBuildModel"]
export type IFullBuild = schemas["FullBuildModel"]
export type IThinUser = schemas["ThinUserModel"]
export type IUser = schemas["FullUserModel"]
export type IBlueprintPayload = components["schemas"]["BlueprintPayloadModel"]
export type IBookPayload = components["schemas"]["BookPayloadModel"]
export type IFullPayload = IBlueprintPayload | IBookPayload
export type IIcon = components["schemas"]["GameIcon"]

export type ICreateBuildRequest = components["schemas"]["CreateBuildRequest"]
export type ICreateVersionRequest = components["schemas"]["CreateVersionRequest"]
export type IEditBuildRequest = components["schemas"]["EditBuildRequest"]

export interface IStoreUser {
  id: string
  username: string
  accessToken: string
}
