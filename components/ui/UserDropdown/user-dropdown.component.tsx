import React, { useState } from "react"
import cx from "classnames"
import Link from "next/link"
import { User } from "../../../db/entities/user.entity"
import Caret from "../../../icons/caret"
import * as SC from "./user-dropdown.styles"

interface IUserDropdownProps {
  user: User
}

function UserDropdown(props: IUserDropdownProps): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <SC.DropdownWrapper className={cx({ "is-open": open })}>
      <SC.Dropdown>
        <SC.User onClick={() => setOpen((prev) => !prev)}>
          <SC.Avatar>{props.user.name[0]}</SC.Avatar>
          <span>{props.user.name}</span>
          <Caret />
        </SC.User>
        <SC.DropdownContent>
          <SC.Spacer />
          <Link href="/logout">
            <SC.InnerLink>log off</SC.InnerLink>
          </Link>
        </SC.DropdownContent>
      </SC.Dropdown>
    </SC.DropdownWrapper>
  )
}

export default UserDropdown
