import * as React from "react"

import { IBuild } from "../types"

interface IListDetailBuildProps {
  item: IBuild
}

const ListDetailBuild: React.FC<IListDetailBuildProps> = ({ item: build }) => (
  <div>
    <h1>{build.name}</h1>
    <h3>Build Details</h3>
    <textarea>{build.blueprint}</textarea>
    <h3>Metadata</h3>
    {/* <p>{build.metadata}</p> */}
    <p>ID: {build.id}</p>
  </div>
)

export default ListDetailBuild
