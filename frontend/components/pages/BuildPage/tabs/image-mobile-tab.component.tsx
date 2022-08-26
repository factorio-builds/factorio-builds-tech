import React from "react"
import BuildImage from "../../../ui/BuildImage"
import * as S from "../build-page.styles"
import { TTabComponent } from "../tabs.component"
import Tab from "./tab.component"

const ImageMobileTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <S.BuildImage>
        {props.build._links.cover ? (
          <BuildImage image={props.build._links.cover} />
        ) : (
          "No image"
        )}
      </S.BuildImage>
    </Tab>
  )
}

export default ImageMobileTab
