import React from "react"
import Link from "next/link"

import { IUser } from "../types"

interface IListItemProps {
  data: IUser
}

const ListItem: React.FC<IListItemProps> = ({ data }) => (
  <Link href="/users/[id]" as={`/users/${data.id}`}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
)

export default ListItem
