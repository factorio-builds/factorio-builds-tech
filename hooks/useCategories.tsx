import { useMemo } from "react"
import startCase from "lodash/startCase"
import ItemIcon from "../components/ui/ItemIcon"
import { ECategory } from "../types"

function titleCase(value: string): string {
  return startCase(value.toLowerCase())
}

interface ICategoryData {
  iconName: string
  icon: JSX.Element
  name: string
  value: ECategory
}

interface IUseCategories {
  categories: ICategoryData[]
  getCategory: (value: ECategory) => ICategoryData
}

export function useCategories(): IUseCategories {
  const getIcon = (iconName: string) => <ItemIcon itemName={iconName} />

  const categories = [
    {
      iconName: "splitter",
      icon: getIcon("splitter"),
      name: titleCase(ECategory.BALANCER),
      value: ECategory.BALANCER,
    },
    {
      iconName: "stone-furnace",
      icon: getIcon("stone-furnace"),
      name: titleCase(ECategory.SMELTING),
      value: ECategory.SMELTING,
    },
    {
      iconName: "oil-refinery",
      icon: getIcon("oil-refinery"),
      name: titleCase(ECategory.REFINERY),
      value: ECategory.REFINERY,
    },
    {
      iconName: "straight-rail",
      icon: getIcon("straight-rail"),
      name: titleCase(ECategory.TRAINS),
      value: ECategory.TRAINS,
    },
    {
      iconName: "assembling-machine-1",
      icon: getIcon("assembling-machine-1"),
      name: titleCase(ECategory.PRODUCTION),
      value: ECategory.PRODUCTION,
    },
    {
      iconName: "solar-panel",
      icon: getIcon("solar-panel"),
      name: titleCase(ECategory.ENERGY),
      value: ECategory.ENERGY,
    },
  ]

  const getCategory = (value: ECategory) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return categories.find((category) => category.value === value)!
  }

  return useMemo(() => {
    return {
      categories,
      getCategory,
    }
  }, [])
}
