import * as React from "react"
import { useState } from "react"
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

type TSortKey = "title" | "created_at" | "updated_at"
type TSortDirection = "asc" | "desc"

const BuildList: React.FC<IBuildListProps> = ({ items }) => {
  const router = useRouter()

  const [sortBy, setSortBy] = useState<{
    key: TSortKey
    direction: TSortDirection
  }>({ key: "title", direction: "desc" })

  const toggleSort = (key: TSortKey) => {
    setSortBy((prevSort) => {
      if (prevSort.key === key) {
        return {
          key,
          direction: prevSort.direction === "asc" ? "desc" : "asc",
        }
      }

      return {
        key,
        direction: "desc",
      }
    })
  }

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
                <SC.Sort onClick={() => toggleSort("title")}>
                  {sortBy.key === "title" && <Caret inverted={sortBy.direction === "asc"} />}
                  Build title
                </SC.Sort>
              </th>
              <th>
                <SC.Sort onClick={() => toggleSort("created_at")}>
                  {sortBy.key === "created_at" && <Caret inverted={sortBy.direction === "asc"} />}
                  Created at
                </SC.Sort>
              </th>
              <th>
                <SC.Sort onClick={() => toggleSort("updated_at")}>
                  {sortBy.key === "updated_at" && <Caret inverted={sortBy.direction === "asc"} />}
                  Updated at
                </SC.Sort>
              </th>
            </tr>
          </thead>
          <tbody>
            {items
              .sort((a, b) => {
                if (sortBy.direction === "desc") {
                  return a[sortBy.key].localeCompare(b[sortBy.key])
                }
                return b[sortBy.key].localeCompare(a[sortBy.key])
              })
              .map((item) => (
                <tr key={item.slug}>
                  <td style={{ width: "1px" }}>
                    <Image src={item._links.cover.href} width={64} height={64} layout="fixed" />
                  </td>
                  <td>
                    <a href={`/${router.query.user}/${item.slug}`}>{item.title}</a>
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
