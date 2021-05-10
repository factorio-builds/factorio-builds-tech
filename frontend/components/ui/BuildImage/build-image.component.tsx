import React, { useEffect, useMemo, useRef } from "react"
import { IThinBuild } from "../../../types/models"
import * as SC from "./build-image.styles"

const generateSrcSet = (src: string) => {
  return Array.from({ length: 20 })
    .slice(1)
    .map((_, index) => {
      const width = index * 100
      return `${src}?width=${width}&format=jpg&quality=75 ${width}w`
    })
    .join(", ")
}

interface IBuildImageProps {
  image: IThinBuild["_links"]["cover"]
}

function BuildImage({ image }: IBuildImageProps): JSX.Element {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const observerRef = useRef<ResizeObserver | null>(null)

  const srcSet = useMemo(() => {
    return generateSrcSet(image.href)
  }, [image.href])

  const handleMount = () => {
    if (!imageRef.current) return
    if (typeof window === "undefined") return

    observerRef.current = new ResizeObserver(
      ([entry]: ResizeObserverEntry[]) => {
        requestAnimationFrame(() => {
          const { width } = entry.contentRect
          if (!imageRef.current) return

          const imgEl = imageRef.current
          const widthToRender = Math.ceil(Math.floor(width) / 100) * 100

          if (imgEl.sizes !== `${widthToRender}px`) {
            imgEl.sizes = `${widthToRender}px`
          }

          if (imgEl.srcset !== srcSet) {
            imgEl.srcset = srcSet
          }
        })
      }
    )

    observerRef.current.observe(imageRef.current)
  }

  useEffect(() => {
    if (!imageRef.current) return

    handleMount()

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  return (
    <SC.OuterWrapper
      style={{ "--ratio": image.width / image.height } as React.CSSProperties}
    >
      <SC.InnerWrapper>
        <img
          // TODO: use the upcoming blur as the default image
          src={`${image.href}?width=500&format=jpg&quality=75`}
          ref={imageRef}
          style={{ width: "100%", height: "auto" }}
          alt=""
        />
      </SC.InnerWrapper>
    </SC.OuterWrapper>
  )
}

export default BuildImage
