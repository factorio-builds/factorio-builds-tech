import { useMemo } from "react"
import getConfig from "next/config"
import useImage from "../../../hooks/useImage"
import { IStep2Props } from "./step-2.component"

const { publicRuntimeConfig } = getConfig()

function useCanSave(
  payloadData: IStep2Props["payloadData"],
  submitStatus: IStep2Props["submitStatus"],
  formikProps: IStep2Props["formikProps"]
): {
  canSave: boolean
  waitingForRender: boolean
} {
  const selectedImageHref = useMemo(() => {
    if (payloadData.type === "blueprint") {
      return payloadData._links.rendering_thumb?.href || formikProps.values.cover.url
    }

    return formikProps.values.cover.hash
      ? `${publicRuntimeConfig.apiUrl}/payloads/${formikProps.values.cover.hash}/rendering/thumb`
      : null
  }, [payloadData._links.rendering_thumb?.href, formikProps.values.cover.url, formikProps.values.cover.hash])
  const { loaded: renderIsReady } = useImage(selectedImageHref || undefined)

  const { canSave, waitingForRender } = useMemo(() => {
    const waitingForRender = formikProps.values.cover.type === "hash" && !renderIsReady

    return {
      canSave: !waitingForRender && !submitStatus.loading && formikProps.isValid,
      waitingForRender,
    }
  }, [renderIsReady, submitStatus.loading, formikProps.isValid, formikProps.values.cover.type])

  return { canSave, waitingForRender }
}

export default useCanSave
