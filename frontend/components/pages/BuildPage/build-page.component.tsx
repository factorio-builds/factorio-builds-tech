import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import cx from "classnames"
import Image from "next/image"
import Link from "next/link"
import { IStoreState } from "../../../redux/store"
// import { ERole } from "../../../types"
import { IFullBuild } from "../../../types/models"
import { isBook } from "../../../utils/build"
import BuildHeader from "../../ui/BuildHeader"
import Layout from "../../ui/Layout"
import Stacker from "../../ui/Stacker"
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

  // const isAdmin = user?.roleName === ERole.ADMIN
  const ownedByMe = build.owner.username === user?.username

  const tabs = useMemo(() => {
    if (isBook(build.latest_version.payload)) {
      const childrenLength =
        payload.data && isBook(payload.data) && payload.data.children
          ? payload.data.children.length
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
      <BuildHeader build={build} />

      <Tabs
        build={build}
        tabs={tabs}
        payload={payload}
        aside={
          <Stacker orientation="vertical" gutter={16}>
            {/* {(isAdmin || ownedByMe) && ( */}
            {ownedByMe && (
              <Link href={`/${build.owner.username}/${build.slug}/edit`}>
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
