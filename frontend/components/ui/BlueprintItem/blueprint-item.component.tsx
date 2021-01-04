import React, { useCallback, useState } from "react"
import Caret from "../../../icons/caret"
// import Image from "next/image"
import { IFullPayload } from "../../../types/models"
import { countEntities, isBook } from "../../../utils/build"
import BuildIcon from "../BuildIcon"
import Stacker from "../Stacker"
import WithIcons from "../WithIcons"
import * as SC from "./blueprint-item.styles"

interface IBlueprintItemProps {
  depth: number
  isBook: boolean
  title: IFullPayload["blueprint"]["label"]
  icons: IFullPayload["blueprint"]["icons"]
  description: IFullPayload["blueprint"]["description"]
  // image: IFullPayload["_links"]["cover"]
  nodes?: IFullPayload[] | null
  entities?: IFullPayload["blueprint"]["entities"]
}

function BlueprintItem(props: IBlueprintItemProps): JSX.Element {
  const [expanded, setExpanded] = useState(false)

  const title = props.title || "[unnamed]"
  console.log(props)

  const expand = useCallback(
    () => setExpanded((prevExpanded) => !prevExpanded),
    [expanded]
  )

  const isExpandable = props.nodes || props.description

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
              {props.isBook && props.nodes ? (
                <SC.Meta>Contains {props.nodes.length} blueprints</SC.Meta>
              ) : (
                <SC.Meta>
                  Contains {countEntities(props.entities)} entities
                </SC.Meta>
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
      {props.nodes && expanded && (
        <SC.Expanded>
          {props.nodes.map((node) => (
            <BlueprintItem
              key={node.hash}
              depth={props.depth + 1}
              isBook={isBook(node)}
              title={node.blueprint.label}
              icons={node.blueprint.icons}
              description={node.blueprint.description}
              // image={node._links.cover}
              nodes={node.children}
              entities={node.blueprint.entities}
            />
          ))}
        </SC.Expanded>
      )}
    </SC.BlueprintItemWrapper>
  )
}

export default BlueprintItem
