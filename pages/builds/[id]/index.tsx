import cx from "classnames"
import { useState } from "react"
import { GetServerSideProps } from "next"
import { format, formatDistanceToNow, parseISO } from "date-fns"

import { IBuild } from "../../../types"
import Layout from "../../../components/Layout"
import Caret from "../../../icons/caret"
import * as SC from "./[id].styles"

interface IBuildsPageProps {
  build?: IBuild
  errors?: string
}

const AsideGroup: React.FC<{ title?: string }> = (props) => {
  return (
    <SC.AsideGroup>
      <SC.AsideGroupTitle>{props.title}</SC.AsideGroupTitle>
      {props.children}
    </SC.AsideGroup>
  )
}

const BuildsPage = ({ build, errors }: IBuildsPageProps) => {
  const [blueprintExpanded, setBlueprintExpanded] = useState(false)

  const toggleExpandBlueprint = () => {
    setBlueprintExpanded((expanded) => !expanded)
  }

  if (errors || !build) {
    return (
      <Layout title="Error | Next.js + TypeScript Example">
        <p>
          <span style={{ color: "red" }}>Error:</span> {errors}
        </p>
      </Layout>
    )
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

export default BuildsPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const id = params?.id

    const build: IBuild = await fetch(
      "http://localhost:3000/api/builds/" + id
    ).then((res) => res.json())

    if (!build) throw new Error("Build not found")

    return { props: { build } }
  } catch (err) {
    return { props: { errors: err.message } }
  }
}
