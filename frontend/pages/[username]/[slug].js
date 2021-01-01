import useSwr from 'swr'
import getConfig from 'next/config'
import { useRouter } from 'next/router'

const { publicRuntimeConfig } = getConfig()
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function User() {
  const router = useRouter()

  const { data, error } = useSwr(`${publicRuntimeConfig.apiUrl}/builds/${router.query.username}/${router.query.slug}`, fetcher)

  if (error) return <div>Failed to load build</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>{data.title}</h1>
      {data.description && data.description.html && <div dangerouslySetInnerHTML={{__html: data.description.html}}></div> }
      <img src={data._links["cover"].href} width="480" height="480" loading="lazy" />
    </div>
  )
}
