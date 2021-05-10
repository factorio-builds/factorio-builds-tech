import React from "react"
import BuildImage from "../../../ui/BuildImage"
import * as SC from "../build-page.styles"
import { TTabComponent } from "../tabs.component"
import Tab from "./tab.component"

const ImageMobileTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <SC.BuildImage>
        {props.build._links.cover ? (
          <BuildImage image={props.build._links.cover} forcedWidth={700} />
        ) : (
          "No image"
        )}
      </SC.BuildImage>
    </Tab>
  )
}

export default ImageMobileTab
