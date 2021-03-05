import React from "react"
import Link from "next/link"
import Github from "../../../icons/github"
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
          <Github /> Github
        </SC.StyledLink>
      </Link>
    </SC.LinksWrapper>
  )
}

export default Links
