import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { useRouter } from "next/router"
import { Media } from "../../../design/styles/media"
import Burger from "../../../icons/burger"
import { IStoreState } from "../../../redux/store"
import Container from "../Container"
import UserDropdown from "../UserDropdown"
import * as SC from "./header.styles"

function Header(): JSX.Element {
  const dispatch = useDispatch()
  const user = useSelector((state: IStoreState) => state.auth.user)
  const router = useRouter()

  const toggleSidebar = useCallback(() => {
    dispatch({
      type: "TOGGLE_SIDEBAR",
    })
  }, [])

  return (
    <SC.HeaderWrapper>
      <Container>
        {router.pathname === "/" && (
          <Media lessThan="sm">
            {(mcx, renderChildren) => {
              return renderChildren ? (
                <SC.BurgerButton
                  className={mcx}
                  role="button"
                  onClick={toggleSidebar}
                >
                  <Burger />
                </SC.BurgerButton>
              ) : null
            }}
          </Media>
        )}

        <Link href="/">
          <a aria-label="Factorio Builds">
            <SC.StyledLogo />
          </a>
        </Link>

        <SC.StyledStacker orientation="horizontal" gutter={18}>
          {user && (
            <Link href="/build/create">
              <SC.CreateBuildButton>Add a build</SC.CreateBuildButton>
            </Link>
          )}

          {!user && (
            <Link href="/api/login" passHref>
              <SC.InnerLink>Login</SC.InnerLink>
            </Link>
          )}

          {user && <UserDropdown user={user} />}
        </SC.StyledStacker>
      </Container>
    </SC.HeaderWrapper>
  )
}

export default Header
