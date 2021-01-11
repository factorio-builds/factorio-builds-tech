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
