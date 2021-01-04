import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import cx from "classnames"
import { format, formatDistanceToNow, parseISO } from "date-fns"
import Image from "next/image"
import Link from "next/link"
// import { useCategories } from "../../../hooks/useCategories"
// import { useGameStates } from "../../../hooks/useGameStates"
import { IStoreState } from "../../../redux/store"
// import { ERole } from "../../../types"
import { IFullBuild } from "../../../types"
import { isBook } from "../../../utils/build"
import BuildIcon from "../../ui/BuildIcon"
import Layout from "../../ui/Layout"
import Stacker from "../../ui/Stacker"
import WithIcons from "../../ui/WithIcons"
import * as SC from "./build-page.styles"
import BlueprintJsonTab from "./tabs/blueprint-json-tab.component"
import BlueprintStringTab from "./tabs/blueprint-string-tab.component"
import BlueprintsTab from "./tabs/blueprints-tab.component"
import DetailsTab from "./tabs/details-tab.component"
import RequiredItemsTab from "./tabs/required-items-tab.component"
import usePayload, { TPayload } from "./usePayload"

interface IBuildPageProps {
  build: IFullBuild
}

export type ITabComponentProps = {
  build: IFullBuild
  isActive: boolean
  payload: TPayload
}

export type TTabComponent = (props: ITabComponentProps) => JSX.Element

interface ITab {
  label: string
  tab: TTabComponent
}

interface ITabs {
  build: IFullBuild
  tabs: ITab[]
  payload: TPayload
  aside: React.ReactElement
}

const Tabs = (props: ITabs): JSX.Element => {
  const [currentTab, setCurrentTab] = useState(0)

  useEffect(() => {
    setCurrentTab(0)
  }, [props.build.latest_version.hash])

  return (
    <SC.TabsWrapper>
      <Stacker orientation="horizontal" gutter={16}>
        {props.tabs.map((tab, index) => (
          <SC.Tab
            key={tab.label}
            onClick={() => setCurrentTab(index)}
            className={cx({ "is-active": currentTab === index })}
          >
            {tab.label}
          </SC.Tab>
        ))}
      </Stacker>
      <SC.TabsContent orientation="horizontal" gutter={16}>
        <SC.TabsContentInner>
          {props.tabs.map((tab, index) => {
            const { tab: Tab } = tab

            return (
              <Tab
                key={tab.label}
                build={props.build}
                payload={props.payload}
                isActive={currentTab === index}
              />
            )
          })}
        </SC.TabsContentInner>
        <SC.TabsAside>{props.aside}</SC.TabsAside>
      </SC.TabsContent>
    </SC.TabsWrapper>
  )
}

function BuildPage({ build }: IBuildPageProps): JSX.Element {
  const user = useSelector((state: IStoreState) => state.auth.user)
  const payload = usePayload(build)

  // const { getGameState } = useGameStates()
  // const { getCategory } = useCategories()

  const formatDate = (isoString: string) => {
    return format(parseISO(isoString), "yyyy-MM-dd")
  }

  const formatSince = (isoString: string) => {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
  }

  // const isAdmin = user?.roleName === ERole.ADMIN
  const ownedByMe = build.owner.username === user?.name
  // const gameStates = build.metadata.state.map(getGameState)

  const tabs = useMemo(() => {
    if (isBook(build)) {
      const childrenLength =
        !payload.error && !payload.loading && payload.data
          ? // TODO: define payload type
            (payload.data as any).children.length
          : "..."

      return [
        { label: "details", tab: DetailsTab },
        {
          label: `blueprints (${childrenLength})`,
          tab: BlueprintsTab,
        },
        { label: "blueprint string", tab: BlueprintStringTab },
        { label: "blueprint json", tab: BlueprintJsonTab },
      ]
    } else {
      return [
        { label: "details", tab: DetailsTab },
        { label: "required items", tab: RequiredItemsTab },
        { label: "blueprint string", tab: BlueprintStringTab },
        { label: "blueprint json", tab: BlueprintJsonTab },
      ]
    }
  }, [build.latest_version.hash, payload.data])

  return (
    <Layout title={build.title}>
      <SC.BuildHeader>
        <Stacker orientation="vertical" gutter={16}>
          <Stacker orientation="horizontal" gutter={16}>
            {build.icons.length > 0 && (
              <BuildIcon icons={build.icons} size="large" />
            )}
            <Stacker orientation="vertical" gutter={8}>
              <SC.BuildTitle>
                <WithIcons input={build.title} />
              </SC.BuildTitle>
              <Stacker orientation="horizontal" gutter={16}>
                {/* {gameStates.map((gameState) => (
                  <SC.BuildHeaderMeta key={gameState.value}>
                    {gameState.icon} {gameState.name}
                  </SC.BuildHeaderMeta>
                ))} */}
                {/* {build.metadata.categories.map((categoryName) => {
                  const category = getCategory(categoryName)

                  return (
                    <SC.BuildHeaderMeta key={category.name}>
                      {category.icon} {category.name}
                    </SC.BuildHeaderMeta>
                  )
                })} */}
              </Stacker>
            </Stacker>
          </Stacker>
          <Stacker orientation="horizontal" gutter={16}>
            <span>
              by <b>{build.owner.display_name}</b>
            </span>
            {/* prettier-ignore */}
            <span>
              created <b>{formatDate(build.created_at)}</b> ({formatSince(build.created_at)})
            </span>
            {/* prettier-ignore */}
            <span>
              updated at <b>{formatDate(build.updated_at)}</b> ({formatSince(build.updated_at)})
            </span>
          </Stacker>
        </Stacker>
      </SC.BuildHeader>

      <Tabs
        build={build}
        tabs={tabs}
        payload={payload}
        aside={
          <Stacker orientation="vertical" gutter={16}>
            {/* {(isAdmin || ownedByMe) && ( */}
            {ownedByMe && (
              <Link href={`/builds/${build.owner.username}/${build.slug}/edit`}>
                <SC.EditBuild>
                  {ownedByMe ? "edit build" : "edit build as admin"}
                </SC.EditBuild>
              </Link>
            )}
            <SC.BuildImage>
              {build._links.cover ? (
                <Image
                  src={build._links.cover.href}
                  alt=""
                  width={build._links.cover.width}
                  height={build._links.cover.height}
                  layout="responsive"
                />
              ) : (
                "No image"
              )}
            </SC.BuildImage>
          </Stacker>
        }
      />
    </Layout>
  )
}

export default BuildPage
