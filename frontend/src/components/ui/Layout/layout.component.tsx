import React, { ReactNode, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { HEADER_HEIGHT } from "../../../design/tokens/layout"
import { useAppDispatch } from "../../../redux/store"
import Header from "../Header"

interface ILayoutProps {
  title?: string
  children?: ReactNode
}

const Layout: React.FC<ILayoutProps> = ({ children, title }) => {
  const dispatch = useAppDispatch()
  const { ref, entry } = useInView({
    threshold: Array.from({ length: HEADER_HEIGHT }).map((_, i) => {
      return i / HEADER_HEIGHT
    }),
  })

  useEffect(() => {
    if (entry) {
      dispatch({
        type: "SET_HEADER",
        payload: entry.intersectionRect.height,
      })
    }
  }, [entry])

  useEffect(() => {
    document.title = ["Factorio Builds", title].filter(Boolean).join(" | ")
  }, [title])

  return (
    <>
      <Header ref={ref} />
      {children}
    </>
  )
}

export default Layout
