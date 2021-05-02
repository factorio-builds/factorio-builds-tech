import { AxiosError } from "axios"
import { ICreateBuildRequest } from "../../../types/models"

export interface IFormValues {
  __operation: "CREATE" | "EDIT"
  isBook: boolean | undefined
  hash: string
  title: string
  slug: string
  description: string
  tags: string[]
  cover: {
    type: "file" | "hash"
    file: File | null
    url: string | null
    hash: string | null
    crop: {
      x: number
      y: number
      width: number
      height: number
    } | null
  }
  version?: ICreateBuildRequest["version"]
}

export interface IValidFormValues {
  isBook: boolean
  hash: string
  title: string
  slug: string
  description: string
  tags: string[]
  cover: {
    type: "file" | "hash"
    file: File | null
    url: string | null
    hash: string | null
    crop: {
      x: number
      y: number
      width: number
      height: number
    } | null
  }
  version?: ICreateBuildRequest["version"]
}

interface ISubmitStatusNeutral {
  loading: false
  error: false
}

interface ISubmitStatusLoading {
  loading: true
  error: false
}

interface ISubmitStatusError {
  loading: false
  error: AxiosError
}

export type ISubmitStatus =
  | ISubmitStatusNeutral
  | ISubmitStatusLoading
  | ISubmitStatusError
