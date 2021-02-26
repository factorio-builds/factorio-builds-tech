import { IThinBuild } from "./models"

export enum ESortType {
  "RELEVANCY" = "RELEVANCY",
  "TITLE" = "TITLE",
  "CREATED" = "CREATED",
  "UPDATED" = "UPDATED",
  "FAVORITES" = "FAVORITES",
}

export enum ESortDirection {
  "ASC" = "ASC",
  "DESC" = "DESC",
}

export enum ERole {
  "ADMIN" = "ADMIN",
  "USER" = "USER",
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

export interface IBlueprintTile {
  name: string
  position: {
    x: number
    y: number
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
  entities?: Array<IBlueprintEntity>
  tiles?: Array<IBlueprintTile>
  item: string
  label: string
  description?: string
  version: number
}

interface IDeconstructionPlanner {
  item: string
  label: string
  settings: {
    entity_filters: Array<{ name: string; index: number }>
    icons?: Array<IBlueprintIcon>
    tile_selection_mode: number
  }
  version: number
}

export interface IBookItemBlueprint {
  blueprint: IBlueprint
  index: number
}

interface IBookItemDeconstructionPlanner {
  deconstruction_planner: IDeconstructionPlanner
  index: number
}

export type TBookItem = IBookItemBlueprint | IBookItemDeconstructionPlanner

export interface IBlueprintBook {
  type: "blueprint-book"
  blueprints: TBookItem[]
  icons?: Array<IBlueprintIcon>
  label: string
  description?: string
  version: number
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

export type ApiSearchBuild = ApiResponse<SearchResponse<IThinBuild>>
