import React from "react"
import cx from "classnames"
import isEqual from "lodash/isEqual"
import * as S from "../build-page.styles"
import { ITabComponentProps } from "../tabs.component"

const Tab: React.FC<ITabComponentProps> = (props) => {
  return (
    <S.TabWrapper className={cx({ "is-active": props.isActive })}>
      {props.children}
    </S.TabWrapper>
  )
}

export default React.memo(Tab, isEqual)
