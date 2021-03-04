import * as React from "react"
import * as SC from "./build-list-lookup-stats.styles"

interface IBuildListLookupStatProps {
  count: number
  totalCount: number
}

const BuildListLookupStats: React.FC<IBuildListLookupStatProps> = ({
  count,
  totalCount,
}) => {
  return (
    <SC.BuildListLookupStatWrapper>
      <SC.Count>
        Displaying {count} out of {totalCount} builds
      </SC.Count>
    </SC.BuildListLookupStatWrapper>
  )
}

export default BuildListLookupStats
