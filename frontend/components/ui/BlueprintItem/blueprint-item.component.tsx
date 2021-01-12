import React, { useCallback, useState } from "react"
import Caret from "../../../icons/caret"
// import Image from "next/image"
import { IBlueprintPayload, IFullPayload } from "../../../types/models"
import { countEntities, isBook } from "../../../utils/build"
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
  // image: IFullPayload["_links"]["cover"]
}

interface IBlueprintItemPropsBook extends IBaseBlueprintItemProps {
  isBook: true
  nodes: IFullPayload[]
}

interface IBlueprintItemPropsBlueprint extends IBaseBlueprintItemProps {
  isBook: false
  entities: IBlueprintPayload["entities"]
  tiles: IBlueprintPayload["tiles"]
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

  const isExpandable = props.isBook || props.description

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
    <SC.BlueprintItemWrapper depth={props.depth}>
      <SC.BlueprintItemInner onClick={expand}>
        <SC.ImageWrapper>
          {/* <Image
          src={props.image.href}
          alt=""
          width={props.image.width}
          height={props.image.height}
          layout="responsive"
        /> */}
        </SC.ImageWrapper>
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
              <SC.Expand>
                expand <Caret inverted={expanded} />
              </SC.Expand>
            )}
          </SC.Title>
          {props.description && expanded && (
            <SC.Description>
              {props.description.split("\n").map((text) => (
                <>
                  {text}
                  <br />
                </>
              ))}
            </SC.Description>
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
                    // image={node._links.cover}
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
                  // image={node._links.cover}
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
