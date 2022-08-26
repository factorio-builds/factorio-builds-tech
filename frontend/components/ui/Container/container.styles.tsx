import { styled } from "../../../design/stitches.config"

export const ContainerWrapper = styled("div", {
  width: "100%",
  maxWidth: "calc(100% - 20px * 2)",
  margin: "0 auto",
  display: "flex",
  padding: "0 20px",
  flex: 1,

  "&.dir-row": {
    flexDirection: "row",
  },

  "&.dir-column": {
    flexDirection: "column",
  },

  "&.size-small": {
    width: "calc(768px - 20px * 2)",
  },

  "&.size-medium": {
    width: "calc(1366px - 20px * 2)",
  },
})
