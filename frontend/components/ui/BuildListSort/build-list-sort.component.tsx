import * as React from "react"
import { useDispatch } from "react-redux"
import cx from "classnames"
import { searchBuildsAsync } from "../../../redux/reducers/search"
import { ESortDirection, ESortType } from "../../../types"
import Stacker from "../Stacker"
import * as SC from "./build-list-sort.styles"

interface IBuildListSortProps {
  sort: {
    type: ESortType
    direction: ESortDirection
  }
}

const BuildListSort: React.FC<IBuildListSortProps> = ({ sort }) => {
  const dispatch = useDispatch()

  function set(sortType: ESortType, sortDirection: ESortDirection) {
    dispatch({
      type: "SET_SORT",
      payload: {
        type: sortType,
        direction: sortDirection,
      },
    })
    dispatch(searchBuildsAsync())
  }

  return (
    <SC.BuildListSortWrapper>
      Sort by
      <Stacker orientation="horizontal" gutter={8}>
        {/* <SC.Option
          className={cx({ "is-active": sort === ESortType.RELEVANCY })}
          onClick={() => set(ESortType.RELEVANCY)}
        >
          relevance
        </SC.Option> */}
        <SC.Option
          className={cx({ "is-active": sort.type === ESortType.TITLE })}
          onClick={() => set(ESortType.TITLE, ESortDirection.ASC)}
        >
          title
        </SC.Option>
        <SC.Option
          className={cx({ "is-active": sort.type === ESortType.CREATED })}
          onClick={() => set(ESortType.CREATED, ESortDirection.ASC)}
        >
          created
        </SC.Option>
        <SC.Option
          className={cx({ "is-active": sort.type === ESortType.UPDATED })}
          onClick={() => set(ESortType.UPDATED, ESortDirection.ASC)}
        >
          updated
        </SC.Option>
        <SC.Option
          className={cx({ "is-active": sort.type === ESortType.FAVORITES })}
          onClick={() => set(ESortType.FAVORITES, ESortDirection.DESC)}
        >
          favorites
        </SC.Option>
      </Stacker>
    </SC.BuildListSortWrapper>
  )
}

export default BuildListSort
