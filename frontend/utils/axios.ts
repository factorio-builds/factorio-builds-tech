/* eslint-disable-next-line no-restricted-imports */
import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://api.local.factorio.tech",
})

export { axiosInstance as axios }
