import useImage from "../../../hooks/useImage"

function useImageRenderIsReady(src?: string) {
  const { loaded } = useImage(src)

  return loaded
}

export default useImageRenderIsReady
