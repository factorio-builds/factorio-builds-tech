import useSwr from 'swr'
import getConfig from 'next/config'
import Link from 'next/link'
import auth0 from '../utils/auth0';

const { publicRuntimeConfig } = getConfig()

const fetcher = (url) => fetch(url).then((res) => res.json())
const callRpc = (name, session) => fetch(
  `${publicRuntimeConfig.apiUrl}/rpc/${name}`,
  {
    headers: {
      "Authorization": `Bearer ${session.accessToken}`
    }
  })
  .then(console.log)

function Index({ session }) {
  const { data, error } = useSwr(`${publicRuntimeConfig.apiUrl}/builds`, fetcher)

  if (error) return <div>Failed to load builds</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      {!session && <>
        Not signed in <br/>
        <a href="/api/login">Login</a>
      </>}
      {session && <>
        Signed in as <strong>{session.user.username}</strong> with id <code>{session.user.sub}</code><br/>
        <a href="/api/logout">Logout</a> <br/>
        Test operations -- look at the dev console / network tab for output <br/>
        <button onClick={() => callRpc("test-ping", session)}>Call API: Ping</button>
        <button onClick={() => callRpc("test-auth", session)}>Call API: Auth</button>
        <button onClick={() => callRpc("test-admin", session)}>Call API: Admin</button>
      </>}
      <ul>
        {data.builds.map((build) => (
          <li key={build.slug}>
            <Link href={`/${build.owner.username}/${build.slug}`}>
              <a>{build.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

Index.getInitialProps = async (ctx) => {
  const session = await auth0.getSession(ctx.req);
  console.log("session", session);

  return { session };
}

export default Index
