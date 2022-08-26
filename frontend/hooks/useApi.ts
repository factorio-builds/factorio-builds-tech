import { AxiosRequestConfig, AxiosRequestHeaders } from "axios"
import useAxios, { Options } from "axios-hooks"
import getConfig from "next/config"
import { useAppSelector } from "../redux/store"
import { IProblemDetails } from "../types/models"

const { publicRuntimeConfig } = getConfig()

const isManual = (config: AxiosRequestConfig, options?: Options) => {
  if (options && options.manual) {
    return options.manual
  }

  if (!config.method || config.method.toUpperCase() === "GET") {
    return false
  }

  return true
}

export function useApi<T = any>(config: AxiosRequestConfig, options?: Options) {
  const accessToken = useAppSelector((store) => store.auth?.user?.accessToken)

  const headers: AxiosRequestHeaders = {
    ...config.headers,
    "content-type": config?.headers?.["content-type"] || "application/json",
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return useAxios<T, IProblemDetails>(
    {
      ...config,
      baseURL: publicRuntimeConfig.apiUrl,
      headers,
    },
    {
      manual: isManual(config, options),
    }
  )
}
