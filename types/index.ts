export enum EFilterType {
  "STATE",
  "CATEGORY",
}

export enum EState {
  "EARLY_GAME",
  "MID_GAME",
  "LATE_GAME",
}

export enum ECategory {
  "BALANCER",
  "SMELTING",
  "TRAINS",
  "PRODUCTION",
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
  id: number
  name: string
}
