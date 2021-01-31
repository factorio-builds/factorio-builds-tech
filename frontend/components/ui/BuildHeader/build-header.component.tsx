import React from "react"
import Link from "next/link"
// import { useCategories } from "../../../hooks/useCategories"
// import { useGameStates } from "../../../hooks/useGameStates"
import { IFullBuild } from "../../../types/models"
import { formatDate, formatSince } from "../../../utils/date"
import BuildIcon from "../BuildIcon"
import Button from "../Button"
import { CopyStringToClipboard } from "../ButtonClipboard/button-clipboard.component"
import FavoriteButton from "../FavoriteButton"
import Stacker from "../Stacker"
import Tooltip from "../Tooltip"
import WithIcons from "../WithIcons"
import * as SC from "./build-header.styles"

interface IBuildheader {
  build: IFullBuild
}

function Buildheader(props: IBuildheader): JSX.Element {
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
          <span>
            created{" "}
            <Tooltip content={formatSince(props.build.created_at)}>
              <b>{formatDate(props.build.created_at)}</b>
            </Tooltip>
          </span>
          <span>
            updated at{" "}
            <Tooltip content={formatSince(props.build.updated_at)}>
              <b>{formatDate(props.build.updated_at)}</b>
            </Tooltip>
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
          <CopyStringToClipboard
            toCopy={props.build.latest_version.payload.encoded}
            variant="default"
            size="small"
          />
        </Stacker>
      </Stacker>
    </SC.BuildHeaderWrapper>
  )
}

export default Buildheader
