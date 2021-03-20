import React from "react"
import Image from "next/image"
import * as SC from "../build-page.styles"
import { TTabComponent } from "../tabs.component"
import Tab from "./tab.component"

const ImageMobileTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <SC.BuildImage>
        {props.build._links.cover ? (
          <Image
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
