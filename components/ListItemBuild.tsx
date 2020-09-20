import React from "react"
import Link from "next/link"

import { IBuild } from "../types"

interface IListItemBuildProps {
  data: IBuild
}

const ListItemBuild: React.FC<IListItemBuildProps> = ({ data }) => (
  <Link href="/builds/[id]" as={`/builds/${data.id}`}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
)

export default ListItemBuild
