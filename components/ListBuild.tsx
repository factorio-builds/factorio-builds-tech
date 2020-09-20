import * as React from "react"
import ListItemBuild from "./ListItemBuild"
import { IBuild } from "../types"

interface IListBuildProps {
  items: IBuild[]
}

const ListBuild: React.FC<IListBuildProps> = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItemBuild data={item} />
      </li>
    ))}
  </ul>
)

export default ListBuild
