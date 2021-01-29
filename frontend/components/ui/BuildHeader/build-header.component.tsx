import React from "react"
import Link from "next/link"
// import { useCategories } from "../../../hooks/useCategories"
// import { useGameStates } from "../../../hooks/useGameStates"
import { IFullBuild } from "../../../types/models"
import { formatDate, formatSince } from "../../../utils/date"
import BuildIcon from "../BuildIcon"
import Button from "../Button"
import FavoriteButton from "../FavoriteButton"
import Stacker from "../Stacker"
import WithIcons from "../WithIcons"
import * as SC from "./build-header.styles"

interface IBuildheader {
  build: IFullBuild
}

function Buildheader(props: IBuildheader): JSX.Element {
  console.log(props)
  // const { getCategory } = useCategories()
  // const { getGameState } = useGameStates()

  // const gameStates = props.build.metadata.state.map(getGameState)
  // const icons = props.build.metadata.icons

  return (
    <SC.BuildHeaderWrapper>
      <Stacker orientation="vertical" gutter={16}>
        <Stacker orientation="horizontal" gutter={16}>
          {props.build.icons.length > 0 && (
            <BuildIcon icons={props.build.icons} size="large" />
          )}
          <Stacker orientation="vertical" gutter={8}>
            <SC.BuildTitle>
              <WithIcons input={props.build.title} />
            </SC.BuildTitle>
            <Stacker orientation="horizontal" gutter={16}>
              {/* {gameStates.map((gameState) => (
                  <SC.BuildHeaderMeta key={gameState.value}>
                    {gameState.icon} {gameState.name}
                  </SC.BuildHeaderMeta>
                ))} */}
              {props.build.tags.map((tag) => {
                return <SC.BuildHeaderMeta key={tag}>{tag}</SC.BuildHeaderMeta>
              })}
            </Stacker>
          </Stacker>
        </Stacker>
        <Stacker orientation="horizontal" gutter={16}>
          <span>
            by{" "}
            <Link href={`/${props.build.owner.username}/builds`} passHref>
              <SC.StyledLink>{props.build.owner.display_name}</SC.StyledLink>
            </Link>
          </span>
          {/* prettier-ignore */}
          <span>
              created <b>{formatDate(props.build.created_at)}</b> ({formatSince(props.build.created_at)})
            </span>
          {/* prettier-ignore */}
          <span>
              updated at <b>{formatDate(props.build.updated_at)}</b> ({formatSince(props.build.updated_at)})
            </span>
        </Stacker>
        <Stacker orientation="horizontal" gutter={8}>
          <FavoriteButton build={props.build} size="small" />
          <Button variant="default" size="small">
            Raw
          </Button>
          <Button variant="default" size="small">
            View in editor
          </Button>
          <Button variant="default" size="small">
            Copy to clipboard
          </Button>
        </Stacker>
      </Stacker>
    </SC.BuildHeaderWrapper>
  )
}

export default Buildheader
