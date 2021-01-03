import React from "react"
import cx from "classnames"
import isEqual from "lodash/isEqual"
import { ITabComponentProps } from "../build-page.component"
import * as SC from "../build-page.styles"

const Tab: React.FC<ITabComponentProps> = (props) => {
  return (
    <SC.TabWrapper className={cx({ "is-active": props.isActive })}>
      {props.children}
    </SC.TabWrapper>
  )
}

export default React.memo(Tab, isEqual)
