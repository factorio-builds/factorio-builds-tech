import { useSelector } from "react-redux"
import { AxiosRequestConfig } from "axios"
import getConfig from "next/config"
import useSWR from "swr"
import { IStoreState } from "../redux/store"
import { axios } from "../utils/axios"

const { publicRuntimeConfig } = getConfig()

interface IResponseSuccess<T> {
  data: T
  error: false
  loading: false
}

interface IResponseLoading {
  data: undefined
  error: false
  loading: true
}

interface IResponseError<E> {
  data: undefined
  error: E
  loading: false
}

type TResponse<T, E> =
  | IResponseSuccess<T>
  | IResponseLoading
  | IResponseError<E>

export function useSWRApi<T = any, E = any>(
  config: AxiosRequestConfig
): TResponse<T, E> {
  const accessToken = useSelector(
    (store: IStoreState) => store.auth?.user?.accessToken
  )

  const fetchWithToken = async (url: string, token?: string) => {
    return axios
      .get<T>(url, {
        headers: {
          ...config.headers,
          "content-type":
            config?.headers?.["content-type"] || "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      })
      .then((res) => res.data)
  }

  const url = `${publicRuntimeConfig.apiUrl}/${config.url}`

  const { data, error } = useSWR([url, accessToken], fetchWithToken)

  if (data) {
    return { data, error: false, loading: false }
  }

  if (!data && error) return { data: undefined, error, loading: false }

  return { data: undefined, error: false, loading: true }
}
