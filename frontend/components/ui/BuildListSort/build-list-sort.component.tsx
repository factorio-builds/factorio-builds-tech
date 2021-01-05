import * as React from "react"
import { useDispatch } from "react-redux"
import cx from "classnames"
import { searchBuildsAsync } from "../../../redux/reducers/search"
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
          className={cx({ "is-active": sort === ESortType.TITLE })}
          onClick={() => set(ESortType.TITLE)}
        >
          title
        </SC.Option>
        <SC.Option
          className={cx({ "is-active": sort === ESortType.CREATED })}
          onClick={() => set(ESortType.CREATED)}
        >
          created
        </SC.Option>
        <SC.Option
          className={cx({ "is-active": sort === ESortType.UPDATED })}
          onClick={() => set(ESortType.UPDATED)}
        >
          updated
        </SC.Option>
        <SC.Option
          className={cx({ "is-active": sort === ESortType.FAVORITES })}
          onClick={() => set(ESortType.FAVORITES)}
        >
          favorites
        </SC.Option>
      </Stacker>
    </SC.BuildListSortWrapper>
  )
}

export default BuildListSort
