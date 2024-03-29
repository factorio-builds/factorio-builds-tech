import * as React from "react"

const Lamp = (props: React.SVGProps<SVGSVGElement>): JSX.Element => {
  const uid = React.useId()
  const id = `lamp-${uid}`

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 23 25"
      {...props}
    >
      <g fill="#D6D0DC" clipPath={`url(#${id})`}>
        <path d="M11.5 3.6c-.4 0-.72-.35-.72-.78V.78c0-.43.32-.78.72-.78.4 0 .72.35.72.78v2.04c0 .43-.32.78-.72.78zM17.8 6.44a.69.69 0 01-.51-.23.83.83 0 010-1.1l1.33-1.45c.28-.3.73-.3 1.01 0s.28.8 0 1.1l-1.32 1.45a.7.7 0 01-.51.23zM22.28 13.28h-1.87c-.4 0-.72-.35-.72-.78 0-.43.32-.78.72-.78h1.87c.4 0 .72.35.72.78 0 .43-.32.78-.72.78zM19.12 21.57a.69.69 0 01-.5-.23l-1.33-1.44a.83.83 0 010-1.1c.28-.31.74-.31 1.02 0l1.32 1.43c.28.3.28.8 0 1.1a.69.69 0 01-.5.24zM3.88 21.57a.69.69 0 01-.51-.23.83.83 0 010-1.1l1.33-1.45c.28-.3.73-.3 1.01 0s.28.8 0 1.1L4.4 21.35a.69.69 0 01-.51.23zM2.6 13.28H.71c-.4 0-.72-.35-.72-.78 0-.43.32-.78.72-.78h1.87c.4 0 .72.35.72.78 0 .43-.32.78-.72.78zM5.2 6.44a.69.69 0 01-.5-.23L3.37 4.77a.83.83 0 010-1.11c.28-.3.73-.3 1.02 0L5.7 5.1c.28.3.28.8 0 1.1a.7.7 0 01-.5.24zM14.38 21.88v1.3c0 1-.76 1.82-1.68 1.82h-2.4c-.8 0-1.68-.67-1.68-2.13v-1h5.76zM15.73 6.83a6.33 6.33 0 00-5.67-1.45 7.02 7.02 0 00-5.12 5.58 7.63 7.63 0 002.53 7.36 3.2 3.2 0 011.09 2h5.86c.14-.8.57-1.53 1.23-2.1a7.52 7.52 0 002.56-5.72c0-2.2-.9-4.27-2.48-5.67zm-.64 6.2c-.39 0-.71-.36-.71-.79 0-1.58-1.18-2.86-2.64-2.86-.4 0-.72-.36-.72-.79 0-.42.33-.78.72-.78 2.24 0 4.07 2 4.07 4.43 0 .43-.32.78-.72.78z" />
        <path d="M8.56 20.31h.07l-.07.01zM14.42 20.31v.01h-.04.04z" />
      </g>
      <defs>
        <clipPath id={id}>
          <path fill="#fff" d="M0 0h23v25H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default Lamp
