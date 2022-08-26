import React from "react"
import Link from "next/link"
import GitHub from "../../../icons/github"
import { Line } from "../../../icons/line"
import * as S from "./links.styles"

interface ILinksProps {
  orientation: "horizontal" | "vertical"
}

const Links = (props: ILinksProps): JSX.Element => {
  return (
    <S.LinksWrapper orientation={props.orientation}>
      <Link
        href="https://github.com/factorio-builds/factorio-builds-tech"
        passHref
      >
        <S.StyledLink target="_blank">
          <GitHub /> GitHub
        </S.StyledLink>
      </Link>
      <Link href="/about" passHref>
        <S.StyledLink>
          {props.orientation === "vertical" && <Line />}
          About
        </S.StyledLink>
      </Link>
    </S.LinksWrapper>
  )
}

export default Links
