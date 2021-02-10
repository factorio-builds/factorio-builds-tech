import React, { useState } from "react"
import cx from "classnames"
import Link from "next/link"
import Caret from "../../../icons/caret"
import { IStoreUser } from "../../../types/models"
import Avatar from "../Avatar"
import * as SC from "./user-dropdown.styles"

interface IUserDropdownProps {
  user: IStoreUser
}

function UserDropdown(props: IUserDropdownProps): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <SC.DropdownWrapper className={cx({ "is-open": open })}>
      <SC.Dropdown>
        <SC.User onClick={() => setOpen((prev) => !prev)}>
          <Avatar username={props.user.username} size="medium" />
          <span>{props.user.username}</span>
          <Caret />
        </SC.User>
        <SC.DropdownContent>
          <SC.Spacer />
          <Link href="/api/logout">
            <SC.InnerLink>log off</SC.InnerLink>
          </Link>
        </SC.DropdownContent>
      </SC.Dropdown>
    </SC.DropdownWrapper>
  )
}

export default UserDropdown
