import React, { useCallback, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import cx from "classnames"
import { useAppSelector } from "../../../redux/store"
import { IFullBuild } from "../../../types/models"
import { http } from "../../../utils/http"
import { IButtonProps } from "../Button/button.component"
import * as S from "./favorite-button.styles"

interface IFavoriteButtonProps extends IButtonProps {
  build: IFullBuild
}

const FavoriteButton: React.FC<IFavoriteButtonProps> = ({
  build,
  ...restProps
}) => {
  const links = build._links

  const accessToken = useAppSelector((state) => state.auth?.user?.accessToken)
  const [count, setCount] = useState(build._links.followers.count)
  const [isFavorite, setIsFavorite] = useState(Boolean(links.remove_favorite))

  const mutation = useMutation({
    mutationFn: async (nextFavorite: boolean) => {
      const verb = nextFavorite ? http.put : http.delete
      await verb<unknown>(links.followers.href, { accessToken })
      const res = await http.get<{ count: number }>(links.followers.href, {
        accessToken,
      })
      return { nextFavorite, count: res.data.count }
    },
    onSuccess: ({ nextFavorite, count: nextCount }) => {
      setIsFavorite(nextFavorite)
      setCount(nextCount)
    },
  })

  const toggle = useCallback(() => {
    mutation.mutate(!isFavorite)
  }, [mutation, isFavorite])

  return (
    <S.FavoriteButtonWrapper
      onClick={accessToken ? toggle : undefined}
      className={cx({
        "is-error": mutation.isError,
        "is-clickable": Boolean(accessToken),
      })}
      counter={count}
      {...restProps}
    >
      {isFavorite ? "Unfavorite" : "Favorite"}
      {mutation.isPending && "..."}
    </S.FavoriteButtonWrapper>
  )
}

export default FavoriteButton
