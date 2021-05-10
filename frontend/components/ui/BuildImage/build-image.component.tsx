import React from "react"
import Image from "next/image"
import { IThinBuild } from "../../../types/models"

interface IBuildImageProps {
  image: IThinBuild["_links"]["cover"]
  /* @temporary */
  forcedWidth: number
}

function BuildImage({ image, forcedWidth }: IBuildImageProps): JSX.Element {
  return (
    <Image
      loader={({ src }) => `${src}?width=${forcedWidth}&format=jpg&quality=75`}
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
