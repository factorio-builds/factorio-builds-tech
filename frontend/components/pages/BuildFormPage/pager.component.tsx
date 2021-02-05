import React from "react"
import cx from "classnames"
import ThumbsUp from "../../../icons/thumbs-up"
import Stacker from "../../ui/Stacker"
import * as SC from "./build-form-page.styles"

export type TPage = "data" | "cover"

interface IPageState {
  isValid: boolean
}

interface IPageButton {
  stateKey: TPage
  number: number
  title: string
  isActive: boolean
  isValid: boolean
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const PageButton = (props: IPageButton): JSX.Element => {
  return (
    <SC.PageButton
      orientation="horizontal"
      gutter={4}
      className={cx({ "is-active": props.isActive })}
      onClick={props.onClick}
    >
      <SC.PageNumber>{props.number}</SC.PageNumber>
      <SC.PageBody orientation="vertical" gutter={4}>
        <span>{props.title}</span>
        <SC.PageFeedback
          orientation="horizontal"
          gutter={8}
          className={cx({ "is-valid": props.isValid })}
        >
          {props.isValid ? (
            <>
              <ThumbsUp /> <span>Valid</span>
            </>
          ) : (
            "Incomplete"
          )}
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
    <SC.Row>
      <Stacker orientation="horizontal" gutter={24}>
        <PageButton
          stateKey="data"
          number={1}
          title="Data"
          isActive={props.currentPage === "data"}
          isValid={props.pagesState.data.isValid}
          onClick={() => props.goToPage("data")}
        />
        <PageButton
          stateKey="cover"
          number={2}
          title="Cover"
          isActive={props.currentPage === "cover"}
          isValid={props.pagesState.cover.isValid}
          onClick={() => props.goToPage("cover")}
        />
      </Stacker>
    </SC.Row>
  )
}

export default Pager
