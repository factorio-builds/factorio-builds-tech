import { useMemo } from "react"
import ItemIcon from "../components/ui/ItemIcon"
import { EState } from "../types"

interface ICategoryData {
  icon: JSX.Element
  name: string
  value: EState
}

interface IUseGameStates {
  gameStates: ICategoryData[]
  getGameState: (value: EState) => ICategoryData
}

export function useGameStates(): IUseGameStates {
  const getIcon = (iconName: string) => <ItemIcon itemName={iconName} />

  const gameStates = [
    {
      icon: getIcon("underground-belt"),
      name: "Early-game",
      value: EState.EARLY_GAME,
    },
    {
      icon: getIcon("fast-underground-belt"),
      name: "Mid-game",
      value: EState.MID_GAME,
    },
    {
      icon: getIcon("express-underground-belt"),
      name: "Late-game",
      value: EState.LATE_GAME,
    },
  ]

  const getGameState = (value: EState) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return gameStates.find((gameState) => gameState.value === value)!
  }

  return useMemo(() => {
    return {
      gameStates,
      getGameState,
    }
  }, [])
}
