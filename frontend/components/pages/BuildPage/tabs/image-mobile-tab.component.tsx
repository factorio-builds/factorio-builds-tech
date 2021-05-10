import React from "react"
import getConfig from "next/config"
import Image from "next/image"
import * as SC from "../build-page.styles"
import { TTabComponent } from "../tabs.component"
import Tab from "./tab.component"

const { publicRuntimeConfig } = getConfig()

const ImageMobileTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <SC.BuildImage>
        {props.build._links.cover ? (
          <Image
            loader={({ src }) =>
              `${publicRuntimeConfig.apiUrl}/images/covers/${src}?width=700&format=jpg&quality=75`
            }
            src={props.build._links.cover.href}
            alt=""
            width={props.build._links.cover.width}
            height={props.build._links.cover.height}
            layout="responsive"
          />
        ) : (
          "No image"
        )}
      </SC.BuildImage>
    </Tab>
  )
}

export default ImageMobileTab
