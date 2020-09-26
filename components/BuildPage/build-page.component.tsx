import cx from "classnames"
import React, { useMemo, useState } from "react"
import { format, formatDistanceToNow, parseISO } from "date-fns"

import Layout from "../Layout"
import { IBuild } from "../../types"
import Caret from "../../icons/caret"
import { decodeBlueprint } from "../../utils/blueprint"
import * as SC from "./build-page.styles"

interface IBuildPageProps {
  build: IBuild
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
      // TODO: format
      return JSON.stringify(blueprintJSON)
    }

    return build.blueprint
  }, [build.blueprint, blueprintFormat])

  const formatDate = (isoString: string) => {
    return format(parseISO(isoString), "yyyy-MM-dd")
  }

  const formatSince = (isoString: string) => {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
  }

  return (
    <Layout
      title={`${
        build ? build.name : "Build Detail"
      } | Next.js + TypeScript Example`}
      sidebar={
        <SC.BuildImage>
          <img src="/mock-image.png" alt="Sample image" />
        </SC.BuildImage>
      }
    >
      <SC.Wrapper>
        <SC.Heading>
          <h1>{build.name}</h1>
        </SC.Heading>
        <SC.Content>
          <SC.Aside>
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
            <AsideGroup title="Categories">{build.metadata.type}</AsideGroup>
            <AsideGroup title="Game state">{build.metadata.state}</AsideGroup>
            <AsideGroup title="Required items">required items...</AsideGroup>
          </SC.Aside>
          <SC.Main>
            <SC.MainTitle>Description</SC.MainTitle>

            <SC.MainContent>
              <p>ID: {build.id}</p>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Distinctio, cum beatae voluptate deleniti error suscipit
                adipisci veniam laboriosam numquam animi et perspiciatis
                repellendus eveniet. Excepturi assumenda nam sapiente ullam
                illo?
              </p>
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
