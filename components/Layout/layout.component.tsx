import React, { ReactNode } from "react"
import Head from "next/head"
import Container from "../Container"
import Header from "../Header"
import Sidebar from "../Sidebar"
import Subheader from "../Subheader"
import * as SC from "./layout.styles"

interface ILayoutProps {
  children?: ReactNode
  sidebar?: ReactNode
  title?: string
  subheader?: ReactNode
}

const Layout: React.FC<ILayoutProps> = ({
  children,
  sidebar,
  title,
  subheader,
}) => (
  <>
    <Head>
      <title>{["Factorio Builds", title].filter(Boolean).join(" | ")}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <Header />
    {subheader && <Subheader>{subheader}</Subheader>}
    <Container>
      <Sidebar>{sidebar}</Sidebar>
      <SC.Content>{children}</SC.Content>
    </Container>
  </>
)

export default Layout
