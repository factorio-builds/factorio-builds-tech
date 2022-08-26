import React, { useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Media } from "../../../design/styles/media"
import Burger from "../../../icons/burger"
import { useAppDispatch, useAppSelector } from "../../../redux/store"
import Container from "../Container"
import UserDropdown from "../UserDropdown"
import * as S from "./header.styles"

const Header = React.forwardRef<HTMLElement>(function Header(_, ref) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const router = useRouter()

  const toggleSidebar = useCallback(() => {
    dispatch({
      type: "TOGGLE_SIDEBAR",
    })
  }, [])

  return (
    <S.HeaderWrapper ref={ref}>
      <Container>
        {router.pathname === "/" && (
          <Media lessThan="sm">
            {(mcx, renderChildren) => {
              return renderChildren ? (
                <S.BurgerButton
                  className={mcx}
                  role="button"
                  onClick={toggleSidebar}
                >
                  <Burger />
                </S.BurgerButton>
              ) : null
            }}
          </Media>
        )}

        <Link href="/">
          <a aria-label="Factorio Builds">
            <S.StyledLogo />
          </a>
        </Link>

        <S.StyledStacker orientation="horizontal" gutter={18}>
          <Media greaterThanOrEqual="sm">
            {(mcx, renderChildren) => {
              return renderChildren && user ? (
                <Link href="/build/create">
                  <S.CreateBuildButton className={mcx}>
                    Add a build
                  </S.CreateBuildButton>
                </Link>
              ) : null
            }}
          </Media>

          {!user && (
            <Link href="/api/auth/login" passHref>
              <S.InnerLink>Login</S.InnerLink>
            </Link>
          )}

          {user && <UserDropdown user={user} />}
        </S.StyledStacker>
      </Container>
    </S.HeaderWrapper>
  )
})

export default Header
