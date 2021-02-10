import * as React from "react"
// import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import Caret from "../../../icons/caret"
import { IThinBuild } from "../../../types/models"
import { formatDate, formatSince } from "../../../utils/date"
import Avatar from "../Avatar"
import Stacker from "../Stacker"
import Tooltip from "../Tooltip"
import * as SC from "./build-list.styles"

interface IBuildListProps {
  items: IThinBuild[]
}

const BuildList: React.FC<IBuildListProps> = ({ items }) => {
  const router = useRouter()

  // const [sortBy, setSortBy] = useState<"title" | "created_at" | "updated_at">(
  //   "title"
  // )

  return (
    <SC.BuildListWrapper>
      <Stacker gutter={4}>
        <SC.Title orientation="horizontal" gutter={8}>
          <span>Builds by </span>
          <Avatar username={router.query.user as string} size="large" />
          <b>{router.query.user}</b>
        </SC.Title>

        <SC.Subtitle>
          <b>{items.length}</b> builds
        </SC.Subtitle>
      </Stacker>

      {items.length ? (
        <SC.Table>
          <thead>
            <tr>
              <th></th>
              <th>
                <Caret /> Build title
              </th>
              <th>Created at</th>
              <th>Updated at</th>
            </tr>
          </thead>
          <tbody>
            {items
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((item) => (
                <tr key={item.slug}>
                  <td style={{ width: "1px" }}>
                    <Image
                      src={item._links.cover.href}
                      width={64}
                      height={64}
                      layout="fixed"
                    />
                  </td>
                  <td>
                    <a href={`/${router.query.user}/${item.slug}`}>
                      {item.title}
                    </a>
                  </td>
                  <td style={{ width: "1px" }}>
                    <Tooltip content={formatSince(item.created_at)}>
                      <b>{formatDate(item.created_at)}</b>
                    </Tooltip>
                  </td>
                  <td style={{ width: "1px" }}>
                    <Tooltip content={formatSince(item.updated_at)}>
                      <b>{formatDate(item.updated_at)}</b>
                    </Tooltip>
                  </td>
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
