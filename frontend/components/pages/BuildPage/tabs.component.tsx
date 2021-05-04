import React, { useCallback } from "react"
import cx from "classnames"
import Link from "next/link"
import { DesktopOnly, MobileOnly } from "../../../design/helpers/media"
import { IFullBuild } from "../../../types/models"
import Container from "../../ui/Container"
import * as SC from "./build-page.styles"
import { TPayload } from "./usePayload"

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

interface ITabsProps {
  build: IFullBuild
  current?: string
  tabs: ITab[]
  payload: TPayload
  before?: React.ReactElement
  aside: React.ReactElement
  isZoomedIn: boolean
}

const Tabs = (props: ITabsProps): JSX.Element => {
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
    <SC.TabsWrapper className={cx({ "is-zoomed": props.isZoomedIn })}>
      <SC.TabsInnerWrapper>
        <Container size="medium">
          <SC.TabsItems orientation="horizontal" gutter={32}>
            {props.tabs.map((tab) => {
              const Tab = (innerProps: { className?: string }) => (
                <Link
                  {...innerProps}
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
                  <MobileOnly key={tab.key}>
                    <Tab />
                  </MobileOnly>
                )
              }

              return <Tab key={tab.label} />
            })}
          </SC.TabsItems>
        </Container>
      </SC.TabsInnerWrapper>

      {props.before}

      <Container direction="column" size="medium">
        <SC.TabsContent>
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
          <DesktopOnly>
            <SC.TabsAside>{props.aside}</SC.TabsAside>
          </DesktopOnly>
        </SC.TabsContent>
      </Container>
    </SC.TabsWrapper>
  )
}

export default Tabs
