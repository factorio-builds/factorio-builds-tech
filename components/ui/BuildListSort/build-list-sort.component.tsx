import * as React from "react"
import { useDispatch } from "react-redux"
import cx from "classnames"
import { ESortType } from "../../../types"
import Stacker from "../Stacker"
import * as SC from "./build-list-sort.styles"

interface IBuildListSortProps {
  sort: ESortType
}

const BuildListSort: React.FC<IBuildListSortProps> = ({ sort }) => {
  const dispatch = useDispatch()

  function set(sortType: ESortType) {
    dispatch({
      type: "SET_SORT",
      payload: sortType,
    })
  }

  return (
    <SC.BuildListSortWrapper>
      Sort by
      <Stacker orientation="horizontal" gutter={8}>
        <SC.Option
          className={cx({ "is-active": sort === ESortType.RELEVANCY })}
          onClick={() => set(ESortType.RELEVANCY)}
        >
          relevance
        </SC.Option>
        <SC.Option
          className={cx({ "is-active": sort === ESortType.VIEWS })}
          onClick={() => set(ESortType.VIEWS)}
        >
          views
        </SC.Option>
        <SC.Option
          className={cx({ "is-active": sort === ESortType.NEWEST })}
          onClick={() => set(ESortType.NEWEST)}
        >
          newest
        </SC.Option>
      </Stacker>
    </SC.BuildListSortWrapper>
  )
}

export default BuildListSort
