import React, { useCallback, useState } from "react"
import cx from "classnames"
import Caret from "../../../icons/caret"
import { IBlueprintPayload, IFullPayload } from "../../../types/models"
import { countEntities, isBook } from "../../../utils/build"
import BlueprintRequiredItems from "../BlueprintRequiredItems"
import BuildIcon from "../BuildIcon"
import Stacker from "../Stacker"
import WithIcons from "../WithIcons"
import * as SC from "./blueprint-item.styles"

interface IBaseBlueprintItemProps {
  depth: number
  isBook: boolean
  title: IFullPayload["label"]
  icons: IFullPayload["icons"]
  description: IFullPayload["description"]
  image: IFullPayload["_links"]["rendering_thumb"]
}

interface IBlueprintItemPropsBook extends IBaseBlueprintItemProps {
  isBook: true
  nodes: IFullPayload[]
  children?: React.ReactNode
}

interface IBlueprintItemPropsBlueprint extends IBaseBlueprintItemProps {
  isBook: false
  entities: IBlueprintPayload["entities"]
  tiles: IBlueprintPayload["tiles"]
  children?: React.ReactNode
  highlighted?: boolean
}

type IBlueprintItemProps =
  | IBlueprintItemPropsBook
  | IBlueprintItemPropsBlueprint

function BlueprintItem(props: IBlueprintItemProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)

  const title = props.title || "[unnamed]"

  const expand = useCallback(
    () => setExpanded((prevExpanded) => !prevExpanded),
    [expanded]
  )

  const isExpandable = props.isBook || props.description || props.image

  const renderEntities = (
    entities: IBlueprintPayload["entities"],
    tiles: IBlueprintPayload["tiles"]
  ) => {
    const entitiesData = {
      count: countEntities(entities),
      name: "entity|entities",
    }
    const tilesData = {
      count: countEntities(tiles),
      name: "tile|tiles",
    }

    if (!entitiesData.count && !tilesData.count) {
      return null
    }

    return `Contains ${[entitiesData, tilesData]
      .filter((d) => d.count)
      .map((d) => {
        const [single, plural] = d.name.split("|")
        const singleOrPlural = d.count === 1 ? single : plural
        return `${d.count} ${singleOrPlural}`
      })
      .join(" & ")}`
  }

  return (
    <SC.BlueprintItemWrapper
      depth={props.depth}
      className={cx({
        "is-expanded": expanded,
        "is-highlighted": !props.isBook && props.highlighted,
      })}
    >
      <SC.BlueprintItemInner>
        <SC.Content>
          <SC.Title orientation="horizontal" gutter={8}>
            {props.icons.length > 0 && <BuildIcon icons={props.icons} />}
            <Stacker orientation="vertical" gutter={4}>
              <WithIcons input={title} />
              {props.isBook ? (
                <SC.Meta>Contains {props.nodes.length} blueprints</SC.Meta>
              ) : (
                <SC.Meta>{renderEntities(props.entities, props.tiles)}</SC.Meta>
              )}
            </Stacker>
            {isExpandable && (
              <SC.Expand type="button" onClick={expand}>
                expand <Caret inverted={expanded} />
              </SC.Expand>
            )}
          </SC.Title>
          {expanded && (props.image || props.description) && (
            <SC.Info>
              {props.image && (
                <SC.ImageWrapper>
                  <img src={props.image.href} alt="" width={200} />
                </SC.ImageWrapper>
              )}
              <SC.InnerContent orientation="vertical" gutter={16}>
                {props.description && (
                  <SC.Description>
                    {props.description.split("\n").map((text) => (
                      <>
                        {text}
                        <br />
                      </>
                    ))}
                  </SC.Description>
                )}
                {!props.isBook && (props.entities || props.tiles) && (
                  <SC.RequiredItems>
                    <SC.Subtitle>Required items</SC.Subtitle>
                    <BlueprintRequiredItems
                      entities={props.entities}
                      tiles={props.tiles}
                    />
                  </SC.RequiredItems>
                )}
                {props.children}
              </SC.InnerContent>
            </SC.Info>
          )}
        </SC.Content>
      </SC.BlueprintItemInner>
      {props.isBook && expanded && (
        <SC.Expanded>
          {props.nodes &&
            props.nodes.map((node) => {
              if (isBook(node)) {
                return (
                  <BlueprintItem
                    key={node.hash}
                    depth={props.depth + 1}
                    isBook={true}
                    title={node.label}
                    icons={node.icons}
                    description={node.description}
                    image={node._links.rendering_thumb}
                    nodes={node.children}
                  />
                )
              }

              return (
                <BlueprintItem
                  key={node.hash}
                  depth={props.depth + 1}
                  isBook={false}
                  title={node.label}
                  icons={node.icons}
                  description={node.description}
                  image={node._links.rendering_thumb}
                  entities={node.entities}
                  tiles={node.tiles}
                />
              )
            })}
        </SC.Expanded>
      )}
    </SC.BlueprintItemWrapper>
  )
}

export default BlueprintItem
