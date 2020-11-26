import { useMemo } from "react"
import ItemIcon from "../components/ui/ItemIcon"
import { EState } from "../types"

interface IGameStateData {
  iconName: string
  icon: JSX.Element
  name: string
  value: EState
}

interface IUseGameStates {
  gameStates: IGameStateData[]
  getGameState: (value: EState) => IGameStateData
}

export function useGameStates(): IUseGameStates {
  const getIcon = (iconName: string) => <ItemIcon itemName={iconName} />

  const gameStates = [
    {
      iconName: "underground-belt",
      icon: getIcon("underground-belt"),
      name: "Early-game",
      value: EState.EARLY_GAME,
    },
    {
      iconName: "fast-underground-belt",
      icon: getIcon("fast-underground-belt"),
      name: "Mid-game",
      value: EState.MID_GAME,
    },
    {
      iconName: "express-underground-belt",
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
