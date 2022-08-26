import * as React from "react"
import * as S from "./build-list-lookup-stats.styles"

interface IBuildListLookupStatProps {
  count: number
  totalCount: number
}

const BuildListLookupStats: React.FC<IBuildListLookupStatProps> = ({
  count,
  totalCount,
}) => {
  return (
    <S.BuildListLookupStatWrapper>
      <S.Count>
        Displaying {count} out of {totalCount} builds
      </S.Count>
    </S.BuildListLookupStatWrapper>
  )
}

export default BuildListLookupStats
