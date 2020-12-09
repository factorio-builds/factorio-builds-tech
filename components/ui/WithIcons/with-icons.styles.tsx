import styled from "styled-components"

export const WithIconsWrapper = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    margin-left: 0;
  }

  > :last-child {
    margin-right: 0;
  }

  img {
    width: 1.25em;
    margin: 0 0.5em;
  }
`
