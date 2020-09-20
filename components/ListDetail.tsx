import * as React from "react"

import { IUser } from "../types"

type ListDetailProps = {
  item: IUser
}

const ListDetail = ({ item: user }: ListDetailProps) => (
  <div>
    <h1>Detail for {user.name}</h1>
    <p>ID: {user.id}</p>
  </div>
)

export default ListDetail
