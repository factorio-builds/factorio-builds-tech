import React from "react"
import { useCallback } from "react"
import Copy from "../../../icons/copy"
import Button from "../../ui/Button"
import { IButtonProps } from "../Button/button.component"

interface ICopyToClipboardProps extends IButtonProps {
  toCopy: string
}

const CopyToClipboard = ({
  toCopy,
  children,
  ...restProps
}: React.PropsWithChildren<ICopyToClipboardProps>): JSX.Element => {
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(toCopy)
  }, [toCopy])

  return (
    <Button onClick={copyToClipboard} {...restProps}>
      <Copy /> {children}
    </Button>
  )
}

const MemoizedCopyToClipboard = React.memo<typeof CopyToClipboard>(
  CopyToClipboard
)

export const CopyStringToClipboard = ({
  toCopy,
  ...restProps
}: ICopyToClipboardProps): JSX.Element => {
  return (
    <MemoizedCopyToClipboard toCopy={toCopy} {...restProps}>
      Copy to clipboard
    </MemoizedCopyToClipboard>
  )
}

export const CopyJsonToClipboard = ({
  toCopy,
  ...restProps
}: ICopyToClipboardProps): JSX.Element => {
  return (
    <MemoizedCopyToClipboard toCopy={toCopy} {...restProps}>
      Copy JSON to clipboard
    </MemoizedCopyToClipboard>
  )
}
