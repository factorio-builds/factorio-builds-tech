import { useEffect, useState } from "react"
import axios from "axios"
import { IFullBuild } from "../../../types/models"

interface IPayloadStateInitial {
  loading: false
  error: false
  data: undefined
}

interface IPayloadStateSuccess {
  loading: false
  error: false
  // TODO: type API/payload
  data: Record<string, unknown>
}

interface IPayloadStateError {
  loading: false
  error: true
  data: undefined
}

interface IPayloadStateLoading {
  loading: true
  error: false
  data: undefined
}

export type TPayload =
  | IPayloadStateInitial
  | IPayloadStateSuccess
  | IPayloadStateError
  | IPayloadStateLoading

function usePayload(build: IFullBuild): TPayload {
  const [payload, setPayload] = useState<TPayload>({
    loading: false,
    error: false,
    data: undefined,
  })

  useEffect(() => {
    setPayload({
      loading: true,
      error: false,
      data: undefined,
    })
    axios({
      url: `https://api.local.factorio.tech/payloads/${build.latest_version.hash}`,
      params: { include_children: true },
    })
      .then((response) => {
        setPayload({
          error: false,
          loading: false,
          data: response.data,
        })
      })
      .catch(() => {
        setPayload({
          error: true,
          loading: false,
          data: undefined,
        })
      })
  }, [build.latest_version.hash])

  return payload
}

export default usePayload
