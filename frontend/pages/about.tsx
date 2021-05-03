import Link from "next/link"
import Container from "../components/ui/Container"
import LayoutDefault from "../components/ui/LayoutDefault"

const GH_REPO = "https://github.com/factorio-builds/factorio-builds-tech"
const GH_ISSUES =
  "https://github.com/factorio-builds/factorio-builds-tech/issues"
const GH_SHORT_ROADMAP =
  "https://github.com/factorio-builds/factorio-builds-tech/projects/1"
const GH_LONG_ROADMAP =
  "https://github.com/factorio-builds/factorio-builds-tech/projects/2"
const DISCORD_INVITE = "https://discord.gg/WCnHufvdGE"

const AboutPage = (): JSX.Element => (
  <LayoutDefault title="About">
    <Container direction="column" size="small">
      <h1>About</h1>
      <p>
        This project aims to be a website and tool to share and browse
        blueprints, with strong values in user experience to make it the least
        painful experience to search/filter, and create builds.
      </p>

      <h2>How to help</h2>
      <p>
        If you are a developer and wish to help, the project is{" "}
        <Link href={GH_REPO}>open source on GitHub</Link>. Otherwise, any idea,
        feedback and suggestion is welcome, either on our{" "}
        <Link href={DISCORD_INVITE}>Discord server</Link>, or through{" "}
        <Link href={GH_ISSUES}>GitHub issues</Link>.
      </p>

      <h2>What&apos;s next?</h2>
      <p>
        We have our <Link href={GH_SHORT_ROADMAP}>short-term roadmap</Link> and{" "}
        <Link href={GH_LONG_ROADMAP}>long-term roadmap</Link> available.
      </p>

      <h2>Who</h2>
      <p>
        This project is currently maintained majorly by two developers,{" "}
        <Link href="https://github.com/veksen">@veksen</Link>, who handles the
        React front-end, and{" "}
        <Link href="https://github.com/dstockhammer">@dstockhammer</Link>, who
        handles the .NET core back-end, and the infrastucture. Special shoutout
        to <Link href="https://github.com/kenperkins">@kenperkins</Link> for his
        early contribution.
      </p>
    </Container>
  </LayoutDefault>
)

export default AboutPage
