import * as React from "react"

const Copy = (props: React.SVGProps<SVGSVGElement>): JSX.Element => {
  return (
    <svg width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.864 0H2.227C1.527 0 .955.573.955 1.273v8.909h1.272v-8.91h7.637V0zm1.909 2.545h-7c-.7 0-1.273.573-1.273 1.273v8.91c0 .7.573 1.272 1.273 1.272h7c.7 0 1.273-.573 1.273-1.273V3.818c0-.7-.573-1.273-1.273-1.273zm0 10.182h-7V3.818h7v8.91z"
        fill="#fff"
      />
    </svg>
  )
}

export default Copy
