import React from "react"
import { MediaBreakpointProps } from "@artsy/fresnel/dist/Media"
import cx from "classnames"
import { Media } from "../styles/media"

interface IMediaProps {
  children: React.ReactNode
}

interface IPrivateMediaProps
  extends IMediaProps,
    MediaBreakpointProps<"xs" | "sm" | "md" | "lg"> {}

function MediaOnly({ children, ...restProps }: IPrivateMediaProps) {
  return (
    <Media {...restProps}>
      {(mcx, renderChildren) => {
        if (!renderChildren) {
          return null
        }

        return React.Children.map(children, (child) => {
          // checking isValidElement is the safe way and avoids a typescript error too
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              className: cx(child.props.className, mcx),
            })
          }
          return child
        })
      }}
    </Media>
  )
}

export function MobileOnly(props: IMediaProps): JSX.Element {
  return <MediaOnly lessThan="sm" {...props} />
}

export function DesktopOnly(props: IMediaProps): JSX.Element {
  return <MediaOnly greaterThanOrEqual="sm" {...props} />
}
