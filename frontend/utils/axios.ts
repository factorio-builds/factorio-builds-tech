/* eslint-disable-next-line no-restricted-imports */
import axios from "axios"
import getConfig from "next/config"

const { publicRuntimeConfig } = getConfig()

const axiosInstance = axios.create({
  baseURL: publicRuntimeConfig.apiUrl,
})

export { axiosInstance as axios }
