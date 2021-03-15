import React from "react"
import Link from "next/link"
import GitHub from "../../../icons/github"
import { Line } from "../../../icons/line"
import * as SC from "./links.styles"

interface ILinksProps {
  orientation: "horizontal" | "vertical"
}

const Links = (props: ILinksProps): JSX.Element => {
  return (
    <SC.LinksWrapper orientation={props.orientation}>
      <Link
        href="https://github.com/factorio-builds/factorio-builds-tech"
        passHref
      >
        <SC.StyledLink target="_blank">
          <GitHub /> GitHub
        </SC.StyledLink>
      </Link>
      <Link href="/about">
        <SC.StyledLink>
          {props.orientation === "vertical" && <Line />}
          About
        </SC.StyledLink>
      </Link>
    </SC.LinksWrapper>
  )
}

export default Links
