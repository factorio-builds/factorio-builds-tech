import React from "react"
import ReactMarkdown from "react-markdown"
import * as S from "../build-page.styles"
import { TTabComponent } from "../tabs.component"
import Tab from "./tab.component"

const DetailsTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <h3>Description</h3>
      <S.Description>
        {props.build.description ? (
          <ReactMarkdown>{props.build.description}</ReactMarkdown>
        ) : (
          <em>No description provided</em>
        )}
      </S.Description>
    </Tab>
  )
}

export default DetailsTab
