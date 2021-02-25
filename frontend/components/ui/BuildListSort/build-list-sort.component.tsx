import * as React from "react"
import { useDispatch } from "react-redux"
import { usePress } from "@react-aria/interactions"
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

interface IOptionProps {
  isActive: boolean
  handlePress: () => void
}

const Option: React.FC<IOptionProps> = (props) => {
  const { pressProps } = usePress({
    onPress: props.handlePress,
  })

  return (
    <SC.Option
      {...pressProps}
      role="button"
      tabIndex={0}
      className={cx({ "is-active": props.isActive })}
    >
      {props.children}
    </SC.Option>
  )
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
        <Option
          isActive={sort.type === ESortType.TITLE}
          handlePress={() => set(ESortType.TITLE, ESortDirection.ASC)}
        >
          title
        </Option>
        <Option
          isActive={sort.type === ESortType.CREATED}
          handlePress={() => set(ESortType.CREATED, ESortDirection.ASC)}
        >
          created
        </Option>
        <Option
          isActive={sort.type === ESortType.UPDATED}
          handlePress={() => set(ESortType.UPDATED, ESortDirection.ASC)}
        >
          updated
        </Option>
        <Option
          isActive={sort.type === ESortType.FAVORITES}
          handlePress={() => set(ESortType.FAVORITES, ESortDirection.DESC)}
        >
          favorites
        </Option>
      </Stacker>
    </SC.BuildListSortWrapper>
  )
}

export default BuildListSort
