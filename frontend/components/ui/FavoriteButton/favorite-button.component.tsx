import React, { useCallback } from "react"
import { useSelector } from "react-redux"
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
  const { data, execute: refetch } = useApi({
    url: `/builds/${owner}/${slug}/followers`,
  })
  const { execute } = useApi(
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
    <SC.FavoriteButtonWrapper onClick={toggle}>
      {isFavorited ? "unfavorite" : "favorite"}
    </SC.FavoriteButtonWrapper>
  )
}

export default FavoriteButton
