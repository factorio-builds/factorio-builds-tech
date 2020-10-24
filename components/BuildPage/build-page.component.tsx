import cx from "classnames"
import React, { useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { format, formatDistanceToNow, parseISO } from "date-fns"

import Layout from "../Layout"
import { IBuildWithJson } from "../../types"
import Caret from "../../icons/caret"
import { decodeBlueprint, getCountPerItem, isBook } from "../../utils/blueprint"
import { mockedImages } from "../../utils/mock-images-data"
import * as SC from "./build-page.styles"

const RequiredItem: React.FC<{ itemName: string; count: number }> = (props) => {
  const iconSrc = `https://d3s5hh02rbjbr5.cloudfront.net/img/icons/large/${props.itemName}.png`

  return (
    <SC.StyledRequiredItem>
      {props.count}
      <SC.IconImg src={iconSrc} />
      {props.itemName.replace(/-/g, " ")}
    </SC.StyledRequiredItem>
  )
}

interface IBuildPageProps {
  build: IBuildWithJson
}

const AsideGroup: React.FC<{ title?: string }> = (props) => {
  return (
    <SC.AsideGroup>
      <SC.AsideGroupTitle>{props.title}</SC.AsideGroupTitle>
      {props.children}
    </SC.AsideGroup>
  )
}

function BuildPage({ build }: IBuildPageProps): JSX.Element {
  const [blueprintExpanded, setBlueprintExpanded] = useState(false)
  const [blueprintFormat, setBlueprintFormat] = useState<"base64" | "json">(
    "base64"
  )

  const toggleExpandBlueprint = () => {
    setBlueprintExpanded((expanded) => !expanded)
  }

  const blueprintJSON = decodeBlueprint(build.blueprint)

  const blueprintData = useMemo(() => {
    if (blueprintFormat === "json") {
      return JSON.stringify(blueprintJSON, null, 1)
    }

    return build.blueprint
  }, [build.blueprint, blueprintFormat])

  const itemsCount = useMemo(() => {
    if (!isBook(blueprintJSON)) {
      return getCountPerItem(blueprintJSON.blueprint)
    }
    return {}
  }, [build.blueprint])

  const formatDate = (isoString: string) => {
    return format(parseISO(isoString), "yyyy-MM-dd")
  }

  const formatSince = (isoString: string) => {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
  }

  const formatGameState = (gameState: string) => {
    switch (gameState) {
      case "early_game":
        return "Early-game"
      case "mid_game":
        return "Mid-game"
      case "late_game":
        return "Late-game"
    }
  }

  const sortedRequiredItems = useMemo(() => {
    return Object.keys(itemsCount)
      .map((itemName) => {
        return {
          count: itemsCount[itemName],
          name: itemName,
        }
      })
      .sort((a, b) => {
        if (a.count === b.count) return 0

        return a.count < b.count ? 1 : -1
      })
  }, [itemsCount])

  return (
    <Layout
      title={build.name}
      subheader={
        <>
          <h1>{build.name}</h1>
          {isBook(blueprintJSON) && (
            <SC.HeadingSmall>
              <SC.Book src="/img/blueprint-book.png" /> Blueprint book
            </SC.HeadingSmall>
          )}
        </>
      }
      sidebar={
        <SC.BuildImage>
          <img src={mockedImages[0].src} alt="Sample image" />
        </SC.BuildImage>
      }
    >
      <SC.Wrapper>
        <SC.Content>
          <SC.Aside>
            <AsideGroup>by {build.owner.name}</AsideGroup>
            <AsideGroup>
              <SC.AsideSubGroup>
                published on <b>{formatDate(build?.createdAt)}</b>
                <br />({formatSince(build.createdAt)})
              </SC.AsideSubGroup>
              <SC.AsideSubGroup>
                edited on <b>{formatDate(build.updatedAt)}</b>
                <br />({formatSince(build.updatedAt)})
              </SC.AsideSubGroup>
            </AsideGroup>
            <AsideGroup title="Categories">
              {build.metadata.categories.map((category) => (
                <div>{category}</div>
              ))}
            </AsideGroup>
            <AsideGroup title="Game state">
              {formatGameState(build.metadata.state)}
            </AsideGroup>
            {!isBook(blueprintJSON) && (
              <AsideGroup title="Required items">
                {sortedRequiredItems.map((item) => {
                  return (
                    <RequiredItem
                      key={item.name}
                      itemName={item.name}
                      count={item.count}
                    />
                  )
                })}
              </AsideGroup>
            )}

            {isBook(blueprintJSON) && (
              <AsideGroup title="Blueprints">
                {blueprintJSON.blueprint_book.blueprints.map((bp, index) => {
                  return <div key={index}>{bp.blueprint.label}</div>
                })}
              </AsideGroup>
            )}
          </SC.Aside>
          <SC.Main>
            <SC.MainTitle>Description</SC.MainTitle>

            <SC.MainContent>
              <ReactMarkdown source={build.description} />
              <p>ID: {build.id}</p>
            </SC.MainContent>

            <SC.ExpandBlueprint onClick={toggleExpandBlueprint}>
              expand blueprint <Caret inverted={blueprintExpanded} />
            </SC.ExpandBlueprint>

            {blueprintExpanded && (
              <SC.Blueprint>
                <SC.TogglerWrapper>
                  <SC.Toggler
                    className={cx({
                      "is-selected": blueprintFormat === "base64",
                    })}
                    onClick={() => setBlueprintFormat("base64")}
                  >
                    base64
                  </SC.Toggler>
                  <SC.Toggler
                    className={cx({
                      "is-selected": blueprintFormat === "json",
                    })}
                    onClick={() => setBlueprintFormat("json")}
                  >
                    json
                  </SC.Toggler>
                </SC.TogglerWrapper>
                <SC.BlueprintData
                  value={blueprintData}
                  rows={5}
                  readOnly
                  onClick={(e) => e.currentTarget.select()}
                />
              </SC.Blueprint>
            )}
          </SC.Main>
        </SC.Content>
      </SC.Wrapper>
    </Layout>
  )
}

export default BuildPage
