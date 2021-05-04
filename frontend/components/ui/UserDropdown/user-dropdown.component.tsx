import React, { useMemo } from "react"
import { useDispatch } from "react-redux"
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
import { MenuTriggerProps } from "@react-types/menu"
import {
  CollectionChildren,
  CollectionBase,
  Expandable,
  MultipleSelection,
  Node,
  FocusStrategy,
} from "@react-types/shared"
import cx from "classnames"
import { useRouter } from "next/router"
import { Media } from "../../../design/styles/media"
import Caret from "../../../icons/caret"
import { IStoreUser } from "../../../types/models"
import { logout } from "../../../utils/auth"
import Avatar from "../Avatar"
import * as SC from "./user-dropdown.styles"

type TUknownObject = Record<string, unknown>

// TODO: get rid once latest version of react-aria is released
// see https://github.com/adobe/react-spectrum/pull/1239
interface TreeProps<T>
  extends CollectionBase<T>,
    Expandable,
    MultipleSelection {}

interface IUserDropdownProps {
  user: IStoreUser
}

interface IMenuProps extends TreeProps<TUknownObject> {
  domProps: React.HTMLAttributes<HTMLElement>
  autoFocus: FocusStrategy
  onAction: () => void
  onClose: () => void
}

interface IMenuButton extends IUserDropdownProps, MenuTriggerProps {
  label: string
  children: CollectionChildren<TUknownObject>
  onAction: (key?: any) => void
}

function MenuButton(props: IMenuButton): JSX.Element {
  // Create state based on the incoming props
  const state = useMenuTriggerState(props)

  // Get props for the menu trigger and menu elements
  const ref = React.useRef<HTMLButtonElement>(null)
  const { menuTriggerProps, menuProps } = useMenuTrigger({}, state, ref)

  // Get props for the button based on the trigger props from useMenuTrigger
  const { buttonProps } = useButton(menuTriggerProps, ref)

  return (
    <SC.StyledMenuButton>
      <SC.MenuTrigger {...buttonProps} ref={ref}>
        <SC.InnerMenuTrigger orientation="horizontal" gutter={10}>
          <Avatar username={props.user.username} size="medium" />
          <Media greaterThanOrEqual="sm">
            {(mcx, renderChildren) => {
              return renderChildren ? (
                <span className={mcx}>{props.label}</span>
              ) : null
            }}
          </Media>
          <Caret aria-hidden="true" />
        </SC.InnerMenuTrigger>
      </SC.MenuTrigger>
      {state.isOpen && (
        <MenuPopup
          {...props}
          domProps={menuProps}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={state.focusStrategy}
          onClose={() => state.close()}
        />
      )}
    </SC.StyledMenuButton>
  )
}

function MenuPopup(props: IMenuProps) {
  // Create menu state based on the incoming props
  const state = useTreeState({ ...props, selectionMode: "none" })

  // Get props for the menu element
  const ref = React.useRef<HTMLUListElement>(null)
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

  // Wrap in <FocusScope> so that focus is restored back to the
  // trigger when the menu is closed. In addition, add hidden
  // <DismissButton> components at the start and end of the list
  // to allow screen reader users to dismiss the popup easily.
  return (
    <FocusScope restoreFocus>
      <div {...overlayProps} ref={overlayRef}>
        <DismissButton onDismiss={props.onClose} />
        <SC.StyledMenuPopup
          {...mergeProps(menuProps, props.domProps)}
          ref={ref}
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
        </SC.StyledMenuPopup>
        <DismissButton onDismiss={props.onClose} />
      </div>
    </FocusScope>
  )
}

interface IMenuItem {
  item: Node<TUknownObject>
  state: TreeState<TUknownObject>
  onAction: () => void
  onClose: () => void
}

function MenuItem({ item, state, onAction, onClose }: IMenuItem) {
  // Get props for the menu item element
  const ref = React.useRef<HTMLLIElement>(null)
  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      // @ts-ignore
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
    <SC.StyledMenuItem
      {...mergeProps(menuItemProps, focusProps)}
      ref={ref}
      className={cx({ "is-focused": isFocused })}
    >
      {item.rendered}
    </SC.StyledMenuItem>
  )
}

function UserDropdown(props: IUserDropdownProps): JSX.Element {
  const router = useRouter()
  const dispatch = useDispatch()

  const links = useMemo(
    () => [
      {
        action: () => {
          router.push(`/${props.user.username}/builds`)
        },
        body: <SC.InnerLink>my builds</SC.InnerLink>,
      },
      {
        action: () => {
          logout(dispatch)
          router.push("/api/auth/logout")
        },
        body: <SC.InnerLinkLogOff>log off</SC.InnerLinkLogOff>,
      },
    ],
    [props.user.username]
  )

  return (
    <MenuButton
      {...props}
      label={props.user.username}
      onAction={(index) => links[index].action()}
    >
      {links.map((link, index) => (
        <Item key={index}>{link.body}</Item>
      ))}
    </MenuButton>
  )
}

export default UserDropdown
