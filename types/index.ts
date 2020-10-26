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
  "ENERGY" = "ENERGY",
}

export interface IMetadata {
  tileable: boolean
  area: number
  state: EState
  categories: ECategory[]
}

export interface IBuild {
  id: string
  description: string
  blueprint: string
  metadata: IMetadata
  name: string
  created_at: string
  updated_at: string
  owner: IUser
  image: IImage
}

export interface IBuildWithJson extends IBuild {
  json: IDecodedBlueprintBookData | IDecodedBlueprintData
}

export interface IImage {
  src: string
  width: number
  height: number
}

export interface IUser {
  id: string
  name: string
  created_at: string
  updated_at: string
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
  label: string
  version: number
}

export interface IBlueprintBook {
  blueprints: Array<{
    blueprint: IBlueprint
    index: number
  }>
}
