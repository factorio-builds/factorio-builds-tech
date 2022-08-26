import React from "react"
import Link from "next/link"
import Editor from "../../../icons/editor"
import Raw from "../../../icons/raw"
import { IFullBuild } from "../../../types/models"
import { formatDate, formatSince } from "../../../utils/date"
import { TPayload } from "../../pages/BuildPage/usePayload"
import BuildIcon from "../BuildIcon"
import Button from "../Button"
import { CopyStringToClipboard } from "../ButtonClipboard/button-clipboard.component"
import Container from "../Container"
import FavoriteButton from "../FavoriteButton"
import RichText from "../RichText"
import Stacker from "../Stacker"
import Tooltip from "../Tooltip"
import * as S from "./build-header.styles"

interface IBuildheader {
  build: IFullBuild
  payload: TPayload
}

function Buildheader(props: IBuildheader): JSX.Element {
  return (
    <>
      <S.SubHeader>
        <Container>
          <Stacker orientation="horizontal" gutter={8}>
            <Link href={`/${props.build.owner.username}/builds`} passHref>
              <S.SubHeaderLink>{props.build.owner.username}</S.SubHeaderLink>
            </Link>
            <span>/</span>
            <span>{props.build.slug}</span>
          </Stacker>
        </Container>
      </S.SubHeader>
      <S.BuildHeaderWrapper>
        <Container size="medium">
          <Stacker orientation="vertical" gutter={16}>
            <Stacker orientation="horizontal" gutter={16}>
              {props.build.icons.length > 0 && (
                <BuildIcon icons={props.build.icons} size="large" />
              )}
              <Stacker orientation="vertical" gutter={8}>
                <S.BuildTitle>
                  <RichText input={props.build.title} />
                </S.BuildTitle>
                <S.BuildTags>
                  {props.build.tags.map((tag) => {
                    return (
                      <S.BuildHeaderMeta key={tag}>{tag}</S.BuildHeaderMeta>
                    )
                  })}
                </S.BuildTags>
              </Stacker>
            </Stacker>
            <Stacker orientation="horizontal" gutter={16}>
              <span>
                by{" "}
                <Link href={`/${props.build.owner.username}/builds`} passHref>
                  <S.StyledLink>{props.build.owner.display_name}</S.StyledLink>
                </Link>
              </span>
              <span>
                created{" "}
                <Tooltip content={formatDate(props.build.created_at)}>
                  <b>{formatSince(props.build.created_at)}</b>
                </Tooltip>
              </span>
              <span>
                updated{" "}
                <Tooltip content={formatDate(props.build.updated_at)}>
                  <b>{formatSince(props.build.updated_at)}</b>
                </Tooltip>
              </span>
            </Stacker>
            <S.Buttons>
              <FavoriteButton build={props.build} size="small" />
              <Link href={props.payload.data?._links.raw.href || ""} passHref>
                <Button
                  as="a"
                  variant="default"
                  size="small"
                  disabled={!props.payload.data}
                >
                  <Raw />
                  Raw
                </Button>
              </Link>
              {props.build.latest_type === "blueprint" && (
                <Link
                  href={`https://fbe.teoxoy.com/?source=${props.payload.data?._links.raw.href}`}
                  passHref
                >
                  <Button
                    as="a"
                    variant="default"
                    size="small"
                    disabled={!props.payload.data}
                  >
                    <Editor />
                    View in editor
                  </Button>
                </Link>
              )}
              <CopyStringToClipboard
                toCopy={props.build.latest_version.payload.encoded}
                variant="cta"
                size="small"
              />
            </S.Buttons>
          </Stacker>
        </Container>
      </S.BuildHeaderWrapper>
    </>
  )
}

export default Buildheader
