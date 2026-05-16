import { components } from "./generated-api"

type schemas = components["schemas"]

export type IThinBuild = schemas["ThinBuildModel"]
export type IFullBuild = schemas["FullBuildModel"]
export type IThinUser = schemas["ThinUserModel"]
export type IUser = schemas["FullUserModel"]
export type IBlueprintPayload = schemas["BlueprintPayloadModel"]
export type IBookPayload = schemas["BookPayloadModel"]
export type IFullPayload = IBlueprintPayload | IBookPayload
export type IIcon = schemas["GameIcon"]

export type ICreateBuildRequest = schemas["CreateBuildRequest"]
export type ICreateVersionRequest = schemas["CreateVersionRequest"]
export type IEditBuildRequest = schemas["EditBuildRequest"]

export type ICreatePayloadResult = schemas["CreatePayloadResult"]
export type IProblemDetails = schemas["ProblemDetails"]

export interface IStoreUser {
  id: string
  username: string
  accessToken: string
}
