import React from "react"
import ReactMarkdown from "react-markdown"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import Tab from "./tab.component"

const DetailsTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <h3>Description</h3>
      <SC.Description>
        {props.build.description ? (
          <ReactMarkdown source={props.build.description} />
        ) : (
          <em>No description provided</em>
        )}
      </SC.Description>
    </Tab>
  )
}

export default DetailsTab
