import React, { useCallback, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { useSelector } from "react-redux"
import cx from "classnames"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { Build } from "../../../db/entities/build.entity"
import { useCategories } from "../../../hooks/useCategories"
import { useGameStates } from "../../../hooks/useGameStates"
import Caret from "../../../icons/caret"
import Copy from "../../../icons/copy"
import { IStoreState } from "../../../redux/store"
import { ERole } from "../../../types"
import { getCountPerItem, isBook } from "../../../utils/blueprint"
import { getIcons } from "../../../utils/build"
import BuildIcon from "../../ui/BuildIcon"
import BuildSubheader from "../../ui/BuildSubheader"
import Button from "../../ui/Button"
import Layout from "../../ui/Layout"
import Stacker from "../../ui/Stacker"
import * as SC from "./build-page.styles"

const RequiredItem: React.FC<{ itemName: string; count: number }> = (props) => {
  const iconSrc = `https://d3s5hh02rbjbr5.cloudfront.net/img/icons/large/${props.itemName}.png`

  return (
    <SC.WithRequiredItem>
      <span>{props.count}</span>
      <SC.IconImg src={iconSrc} />
      <span>{props.itemName.replace(/-/g, " ")}</span>
    </SC.WithRequiredItem>
  )
}

const MetadataWithIcon: React.FC<{ itemName: string }> = (props) => {
  const iconSrc = `https://d3s5hh02rbjbr5.cloudfront.net/img/icons/large/${props.itemName}.png`

  return (
    <SC.WithItem>
      <SC.IconImg src={iconSrc} />
      <span>{props.children}</span>
    </SC.WithItem>
  )
}

interface IBuildPageProps {
  build: Build
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
  const user = useSelector((state: IStoreState) => state.auth.user)
  const [blueprintExpanded, setBlueprintExpanded] = useState(false)
  const { getGameState } = useGameStates()
  const { getCategory } = useCategories()
  const [blueprintFormat, setBlueprintFormat] = useState<"base64" | "json">(
    "base64"
  )

  const toggleExpandBlueprint = () => {
    setBlueprintExpanded((expanded) => !expanded)
  }

  const itemsCount = useMemo(() => {
    if (!isBook(build.json)) {
      return getCountPerItem(build.json.blueprint)
    }
    return {}
  }, [build.blueprint])

  const formatDate = (isoString: string) => {
    return format(parseISO(isoString), "yyyy-MM-dd")
  }

  const formatSince = (isoString: string) => {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
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

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(build.blueprint)
  }, [build.blueprint])

  const isAdmin = user?.roleName === ERole.ADMIN
  const ownedByMe = build.owner.id === user?.id
  const state = getGameState(build.metadata.state)

  return (
    <Layout
      title={build.name}
      subheader={<BuildSubheader build={build} isBook={isBook(build.json)} />}
      sidebar={
        <SC.BuildImage>
          {build.image ? (
            <Image
              src={build.image.src}
              alt=""
              width={build.image.width}
              height={build.image.height}
              layout="responsive"
            />
          ) : (
            "No image"
          )}
        </SC.BuildImage>
      }
    >
      <SC.Wrapper>
        <SC.Content>
          <SC.Aside>
            <SC.CopyClipboardWrapper>
              <Button variant="alt" onClick={copyToClipboard}>
                <Copy /> copy to clipboard
              </Button>
            </SC.CopyClipboardWrapper>
            {(isAdmin || ownedByMe) && (
              <AsideGroup>
                <Link href={`/build/${build.id}/edit`}>
                  <SC.EditBuild>
                    {ownedByMe ? "edit build" : "edit build as admin"}
                  </SC.EditBuild>
                </Link>
              </AsideGroup>
            )}
            <AsideGroup>by {build.owner.name}</AsideGroup>
            <AsideGroup>
              <SC.AsideSubGroup>
                published on <b>{formatDate(build.createdAt)}</b>
                <br />({formatSince(build.createdAt)})
              </SC.AsideSubGroup>
              <SC.AsideSubGroup>
                edited on <b>{formatDate(build.updatedAt)}</b>
                <br />({formatSince(build.updatedAt)})
              </SC.AsideSubGroup>
            </AsideGroup>
            <AsideGroup title="Categories">
              {build.metadata.categories.map((categoryName) => {
                const category = getCategory(categoryName)

                return (
                  <MetadataWithIcon
                    key={category.value}
                    itemName={category.iconName}
                  >
                    {category.name}
                  </MetadataWithIcon>
                )
              })}
            </AsideGroup>
            <AsideGroup title="Game state">
              <MetadataWithIcon itemName={state.iconName}>
                {state.name}
              </MetadataWithIcon>
            </AsideGroup>
            <AsideGroup title="Extra">
              <SC.AsideSubGroup>
                Inputs are marked:
                {build.metadata.withMarkedInputs ? "yes" : "no"}
              </SC.AsideSubGroup>
              <SC.AsideSubGroup>
                Tileable: {build.metadata.tileable ? "yes" : "no"}
              </SC.AsideSubGroup>
              <SC.AsideSubGroup>
                With beacons: {build.metadata.withBeacons ? "yes" : "no"}
              </SC.AsideSubGroup>
            </AsideGroup>
            {!isBook(build.json) && (
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

            {isBook(build.json) && (
              <AsideGroup title="Blueprints">
                <Stacker gutter={4}>
                  {build.json.blueprint_book.blueprints.map((bp, index) => {
                    const icons = getIcons(bp.blueprint)
                    return (
                      <SC.BlueprintItem key={index}>
                        {icons && <BuildIcon icons={icons} />}
                        {bp.blueprint.label}
                      </SC.BlueprintItem>
                    )
                  })}
                </Stacker>
              </AsideGroup>
            )}
          </SC.Aside>
          <SC.Main>
            <Stacker gutter={8}>
              <SC.MainTitle>Description</SC.MainTitle>

              <SC.MainContent>
                {build.description ? (
                  <ReactMarkdown source={build.description} />
                ) : (
                  <em>No description provided</em>
                )}
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
                    value={
                      blueprintFormat === "json"
                        ? JSON.stringify(build.json, null, 1)
                        : build.blueprint
                    }
                    rows={5}
                    readOnly
                    onClick={(e) => e.currentTarget.select()}
                  />
                </SC.Blueprint>
              )}
            </Stacker>
          </SC.Main>
        </SC.Content>
      </SC.Wrapper>
    </Layout>
  )
}

export default BuildPage
