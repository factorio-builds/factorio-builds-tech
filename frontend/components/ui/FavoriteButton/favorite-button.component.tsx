import React, { useCallback, useState } from "react"
import cx from "classnames"
import { useApi } from "../../../hooks/useApi"
import { useAppSelector } from "../../../redux/store"
import { IFullBuild } from "../../../types/models"
import { IButtonProps } from "../Button/button.component"
import * as SC from "./favorite-button.styles"

interface IFavoriteButtonProps extends IButtonProps {
  build: IFullBuild
}

const FavoriteButton: React.FC<IFavoriteButtonProps> = ({
  build,
  ...restProps
}) => {
  const links = build._links

  const authUser = useAppSelector((state) => state.auth?.user)
  const [{ loading, error }, execute] = useApi(
    { url: links.followers.href },
    { manual: true }
  )

  const [count, setCount] = useState(build._links.followers.count)
  const [isFavorite, setIsFavorite] = useState(Boolean(links.remove_favorite))

  const toggle = useCallback(() => {
    execute({ method: isFavorite ? "DELETE" : "PUT" }).then(() => {
      setIsFavorite((prevFavorite) => !prevFavorite)
      execute().then((res) => {
        setCount(res.data.count)
      })
    })
  }, [isFavorite])

  return (
    <SC.FavoriteButtonWrapper
      onClick={authUser ? toggle : undefined}
      className={cx({
        "is-error": error,
        "is-clickable": authUser,
      })}
      counter={count}
      {...restProps}
    >
      {isFavorite ? "Unfavorite" : "Favorite"}
      {loading && "..."}
    </SC.FavoriteButtonWrapper>
  )
}

export default FavoriteButton
