import { useSelector } from "react-redux"
import { AxiosRequestConfig } from "axios"
import useAxios, { Options } from "axios-hooks"
import { IStoreState } from "../redux/store"
import getConfig from "next/config"

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

export function useApi(config: AxiosRequestConfig, options?: Options) {
  const accessToken = useSelector(
    (store: IStoreState) => store.auth?.user?.accessToken
  )

  const [{ data, loading, error }, execute] = useAxios(
    {
      ...config,
      baseURL: publicRuntimeConfig.apiUrl,
      headers: {
        ...config.headers,
        "content-type": config?.headers?.["content-type"] || "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
    },
    {
      manual: isManual(config, options),
    }
  )

  return { data, loading, error, execute }
}
