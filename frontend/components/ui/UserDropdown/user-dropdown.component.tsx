import React, { useMemo } from "react"
import { useDispatch } from "react-redux"
import { useRouter } from "next/router"
import { Media } from "../../../design/styles/media"
import { IStoreUser } from "../../../types/models"
import { logout } from "../../../utils/auth"
import Avatar from "../Avatar"
import Dropdown from "../Dropdown"
import * as SC from "./user-dropdown.styles"

interface IUserDropdownProps {
  user: IStoreUser
}

function UserDropdown(props: IUserDropdownProps): JSX.Element {
  const router = useRouter()
  const dispatch = useDispatch()

  const links = useMemo(
    () => [
      {
        action: () => {
          router.push(`/${props.user.username}/builds`)
        },
        body: <SC.InnerLink>my builds</SC.InnerLink>,
      },
      {
        action: () => {
          logout(dispatch)
          router.push("/api/auth/logout")
        },
        body: <SC.InnerLinkLogOff>log off</SC.InnerLinkLogOff>,
      },
    ],
    [props.user.username]
  )

  return (
    <Dropdown links={links}>
      <Avatar username={props.user.username} size="medium" />
      <Media greaterThanOrEqual="sm">
        {(mcx, renderChildren) => {
          return renderChildren ? (
            <span className={mcx}>{props.user.username}</span>
          ) : null
        }}
      </Media>
    </Dropdown>
  )
}

export default UserDropdown
