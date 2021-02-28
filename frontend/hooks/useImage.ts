import { useState, useEffect } from "react"

const useImage = (src?: string) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (!src) {
      return
    }

    setFetching(true)
    setLoaded(false)
    setError(false)

    const image = new Image()
    image.src = src

    const handleError = () => {
      setError(true)
      setFetching(false)
    }

    const handleLoad = () => {
      setLoaded(true)
      setError(false)
      setFetching(false)
    }

    image.onerror = handleError
    image.onload = handleLoad

    return () => {
      image.removeEventListener("error", handleError)
      image.removeEventListener("load", handleLoad)
    }
  }, [src])

  return { loaded, error, fetching }
}

export default useImage
