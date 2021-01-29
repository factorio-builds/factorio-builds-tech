import React from "react"
import { useCallback } from "react"
import Copy from "../../../icons/copy"
import Button from "../../ui/Button"

const CopyToClipboard: React.FC<{ toCopy: string }> = (props) => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(props.toCopy)
  }, [props.toCopy])

  return (
    <Button variant="alt" onClick={copyToClipboard}>
      <Copy /> {props.children}
    </Button>
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

export const CopyJsonToClipboard: React.FC<{ toCopy: string }> = (props) => {
  return (
    <MemoizedCopyToClipboard toCopy={props.toCopy}>
      copy JSON to clipboard
    </MemoizedCopyToClipboard>
  )
}
