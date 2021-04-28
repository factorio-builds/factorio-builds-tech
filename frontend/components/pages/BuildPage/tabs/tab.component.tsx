import React from "react"
import cx from "classnames"
import isEqual from "lodash/isEqual"
import * as SC from "../build-page.styles"
import { ITabComponentProps } from "../tabs.component"

const Tab: React.FC<ITabComponentProps> = (props) => {
  return <SC.TabWrapper className={cx({ "is-active": props.isActive })}>{props.children}</SC.TabWrapper>
}

export default React.memo(Tab, isEqual)
