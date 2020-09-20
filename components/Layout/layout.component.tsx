import React, { ReactNode } from "react"
import Head from "next/head"
import Container from "../Container"
import Filters from "../Filters"
import Header from "../Header"
import SearchInput from "../SearchInput"
import Sidebar from "../Sidebar"
import * as SC from "./layout.styles"

interface ILayoutProps {
  children?: ReactNode
  title?: string
}

const Layout: React.FC<ILayoutProps> = ({ children, title }) => (
  <>
    <Head>
      <title>{["Factorio Builds", title].filter(Boolean).join(" | ")}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    <Container>
      <Sidebar>
        <SearchInput />
        <Filters />
      </Sidebar>
      <SC.Content>{children}</SC.Content>
    </Container>
  </>
)

export default Layout
