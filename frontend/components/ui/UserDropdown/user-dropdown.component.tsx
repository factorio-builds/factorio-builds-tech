import React from "react"
import { useButton } from "@react-aria/button"
import { FocusScope } from "@react-aria/focus"
import { useFocus } from "@react-aria/interactions"
import { useMenuTrigger } from "@react-aria/menu"
import { useMenu, useMenuItem } from "@react-aria/menu"
import { useOverlay, DismissButton } from "@react-aria/overlays"
import { mergeProps } from "@react-aria/utils"
import { Item } from "@react-stately/collections"
import { useMenuTriggerState } from "@react-stately/menu"
import { useTreeState, TreeState } from "@react-stately/tree"
import { AriaMenuProps } from "@react-types/menu"
import { MenuTriggerProps } from "@react-types/menu"
import {
  CollectionBase,
  DOMProps,
  Expandable,
  MultipleSelection,
  Node,
} from "@react-types/shared"
import cx from "classnames"
import Link from "next/link"
import Caret from "../../../icons/caret"
import { IStoreUser } from "../../../types/models"
import Avatar from "../Avatar"
import Stacker from "../Stacker"
import * as SC from "./user-dropdown.styles"

// type TSafeObject = Record<string, unknown>

type CollectionItem = CollectionBase<HTMLDivElement>

interface IUserDropdownProps extends MenuTriggerProps {
  user: IStoreUser
}

interface IDropdownPopupProps
  extends AriaMenuProps<CollectionItem>,
    TreeProps<CollectionItem> {
  onClose: () => void
  domProps: DOMProps
}

// AriaMenuItemProps taken from @react-aria/menu/src/useMenuItem.ts as it is not exported *yet*
interface AriaMenuItemProps {
  isDisabled?: boolean
  isSelected?: boolean
  "aria-label"?: string
  key?: React.Key
  onClose?: () => void
  closeOnSelect?: boolean
  isVirtualized?: boolean
  onAction?: (key: React.Key) => void

  state: TreeState<CollectionItem>
  item: Node<CollectionItem>
}

// TreeProps taken from @react-stately/tree/src/useTreeState.ts as it is not exported *yet*
interface TreeProps<T>
  extends CollectionBase<T>,
    Expandable,
    MultipleSelection {}

function DropdownPopup(props: IDropdownPopupProps) {
  // TreeProps are not extracted, see https://github.com/adobe/react-spectrum/pull/1239
  // Create menu state based on the incoming props
  const state = useTreeState({ ...props, selectionMode: "none" })

  // Get props for the menu element
  const ref = React.useRef<HTMLDivElement>(null)
  const { menuProps } = useMenu(props, state, ref)

  // Handle events that should cause the menu to close,
  // e.g. blur, clicking outside, or pressing the escape key.
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const { overlayProps } = useOverlay(
    {
      onClose: props.onClose,
      shouldCloseOnBlur: true,
      isOpen: true,
      isDismissable: true,
    },
    overlayRef
  )

  return (
    <FocusScope>
      <div {...overlayProps} ref={overlayRef}>
        <DismissButton onDismiss={props.onClose} />
        <div
          {...mergeProps(menuProps, props.domProps)}
          ref={ref}
          style={{
            position: "absolute",
            width: "100%",
            margin: "4px 0 0 0",
            padding: 0,
            listStyle: "none",
            border: "1px solid gray",
            background: "lightgray",
          }}
        >
          {[...state.collection].map((item) => (
            <MenuItem
              key={item.key}
              item={item}
              state={state}
              onAction={props.onAction}
              onClose={props.onClose}
            />
          ))}
        </div>
        <DismissButton onDismiss={props.onClose} />
      </div>
    </FocusScope>
  )

  // return (
  //   <SC.DropdownContent>
  //     <Link href={`${props.user.username}/builds`}>
  //       <SC.InnerLink>my builds</SC.InnerLink>
  //     </Link>
  //     <SC.Spacer />
  //     <Link href="/api/logout">
  //       <SC.InnerLinkLogOff>log off</SC.InnerLinkLogOff>
  //     </Link>
  //   </SC.DropdownContent>
  // )
}

function MenuItem({ item, state, onAction, onClose }: AriaMenuItemProps) {
  // Get props for the menu item element
  const ref = React.useRef<HTMLDivElement>(null)
  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      isDisabled: item.isDisabled,
      onAction,
      onClose,
    },
    state,
    ref
  )

  // Handle focus events so we can apply highlighted
  // style to the focused menu item
  const [isFocused, setFocused] = React.useState(false)
  const { focusProps } = useFocus({ onFocusChange: setFocused })

  return (
    <div
      {...mergeProps(menuItemProps, focusProps)}
      ref={ref}
      style={{
        background: isFocused ? "gray" : "transparent",
        color: isFocused ? "white" : "black",
        padding: "2px 5px",
        outline: "none",
        cursor: "pointer",
      }}
    >
      {item.rendered}
    </div>
  )
}

function UserDropdown(props: IUserDropdownProps): JSX.Element {
  const state = useMenuTriggerState(props)

  // Get props for the menu trigger and menu elements
  const ref = React.useRef<HTMLButtonElement>(null)
  const { menuTriggerProps, menuProps } = useMenuTrigger({}, state, ref)

  // Get props for the button based on the trigger props from useMenuTrigger
  const { buttonProps } = useButton(menuTriggerProps, ref)

  // const [open, setOpen] = useState(false)

  return (
    <SC.DropdownWrapper className={cx({ "is-open": state.isOpen })}>
      <SC.Dropdown>
        <SC.User {...buttonProps} ref={ref}>
          <Stacker orientation="horizontal" gutter={10}>
            <Avatar username={props.user.username} size="medium" />
            <span>{props.user.username}</span>
            <Caret aria-hidden="true" />
          </Stacker>
        </SC.User>
        <DropdownPopup
          {...props}
          domProps={menuProps}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={state.focusStrategy}
          onClose={() => state.close()}
        >
          <Item>
            <Link href={`${props.user.username}/builds`}>
              <SC.InnerLink>my builds</SC.InnerLink>
            </Link>
          </Item>
          {/* <SC.Spacer /> */}
          <Item>
            <Link href="/api/logout">
              <SC.InnerLinkLogOff>log off</SC.InnerLinkLogOff>
            </Link>
          </Item>
        </DropdownPopup>
      </SC.Dropdown>
    </SC.DropdownWrapper>
  )
}

export default UserDropdown
