interface IGlowProps {
  color1: string
  color2: string
  color3: string
}

// Credit to Github CLI's website for the Glow SVG
const Glow = (props: IGlowProps): JSX.Element => (
  <svg viewBox="0 0 1326 1006" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g opacity="0.4">
      <g filter="url(#filter0_f)">
        <ellipse
          rx="322.527"
          ry="63.2642"
          transform="matrix(-0.0159178 -0.999873 0.999944 -0.0106168 244.293 502.62)"
          fill={props.color1}
        />
      </g>
      <g filter="url(#filter1_f)">
        <ellipse
          rx="203.183"
          ry="63.2642"
          transform="matrix(-0.0159178 -0.999873 0.999944 -0.0106168 1081.76 407.514)"
          fill={props.color2}
        />
      </g>
      <g opacity="0.98" filter="url(#filter2_f)">
        <ellipse
          rx="273.394"
          ry="175.851"
          transform="matrix(0.967708 -0.252073 0.328382 0.944545 570.632 428.229)"
          fill={props.color3}
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_f"
        x="0.821289"
        y="0.133301"
        width="486.944"
        height="1004.97"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="90" result="effect1_foregroundBlur" />
      </filter>
      <filter
        id="filter1_f"
        x="838.415"
        y="24.3555"
        width="486.69"
        height="766.317"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="90" result="effect1_foregroundBlur" />
      </filter>
      <filter
        id="filter2_f"
        x="119.78"
        y="68.3538"
        width="901.703"
        height="719.75"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feGaussianBlur stdDeviation="90" result="effect1_foregroundBlur" />
      </filter>
    </defs>
  </svg>
)

export default Glow
