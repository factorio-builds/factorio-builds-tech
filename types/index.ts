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
  icons?: Array<IBlueprintIcon>
  entities: Array<IBlueprintEntity>
  item: string
  label: string
  description?: string
  version: number
}

export interface IBlueprintBook {
  blueprints: Array<{
    blueprint: IBlueprint
    index: number
  }>
  icons?: Array<IBlueprintIcon>
  label: string
  description?: string
  version: number
}

// TODO: properly extend IncomingMessage
export interface ExtendedReq extends IncomingMessage {
  session: {
    passport: {
      user: User
    }
  }
}
