import React, { useState } from "react"
import { format, formatDistanceToNow, parseISO } from "date-fns"

import Layout from "../Layout"
import { IBuild } from "../../types"
import Caret from "../../icons/caret"
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

  const toggleExpandBlueprint = () => {
    setBlueprintExpanded((expanded) => !expanded)
  }

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
            <AsideGroup>by "author"</AsideGroup>
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
                <SC.Toggler>base64</SC.Toggler>
                <SC.BlueprintData
                  value={build.blueprint}
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
