import React, { useCallback, useMemo } from "react"
import cx from "classnames"
import Image from "next/image"
import Link from "next/link"
import { NextRouter } from "next/router"
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
import ImageMobileTab from "./tabs/image-mobile-tab.component"
import RequiredItemsTab from "./tabs/required-items-tab.component"
import usePayload, { TPayload } from "./usePayload"
import Links from "../../ui/Links"
import { Media } from "../../../design/styles/media"

interface IBuildPageProps {
  build: IFullBuild
  router: NextRouter
}

export type ITabComponentProps = {
  build: IFullBuild
  isActive: boolean
  payload: TPayload
}

export type TTabComponent = (props: ITabComponentProps) => JSX.Element

interface ITab {
  key: string
  label: string
  tab: TTabComponent
  mobileOnly?: boolean
}

interface ITabs {
  build: IFullBuild
  current?: string
  tabs: ITab[]
  payload: TPayload
  aside: React.ReactElement
}

const Tabs = (props: ITabs): JSX.Element => {
  const isCurrentTab = useCallback(
    (tab: ITab) => {
      if (!props.current && tab.key === "details") {
        return true
      }

      return tab.key === props.current
    },
    [props.current]
  )

  return (
    <SC.TabsWrapper>
      <Stacker orientation="horizontal" gutter={16}>
        {props.tabs.map((tab) => {
          const Tab = (innerProps: { className?: string }) => (
            <Link
              {...innerProps}
              key={tab.label}
              href={{
                pathname: `/${props.build.owner.username}/${props.build.slug}`,
                query: { tab: tab.key },
              }}
              passHref
            >
              <SC.Tab className={cx({ "is-active": isCurrentTab(tab) })}>
                {tab.label}
              </SC.Tab>
            </Link>
          )

          if (tab.mobileOnly) {
            return (
              <Media lessThan="sm">
                {(mcx, renderChildren) => {
                  return renderChildren ? <Tab className={mcx} /> : null
                }}
              </Media>
            )
          }

          return <Tab />
        })}
      </Stacker>
      <SC.TabsContent orientation="horizontal" gutter={16}>
        <SC.TabsContentInner>
          {props.tabs.map((tab) => {
            const { tab: Tab } = tab

            return (
              <Tab
                key={tab.label}
                build={props.build}
                payload={props.payload}
                isActive={isCurrentTab(tab)}
              />
            )
          })}
        </SC.TabsContentInner>
        <Media greaterThanOrEqual="sm">
          {(mcx, renderChildren) => {
            return renderChildren ? (
              <SC.TabsAside className={mcx}>{props.aside}</SC.TabsAside>
            ) : null
          }}
        </Media>
      </SC.TabsContent>
    </SC.TabsWrapper>
  )
}

function BuildPage({ build, router }: IBuildPageProps): JSX.Element {
  const payload = usePayload(build)

  const tabs = useMemo(() => {
    if (isBook(build.latest_version.payload)) {
      const childrenLength =
        payload.data && isBook(payload.data) && payload.data.children
          ? payload.data.children.length
          : "..."

      return [
        { key: "details", label: "details", tab: DetailsTab },
        {
          key: "blueprints",
          label: `blueprints (${childrenLength})`,
          tab: BlueprintsTab,
        },
        {
          key: "image-mobile",
          label: `blueprint image`,
          tab: ImageMobileTab,
          mobileOnly: true,
        },
        {
          key: "blueprint-string",
          label: "blueprint string",
          tab: BlueprintStringTab,
        },
        {
          key: "blueprint-json",
          label: "blueprint json",
          tab: BlueprintJsonTab,
        },
      ]
    } else {
      return [
        { key: "details", label: "details", tab: DetailsTab },
        {
          key: "required-items",
          label: "required items",
          tab: RequiredItemsTab,
        },
        {
          key: "image-mobile",
          label: `blueprint image`,
          tab: ImageMobileTab,
          mobileOnly: true,
        },
        {
          key: "blueprint-string",
          label: "blueprint string",
          tab: BlueprintStringTab,
        },
        {
          key: "blueprint-json",
          label: "blueprint json",
          tab: BlueprintJsonTab,
        },
      ]
    }
  }, [build.latest_version.hash, payload.data])

  return (
    <Layout title={build.title} size="medium">
      <BuildHeader build={build} payload={payload} />

      <Tabs
        build={build}
        current={router.query.tab as string | undefined}
        tabs={tabs}
        payload={payload}
        aside={
          <Stacker orientation="vertical" gutter={16}>
            {build._links.edit && (
              <Link href={`/${build.owner.username}/${build.slug}/edit`}>
                <SC.EditBuild>{"edit build"}</SC.EditBuild>
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

      <SC.Footer>
        <Links orientation="horizontal" />
      </SC.Footer>
    </Layout>
  )
}

export default BuildPage
