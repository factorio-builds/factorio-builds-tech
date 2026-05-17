import React, { forwardRef } from "react"
import { Link as TSLink } from "@tanstack/react-router"

// next/link compat shim.
// Accepts `href` (the next-style prop) and forwards internal navigation to
// TanStack Router's <Link>. External URLs and mailto:/tel: fall through to a
// plain <a> so we don't break preload/scroll on cross-origin links.

type AnchorProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>

// next 12 accepted either a string or an object `{ pathname, query, hash }`.
type HrefObject = {
  pathname: string
  query?: Record<string, string | number | undefined>
  hash?: string
}
type HrefLike = string | HrefObject

interface LinkProps extends AnchorProps {
  href: HrefLike
  passHref?: boolean // accepted for compat, ignored
  prefetch?: boolean // accepted for compat, ignored
  replace?: boolean
  children?: React.ReactNode
}

function resolveHref(href: HrefLike): string {
  if (typeof href === "string") return href
  const { pathname, query, hash } = href
  const params = new URLSearchParams()
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) params.set(k, String(v))
    }
  }
  const qs = params.toString()
  return `${pathname}${qs ? `?${qs}` : ""}${hash ? `#${hash}` : ""}`
}

function isExternal(href: string): boolean {
  return /^(?:[a-z]+:|\/\/)/i.test(href)
}

function isPassHrefCandidate(node: React.ReactNode): boolean {
  // next/link@12 with `passHref` cloned the only child and forwarded `href`
  // into it. Mirror that: if the child is a single element (typical: a
  // Stitches-styled <a> like `S.StyledLink`, or a literal <a>, or a styled
  // anchor of any kind), prefer cloning over rendering a wrapper anchor.
  // Strings, fragments, and multi-children fall through to the wrapper path.
  if (!React.isValidElement(node)) return false
  // Skip text-content components like `<>` fragments by checking the type
  // is not a Fragment.
  if (node.type === React.Fragment) return false
  return true
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, passHref, prefetch: _pf, replace, ...rest },
  ref
) {
  const url = resolveHref(href)

  // passHref path: clone the single child with href + navigation handler.
  // Produces one element, so the child's CSS (text-decoration, color, etc.)
  // wins and we don't end up with a wrapper anchor inheriting the browser
  // default underline.
  if (passHref && React.Children.count(children) === 1) {
    const only = React.Children.only(children) as React.ReactElement<
      AnchorProps & { href?: string }
    >
    if (isPassHrefCandidate(only)) {
      const childProps = only.props
      const merged: AnchorProps & { href?: string } = {
        ...rest,
        ...childProps,
        href: childProps.href ?? url,
      }
      if (!isExternal(url)) {
        // Wire client-side navigation so we don't full-reload internal links.
        const childOnClick = childProps.onClick
        merged.onClick = (e) => {
          if (childOnClick) childOnClick(e)
          if (
            e.defaultPrevented ||
            e.metaKey ||
            e.ctrlKey ||
            e.shiftKey ||
            e.button !== 0
          ) {
            return
          }
          e.preventDefault()
          window.history[replace ? "replaceState" : "pushState"](
            null,
            "",
            url
          )
          window.dispatchEvent(new PopStateEvent("popstate"))
        }
      }
      return React.cloneElement(only, merged)
    }
  }

  // Default: render an outer anchor. If the child is a literal <a> (legacy
  // next 12 pattern without passHref), absorb its props onto the wrapper.
  let anchorProps: AnchorProps = rest
  let resolvedChildren: React.ReactNode = children
  if (React.Children.count(children) === 1 && React.isValidElement(children)) {
    const child = children as React.ReactElement<AnchorProps>
    if (child.type === "a") {
      anchorProps = { ...rest, ...child.props }
      resolvedChildren = child.props.children
    }
  }

  if (isExternal(url)) {
    return (
      <a ref={ref} href={url} {...anchorProps}>
        {resolvedChildren}
      </a>
    )
  }

  return (
    <TSLink
      ref={ref as React.Ref<HTMLAnchorElement>}
      to={url}
      replace={replace}
      {...anchorProps}
    >
      {resolvedChildren as React.ReactNode}
    </TSLink>
  )
})

export default Link
