import React, { useMemo } from "react"
import cx from "classnames"
import ThumbsUp from "../../../icons/thumbs-up"
import Stacker from "../../ui/Stacker"
import * as SC from "./build-form-page.styles"

export type TPage = "data" | "cover"

interface IPageState {
  isValid: boolean
  optional?: boolean
}

interface IPageButton {
  stateKey: TPage
  number: number
  title: string
  isActive: boolean
  isValid: boolean
  isOptional?: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const PageButton = (props: IPageButton): JSX.Element => {
  const status = useMemo(() => {
    if (props.isOptional) {
      return "Optional"
    }

    if (props.isValid) {
      return (
        <>
          <ThumbsUp /> <span>Valid</span>
        </>
      )
    }

    return "Incomplete"
  }, [props.isValid, props.isOptional])

  return (
    <SC.PageButton
      role="button"
      tabIndex={0}
      orientation="horizontal"
      gutter={8}
      className={cx({ "is-active": props.isActive })}
      onClick={props.onClick}
    >
      <SC.PageNumber>{props.number}</SC.PageNumber>
      <SC.PageBody orientation="vertical" gutter={4}>
        <span>{props.title}</span>
        <SC.PageFeedback
          orientation="horizontal"
          gutter={8}
          className={cx({
            "is-valid": props.isValid,
            "is-optional": props.isOptional,
          })}
        >
          {status}
        </SC.PageFeedback>
      </SC.PageBody>
    </SC.PageButton>
  )
}

interface IPagerProps {
  currentPage: TPage
  pagesState: Record<TPage, IPageState>
  goToPage: (page: TPage) => void
}

const Pager: React.FC<IPagerProps> = (props) => {
  return (
    <Stacker orientation="horizontal" gutter={16}>
      <PageButton
        stateKey="data"
        number={1}
        title="Data"
        isActive={props.currentPage === "data"}
        isValid={props.pagesState.data.isValid}
        isOptional={props.pagesState.data.optional}
        onClick={() => props.goToPage("data")}
      />
      <PageButton
        stateKey="cover"
        number={2}
        title="Cover"
        isActive={props.currentPage === "cover"}
        isValid={props.pagesState.cover.isValid}
        isOptional={props.pagesState.cover.optional}
        onClick={() => props.goToPage("cover")}
      />
    </Stacker>
  )
}

export default Pager
