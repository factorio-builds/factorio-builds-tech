import { useQuery } from "@tanstack/react-query"
import { IFullBuild, IFullPayload } from "../../../types/models"
import { http } from "../../../utils/http"

interface IPayloadStateInitial {
  loading: false
  error: false
  data: undefined
}

interface IPayloadStateSuccess {
  loading: false
  error: false
  data: IFullPayload
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
  const hash = build.latest_version.hash
  const query = useQuery({
    queryKey: ["payload", hash],
    queryFn: async ({ signal }) => {
      const res = await http.get<IFullPayload>(`/payloads/${hash}`, {
        params: { include_children: true },
        signal,
      })
      return res.data
    },
  })

  if (query.isError) {
    return { loading: false, error: true, data: undefined }
  }
  if (query.isPending) {
    return { loading: true, error: false, data: undefined }
  }
  return { loading: false, error: false, data: query.data }
}

export default usePayload
