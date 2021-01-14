import React, { useCallback } from "react"
import { useSelector } from "react-redux"
import cx from "classnames"
import { useApi } from "../../../hooks/useApi"
import { IStoreState } from "../../../redux/store"
import { IFullBuild, IUser } from "../../../types/models"
import * as SC from "./favorite-button.styles"

interface IFavoriteButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {
  owner: IFullBuild["owner"]["username"]
  slug: IFullBuild["slug"]
}

const FavoriteButton: React.FC<IFavoriteButtonProps> = ({ owner, slug }) => {
  const authUser = useSelector((state: IStoreState) => state.auth?.user)
  const { data, loading, error, execute: refetch } = useApi({
    url: `/builds/${owner}/${slug}/followers`,
  })
  const { loading: loadingToggle, error: errorToggle, execute } = useApi(
    { url: `/builds/${owner}/${slug}/followers` },
    { manual: true }
  )

  const isFavorited =
    authUser &&
    data?.users.some((user: IUser) => user.username === authUser.username)

  const toggle = useCallback(() => {
    execute({ method: isFavorited ? "DELETE" : "PUT" }).then(() => refetch())
  }, [isFavorited])

  return (
    <SC.FavoriteButtonWrapper
      onClick={toggle}
      className={cx({ "is-error": error || errorToggle })}
    >
      {isFavorited ? "unfavorite" : "favorite"} {data?.count || 0}
      {(loading || loadingToggle) && "..."}
    </SC.FavoriteButtonWrapper>
  )
}

export default FavoriteButton
