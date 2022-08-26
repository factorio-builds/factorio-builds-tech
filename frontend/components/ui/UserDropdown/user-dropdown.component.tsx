import React, { useMemo } from "react"
import { useRouter } from "next/router"
import { Media } from "../../../design/styles/media"
import { useAppDispatch } from "../../../redux/store"
import { IStoreUser } from "../../../types/models"
import { logout } from "../../../utils/auth"
import Avatar from "../Avatar"
import Dropdown from "../Dropdown"
import * as S from "./user-dropdown.styles"

interface IUserDropdownProps {
  user: IStoreUser
}

function UserDropdown(props: IUserDropdownProps): JSX.Element {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const links = useMemo(
    () => [
      {
        action: () => {
          router.push(`/${props.user.username}/builds`)
        },
        body: <S.InnerLink>my builds</S.InnerLink>,
      },
      {
        action: () => {
          logout(dispatch)
          router.push("/api/auth/logout")
        },
        body: <S.InnerLinkLogOff>log off</S.InnerLinkLogOff>,
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
