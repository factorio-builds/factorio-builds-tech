import styled from "styled-components"

export const SpinnerWrapper = styled.div`
  & {
    color: #fff;
    font-size: 3px;
    position: relative;
    transform: translateZ(0);
    animation-delay: -0.16s;
    margin: 0 3.5em;
  }

  &,
  &:before,
  &:after {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    animation-fill-mode: both;
    animation: loading 1.8s infinite ease-in-out;
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
  }

  &:before {
    left: -3.5em;
    animation-delay: -0.32s;
  }

  &:after {
    left: 3.5em;
  }

  @keyframes loading {
    0%,
    80%,
    100% {
      box-shadow: 0 2.5em 0 -1.3em;
    }
    40% {
      box-shadow: 0 2.5em 0 0;
    }
  }
`
