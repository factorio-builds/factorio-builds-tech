import React, { useMemo } from "react"
import { useToggle } from "react-use"
import Link from "next/link"
import { NextRouter } from "next/router"
import { IFullBuild } from "../../../types/models"
import { isBook } from "../../../utils/build"
import BuildHeader from "../../ui/BuildHeader"
import BuildImage from "../../ui/BuildImage"
import Container from "../../ui/Container"
import LayoutDefault from "../../ui/LayoutDefault"
import Stacker from "../../ui/Stacker"
import * as S from "./build-page.styles"
import Glow from "./glow.component"
import Tabs from "./tabs.component"
import BlueprintJsonTab from "./tabs/blueprint-json-tab.component"
import BlueprintStringTab from "./tabs/blueprint-string-tab.component"
import BlueprintsTab from "./tabs/blueprints-tab.component"
import DetailsTab from "./tabs/details-tab.component"
import ImageMobileTab from "./tabs/image-mobile-tab.component"
import RequiredItemsTab from "./tabs/required-items-tab.component"
import usePayload from "./usePayload"

interface IBuildPageProps {
  build: IFullBuild
  router: NextRouter
}

function BuildPage({ build, router }: IBuildPageProps): JSX.Element {
  const payload = usePayload(build)
  const [zoomedImage, toggleZoomedImage] = useToggle(false)

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

  const buildImage = (
    <S.BuildImage>
      {build._links.cover ? (
        <S.ImageWrapper role="button" onClick={toggleZoomedImage}>
          <BuildImage image={build._links.cover} />
        </S.ImageWrapper>
      ) : (
        "No image"
      )}
    </S.BuildImage>
  )

  return (
    <S.LayoutWrapper>
      <LayoutDefault title={build.title}>
        <BuildHeader build={build} payload={payload} />

        <Tabs
          build={build}
          current={router.query.tab as string | undefined}
          tabs={tabs}
          payload={payload}
          isZoomedIn={zoomedImage}
          before={
            zoomedImage ? (
              <S.ZoomedImage>
                <Container size="medium">
                  {buildImage}
                  <S.GlowWrapper>
                    <Glow color1="blue" color2="green" color3="red" />
                  </S.GlowWrapper>
                </Container>
              </S.ZoomedImage>
            ) : undefined
          }
          aside={
            <Stacker orientation="vertical" gutter={16}>
              {build._links.edit && (
                <Link href={`/${build.owner.username}/${build.slug}/edit`}>
                  <S.EditBuild>{"edit build"}</S.EditBuild>
                </Link>
              )}
              {!zoomedImage && buildImage}
            </Stacker>
          }
        />
      </LayoutDefault>
    </S.LayoutWrapper>
  )
}

export default BuildPage
