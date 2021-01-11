import React from "react"
import ReactMarkdown from "react-markdown"
// import Stacker from "../../../ui/Stacker"
import { TTabComponent } from "../build-page.component"
import * as SC from "../build-page.styles"
import { CopyStringToClipboard } from "../clipboard-button.component"
import Tab from "./tab.component"

interface IQuickInfoProps {
  label: string
  value: boolean
}

const QuickInfo = ({ label, value }: IQuickInfoProps): JSX.Element => {
  return (
    <div>
      {label}: {value ? "yes" : "no"}
    </div>
  )
}

const DetailsTab: TTabComponent = (props) => {
  return (
    <Tab {...props}>
      <CopyStringToClipboard
        toCopy={props.build.latest_version.payload.encoded}
      />

      {/* <h3>Quick info</h3>
      <Stacker orientation="vertical" gutter={4}>
        <QuickInfo
          label="Inputs are marked"
          value={props.build.metadata.withMarkedInputs}
        />
        <QuickInfo label="Tileable" value={props.build.metadata.tileable} />
        <QuickInfo
          label="With beacons"
          value={props.build.metadata.withBeacons}
        />
      </Stacker> */}

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
