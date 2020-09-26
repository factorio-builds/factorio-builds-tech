export enum EFilterType {
  "STATE",
  "CATEGORY",
}

export enum EState {
  "EARLY_GAME" = "EARLY_GAME",
  "MID_GAME" = "MID_GAME",
  "LATE_GAME" = "LATE_GAME",
}

export enum ECategory {
  "BALANCER" = "BALANCER",
  "SMELTING" = "SMELTING",
  "TRAINS" = "TRAINS",
  "PRODUCTION" = "PRODUCTION",
}

export interface IBuild {
  id: string
  blueprint: string
  metadata: any
  name: string
  state: EState
  tileable: boolean
  categories: ECategory[]
  createdAt: string
  updatedAt: string
  owner: IUser
}

export interface IUser {
  id: string
  name: string
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

export interface IBlueprintEntity {
  entity_number: number
  name: string
  position: IVector
  direction?: number
  type?: string
  recipe?: string
}

export interface IDecodedBlueprintData {
  blueprint: IBlueprint
}

export interface IDecodedBlueprintBookData {
  blueprint_book: IBlueprintBook
}

export interface IBlueprint {
  icons: Array<IBlueprintIcon>
  entities: Array<IBlueprintEntity>
  item: string
  version: number
}

export interface IBlueprintBook {
  blueprints: IBlueprint[]
}
