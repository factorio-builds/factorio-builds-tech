import React from "react"
import getConfig from "next/config"
import Image from "next/image"
import { IThinBuild } from "../../../types/models"

const { publicRuntimeConfig } = getConfig()

interface IBuildImageProps {
  image: IThinBuild["_links"]["cover"]
  /* @temporary */
  forcedWidth: number
}

function BuildImage({ image, forcedWidth }: IBuildImageProps): JSX.Element {
  return (
    <Image
      loader={({ src }) =>
        `${publicRuntimeConfig.apiUrl}/images/covers/${src}?width=${forcedWidth}&format=jpg&quality=75`
      }
      src={image.href}
      alt=""
      width={image.width}
      height={image.height}
      layout="responsive"
      sizes="300px"
    />
  )
}

export default BuildImage
