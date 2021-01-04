import * as React from "react"
// import { useState } from "react"
import Image from "next/image"
import { IThinBuild } from "../../../types/models"
import { formatDateHuman } from "../../../utils/date"
import * as SC from "./build-list.styles"

interface IBuildListProps {
  items: IThinBuild[]
}

const BuildList: React.FC<IBuildListProps> = ({ items }) => {
  // const [sortBy, setSortBy] = useState<"title" | "created_at" | "updated_at">(
  //   "title"
  // )

  return (
    <SC.BuildListWrapper>
      <h2>User builds</h2>

      {items.length ? (
        <SC.Table>
          <thead>
            <tr>
              <th></th>
              <th>name</th>
              <th>created at</th>
              <th>updated at</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.slug}>
                <td style={{ width: "1px" }}>
                  <Image
                    src={item._links.cover.href}
                    width={64}
                    height={64}
                    layout="fixed"
                  />
                </td>
                <td>{item.title}</td>
                <td>{formatDateHuman(item.created_at)}</td>
                <td>{formatDateHuman(item.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </SC.Table>
      ) : (
        "No builds"
      )}
    </SC.BuildListWrapper>
  )
}

export default BuildList
