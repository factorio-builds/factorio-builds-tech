import { IncomingMessage } from "http"
import { User } from "../db/entities/user.entity"

export enum EFilterType {
  "STATE",
  "CATEGORY",
}

export enum ESortType {
  "RELEVANCY" = "RELEVANCY",
  "VIEWS" = "VIEWS",
  "NEWEST" = "NEWEST",
}

export enum EState {
  "EARLY_GAME" = "EARLY_GAME",
  "MID_GAME" = "MID_GAME",
  "LATE_GAME" = "LATE_GAME",
}

export enum ECategory {
  "BALANCER" = "BALANCER",
  "SMELTING" = "SMELTING",
  "REFINERY" = "REFINERY",
  "TRAINS" = "TRAINS",
  "PRODUCTION" = "PRODUCTION",
  "ENERGY" = "ENERGY",
}

export enum ERole {
  "ADMIN" = "ADMIN",
  "USER" = "USER",
}

interface IBuildLinks {
  cover: {
    href: string
    width: number
    height: number
  }
  self: {
    href: string
  }
  versions: {
    href: string
  }
  add_version: {
    href: string
    method: "post"
  }
  toggle_favorite: {
    href: string
    method: "post"
  }
  followers: {
    href: string
    count: 0
  }
}

export interface IFullBuild {
  title: string
  slug: string
  description: {
    markdown: string
    html: string
  }
  tags: string[]
  icons: IIcon[]
  owner: IOwner
  latest_version: {
    hash: string
    created_at: string
    payload: {
      hash: string
      game_version: string
      encoded: string
      blueprint: IBlueprint | IBlueprintBook
      _links: {
        self: {
          href: string
        }
        raw: {
          href: string
        }
        "blueprint-editor": {
          href: string
        }
      }
    }
  }
  latest_game_version: string
  created_at: string
  updated_at: string
  _links: IBuildLinks
}

export interface IMetadata {
  tileable: boolean
  area: number
  state: EState[]
  categories: ECategory[]
  withMarkedInputs: boolean
  withBeacons: boolean
  isBook: boolean
  icons: IBlueprintIcon[]
}

export interface IImage {
  src: string
  width: number
  height: number
}

// Blueprint data types from https://github.com/BlooperDB/factorio-render
export interface IVector {
  x: number
  y: number
}

export interface IBoundingBox {
  min: IVector
  max: IVector
}

export interface IBlueprintIconSignal {
  type: string
  name: string
}

export interface IBlueprintIcon {
  index: number
  signal: IBlueprintIconSignal
}

interface IControlBehaviorFilter {
  signal: {
    type: string
    name: string
  }
  count: number
  index: number
}

export interface IBlueprintEntity {
  entity_number: number
  name: string
  position: IVector
  direction?: number
  type?: string
  recipe?: string
  control_behavior?: {
    filters: IControlBehaviorFilter[]
  }
}

export interface IDecodedBlueprintData {
  blueprint: IBlueprint
}

export interface IDecodedBlueprintBookData {
  blueprint_book: IBlueprintBook
}

export interface IBlueprint {
  type: "blueprint"
  icons?: Array<IBlueprintIcon>
  entities: Array<IBlueprintEntity>
  item: string
  label: string
  description?: string
  version: number
}

export interface IBlueprintBook {
  type: "blueprint-book"
  blueprints: Array<{
    blueprint: IBlueprint
    index: number
  }>
  icons?: Array<IBlueprintIcon>
  label: string
  description?: string
  version: number
}

export interface IIcon {
  index: number
  type: string
  name: string
}

export interface IThinBuild {
  title: string
  slug: string
  owner: { username: string }
  latest_game_version: string
  icons: IIcon[]
  tags: string[]
  created_at: string
  updated_at: string
  _links: IBuildLinks
}

// IOwner vs IUser??
interface IOwner {
  display_name: string
  registered_at: Date
  username: string
}

export interface IUser {
  id: string
  name: string
}

interface ApiResponseSuccess<R = any> {
  success: true
  result: R
}

interface ApiResponseFailure {
  success: false
  message: string
}

type ApiResponse<R> = ApiResponseSuccess<R> | ApiResponseFailure

export interface SearchResponse<T> {
  current_count: number
  total_count: number
  builds: T[]
}

export type ApiSeachBuild = ApiResponse<SearchResponse<IThinBuild>>

// TODO: properly extend IncomingMessage
export interface ExtendedReq extends IncomingMessage {
  session: {
    passport: {
      user: User
    }
  }
}
