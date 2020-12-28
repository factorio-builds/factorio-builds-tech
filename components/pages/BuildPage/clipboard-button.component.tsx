import React from "react"
import { useCallback } from "react"
import { Build } from "../../../db/entities/build.entity"
import Copy from "../../../icons/copy"
import Button from "../../ui/Button"
import * as SC from "./build-page.styles"

const CopyToClipboard: React.FC<{ toCopy: string }> = (props) => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(props.toCopy)
  }, [props.toCopy])

  return (
    <SC.CopyClipboardWrapper>
      <Button variant="alt" onClick={copyToClipboard}>
        <Copy /> {props.children}
      </Button>
    </SC.CopyClipboardWrapper>
  )
}

const MemoizedCopyToClipboard = React.memo<typeof CopyToClipboard>(
  CopyToClipboard
)

export const CopyStringToClipboard: React.FC<{ toCopy: string }> = (props) => {
  return (
    <MemoizedCopyToClipboard toCopy={props.toCopy}>
      copy to clipboard
    </MemoizedCopyToClipboard>
  )
}

export const CopyJsonToClipboard: React.FC<{ toCopy: Build["json"] }> = (
  props
) => {
  return (
    <MemoizedCopyToClipboard toCopy={JSON.stringify(props.toCopy, null, 1)}>
      copy JSON to clipboard
    </MemoizedCopyToClipboard>
  )
}
