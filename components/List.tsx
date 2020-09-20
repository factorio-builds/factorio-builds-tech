import * as React from "react"
import ListItem from "./ListItem"
import { IUser } from "../types"

type Props = {
  items: IUser[]
}

const List = ({ items }: Props) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        <ListItem data={item} />
      </li>
    ))}
  </ul>
)

export default List
