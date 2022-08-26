import React, { useCallback } from "react"
import cx from "classnames"
import Link from "next/link"
import { Media } from "../../../design/styles/media"
import { IFullBuild } from "../../../types/models"
import Container from "../../ui/Container"
import * as S from "./build-page.styles"
import { TPayload } from "./usePayload"

export type ITabComponentProps = {
  children?: React.ReactNode
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
    <S.TabsWrapper className={cx({ "is-zoomed": props.isZoomedIn })}>
      <S.TabsInnerWrapper>
        <Container size="medium">
          <S.TabsItems orientation="horizontal" gutter={32}>
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
                  <S.Tab className={cx({ "is-active": isCurrentTab(tab) })}>
                    {tab.label}
                  </S.Tab>
                </Link>
              )

              if (tab.mobileOnly) {
                return (
                  <Media lessThan="sm" key={tab.key}>
                    {(mcx, renderChildren) => {
                      return renderChildren ? <Tab className={mcx} /> : null
                    }}
                  </Media>
                )
              }

              return <Tab key={tab.label} />
            })}
          </S.TabsItems>
        </Container>
      </S.TabsInnerWrapper>

      {props.before}

      <Container direction="column" size="medium">
        <S.TabsContent>
          <S.TabsContentInner>
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
          </S.TabsContentInner>
          <Media greaterThanOrEqual="sm">
            {(mcx, renderChildren) => {
              return renderChildren ? (
                <S.TabsAside className={mcx}>{props.aside}</S.TabsAside>
              ) : null
            }}
          </Media>
        </S.TabsContent>
      </Container>
    </S.TabsWrapper>
  )
}

export default Tabs
