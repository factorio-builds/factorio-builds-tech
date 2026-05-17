import React from "react"
import GitHub from "../../../icons/github"
import { Line } from "../../../icons/line"
import * as S from "./links.styles"

interface ILinksProps {
  orientation: "horizontal" | "vertical"
}

const Links = (props: ILinksProps): JSX.Element => {
  return (
    <S.LinksWrapper orientation={props.orientation}>
      <S.StyledLink
        href="https://github.com/factorio-builds/factorio-builds-tech"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHub /> GitHub
      </S.StyledLink>
      <S.StyledRouterLink to="/about">
        {props.orientation === "vertical" && <Line />}
        About
      </S.StyledRouterLink>
    </S.LinksWrapper>
  )
}

export default Links
