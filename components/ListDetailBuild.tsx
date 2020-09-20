import * as React from "react"

import { IBuild } from "../types"

interface IListDetailBuildProps {
  item: IBuild
}

const ListDetailBuild: React.FC<IListDetailBuildProps> = ({ item: build }) => (
  <div>
    <h1>Detail for {build.name}</h1>
    <p>ID: {build.id}</p>
  </div>
)

export default ListDetailBuild
