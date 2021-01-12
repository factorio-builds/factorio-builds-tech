import styled from "styled-components"

export const WithIconsWrapper = styled.span`
  display: inline-block;

  &::after {
    content: "";
    clear: both;
    display: table;
  }

  > :first-child {
    margin-left: 0;
  }

  > :last-child {
    margin-right: 0;
  }

  img {
    float: left;
    width: auto;
    height: 1em;
    margin: 0 0.25em;
  }
`
