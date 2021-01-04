import { components } from "./generated-api"

type schemas = components["schemas"]

export type IThinBuild = schemas["ThinBuildModel"]
export type IFullBuild = schemas["FullBuildModel"]
export type IThinUser = schemas["ThinUserModel"]
export type IUser = schemas["UserModel"]
