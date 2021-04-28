import * as React from "react"
import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useToggle } from "react-use"
import { usePress } from "@react-aria/interactions"
import { useOverlay } from "@react-aria/overlays"
import cx from "classnames"
import { COLOR } from "../../../design/tokens/color"
import Caret from "../../../icons/caret"
import { searchBuildsAsync } from "../../../redux/reducers/search"
import { ESortDirection, ESortType } from "../../../types"
import * as SC from "./build-list-sort.styles"

interface IBuildListSortProps {
  sort: {
    type: ESortType
    direction: ESortDirection
  }
}

type ISortOptions = Record<ESortType, { name: string; direction: ESortDirection }>

const sortOptions: ISortOptions = {
  [ESortType.TITLE]: {
    name: "title",
    direction: ESortDirection.ASC,
  },
  [ESortType.CREATED]: {
    name: "created",
    direction: ESortDirection.ASC,
  },
  [ESortType.UPDATED]: {
    name: "updated",
    direction: ESortDirection.ASC,
  },
  [ESortType.FAVORITES]: {
    name: "favorites",
    direction: ESortDirection.DESC,
  },
}

const SortDropdown: React.FC<{
  handleSelect: (sortType: ESortType, sortDirection: ESortDirection) => void
  selected: { key: ESortType; name: string }
}> = (props) => {
  const [isOpen, setIsOpen] = useToggle(false)
  const { pressProps } = usePress({
    onPress: setIsOpen,
  })
  const close = useCallback(() => {
    setIsOpen(false)
  }, [])
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const { overlayProps } = useOverlay(
    {
      onClose: close,
      shouldCloseOnBlur: true,
      isOpen: true,
      isDismissable: true,
    },
    overlayRef
  )

  return (
    <SC.SortDropdownWapper ref={overlayRef} {...overlayProps}>
      <SC.DropdownTrigger {...pressProps}>
        {props.selected.name} <Caret color={COLOR.FADEDBLUE900} />
      </SC.DropdownTrigger>
      {isOpen && (
        <SC.DropdownMenu>
          {Object.keys(sortOptions).map((key) => {
            const typedKey = key as keyof typeof sortOptions
            return (
              <SC.DropdownItem
                key={typedKey}
                className={cx({
                  "is-selected": typedKey === props.selected.key,
                })}
                onClick={() => {
                  props.handleSelect(typedKey, sortOptions[typedKey].direction)
                  setIsOpen(false)
                }}
              >
                {sortOptions[typedKey].name}
              </SC.DropdownItem>
            )
          })}
        </SC.DropdownMenu>
      )}
    </SC.SortDropdownWapper>
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
      Sorted by
      <SortDropdown handleSelect={set} selected={{ key: sort.type, name: sortOptions[sort.type].name }}>
        {sortOptions[sort.type].name}
      </SortDropdown>
    </SC.BuildListSortWrapper>
  )
}

export default BuildListSort
