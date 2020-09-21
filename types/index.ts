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
  name: string
  state: EState
  tileable: boolean
  categories: ECategory[]
}

export interface IUser {
  id: string
  name: string
}
