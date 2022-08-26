import React, { useCallback, useState } from "react"
import { useToggle } from "react-use"
import { usePress } from "@react-aria/interactions"
import cx from "classnames"
import Link from "next/link"
import useImage from "../../../hooks/useImage"
import Caret from "../../../icons/caret"
import Editor from "../../../icons/editor"
import Raw from "../../../icons/raw"
import { IBlueprintPayload, IFullPayload } from "../../../types/models"
import { countEntities, isBook } from "../../../utils/build"
import { useBlueprintItemExplorer } from "../BlueprintItemExplorer/blueprint-item-explorer.provider"
import BlueprintRequiredItems from "../BlueprintRequiredItems"
import BuildIcon from "../BuildIcon"
import Button from "../Button"
import { CopyStringToClipboard } from "../ButtonClipboard/button-clipboard.component"
import RichText from "../RichText"
import Spinner from "../Spinner"
import Stacker from "../Stacker"
import * as SC from "./blueprint-item.styles"

interface IBaseBlueprintItemProps {
  hash: IFullPayload["hash"]
  depth: number
  isBook: boolean
  title: IFullPayload["label"]
  icons: IFullPayload["icons"]
  description: IFullPayload["description"]
  image: IFullPayload["_links"]["rendering"]
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
  raw?: IFullPayload["_links"]["raw"]
  encoded?: IFullPayload["encoded"]
}

type IBlueprintItemProps =
  | IBlueprintItemPropsBook
  | IBlueprintItemPropsBlueprint

function BlueprintItem(props: IBlueprintItemProps): JSX.Element {
  const bpItemExplorer = useBlueprintItemExplorer()
  const [expanded, setExpanded] = useState(false)
  const [zoomedImage, toggleZoomedImage] = useToggle(false)
  const { loaded: imageIsLoaded } = useImage(props.image?.href)
  const { pressProps } = usePress({
    onPress: toggleZoomedImage,
  })

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

  const renderImage = () => {
    if (!props.image) {
      return null
    }

    return (
      <SC.ImageWrapper>
        {imageIsLoaded ? (
          <img
            {...pressProps}
            className={cx({ "is-zoomed": zoomedImage })}
            src={props.image.href}
            alt=""
            width={200}
          />
        ) : (
          <SC.SpinnerWrapper>
            <Spinner />
          </SC.SpinnerWrapper>
        )}
      </SC.ImageWrapper>
    )
  }

  return (
    <SC.BlueprintItemWrapper
      css={{
        marginLeft: `${props.depth > 0 ? 40 : 0}px`,
      }}
      className={cx({
        "is-expanded": expanded,
        "is-highlighted":
          !props.isBook &&
          bpItemExplorer.type === "selectable" &&
          bpItemExplorer.selectedHash === props.hash,
      })}
    >
      <SC.BlueprintItemInner>
        <SC.Content>
          <SC.Title orientation="horizontal" gutter={8}>
            {props.icons.length > 0 && <BuildIcon icons={props.icons} />}
            <Stacker orientation="vertical" gutter={4}>
              <RichText input={title} />
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
            <>
              {!props.isBook &&
                bpItemExplorer.type === "readOnly" &&
                (props.raw || props.encoded) && (
                  <SC.Buttons gutter={8} orientation="horizontal">
                    {!props.isBook && props.raw && (
                      <Link href={props.raw.href} passHref>
                        <Button as="a" variant="default" size="small">
                          <Raw />
                          Raw
                        </Button>
                      </Link>
                    )}
                    {!props.isBook && props.raw && (
                      <Link
                        href={`https://fbe.teoxoy.com/?source=${props.raw.href}`}
                        passHref
                      >
                        <Button as="a" variant="default" size="small">
                          <Editor />
                          View in editor
                        </Button>
                      </Link>
                    )}
                    {!props.isBook && props.encoded && (
                      <CopyStringToClipboard
                        toCopy={props.encoded}
                        variant="cta"
                        size="small"
                      />
                    )}
                  </SC.Buttons>
                )}
              {props.image && zoomedImage && (
                <SC.ZoomedImage>{renderImage()}</SC.ZoomedImage>
              )}
              <SC.Info>
                {props.image && !zoomedImage && renderImage()}
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
                  {!props.isBook && bpItemExplorer.type === "selectable" && (
                    <SC.SelectRenderButton
                      variant="alt"
                      type="button"
                      onClick={(e) => bpItemExplorer.onSelect(e, props.hash)}
                    >
                      Select render
                    </SC.SelectRenderButton>
                  )}
                </SC.InnerContent>
              </SC.Info>
            </>
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
                    hash={node.hash}
                    depth={props.depth + 1}
                    isBook={true}
                    title={node.label}
                    icons={node.icons}
                    description={node.description}
                    image={node._links.rendering}
                    nodes={node.children}
                  />
                )
              }

              return (
                <BlueprintItem
                  key={node.hash}
                  hash={node.hash}
                  depth={props.depth + 1}
                  isBook={false}
                  title={node.label}
                  icons={node.icons}
                  description={node.description}
                  image={node._links.rendering}
                  raw={node._links.raw}
                  encoded={node.encoded}
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
