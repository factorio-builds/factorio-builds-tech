import React from "react"
import cx from "classnames"
import Stacker from "../../ui/Stacker"
import * as SC from "./build-form-page.styles"

export type TPage = "data" | "cover"

interface IPagerProps {
  currentPage: TPage
  goToPage: (page: TPage) => void
}

const Pager: React.FC<IPagerProps> = (props) => {
  return (
    <SC.Row>
      <Stacker orientation="horizontal" gutter={24}>
        <SC.PageButton
          className={cx({ "is-active": props.currentPage === "data" })}
          onClick={() => props.goToPage("data")}
        >
          <SC.PageNumber>1</SC.PageNumber> Data
        </SC.PageButton>
        <SC.PageButton
          className={cx({ "is-active": props.currentPage === "cover" })}
          onClick={() => props.goToPage("cover")}
        >
          <SC.PageNumber>2</SC.PageNumber> Cover
        </SC.PageButton>
      </Stacker>
    </SC.Row>
  )
}

export default Pager
