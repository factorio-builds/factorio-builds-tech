import * as React from "react"
import * as SC from "./build-list-lookup-stats.styles"

interface IBuildListLookupStatProps {
  count: number
  totalCount: number
  lookupTime: number
}

const BuildListLookupStats: React.FC<IBuildListLookupStatProps> = ({
  count,
  totalCount,
  lookupTime,
}) => {
  return (
    <SC.BuildListLookupStatWrapper>
      <SC.LookupTime>Search took {lookupTime}ms</SC.LookupTime>
      <SC.Count>
        Displaying {count} out of {totalCount} builds
      </SC.Count>
    </SC.BuildListLookupStatWrapper>
  )
}

export default BuildListLookupStats
