import { getTypo } from "../../../design/helpers/typo"
import { styled } from "../../../design/stitches.config"
import { ETypo } from "../../../design/tokens/typo"
import Caret from "../../../icons/caret"
import Stacker from "../Stacker"

export const FilterListWrapper = styled("div")

export const Title = styled("div", getTypo(ETypo.FORM_LABEL), {
  marginBottom: "8px",
})

export const FilterGroup = styled("div", {
  padding: "4px 20px 4px 0",
  marginRight: "-20px",

  "& + &": {
    borderTop: "1px solid $fadedBlue300",
  },
})

export const GroupName = styled("button", {
  display: "flex",
  alignItems: "center",
  background: "none",
  fontSize: "14px",
  border: "none",
  padding: "4px 0",
  height: "20px",
  color: "$fadedBlue900",
  fontWeight: 700,
  width: "100%",
  cursor: "pointer",

  "svg path": {
    fill: "#82d2a5",
  },
})

export const GroupCount = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(90deg, #2b4564 0%, #333642 100%)",
  width: "20px",
  height: "20px",
  borderRadius: "6px",
  fontSize: "10px",
  fontWeight: 700,
  marginLeft: "8px",
})

export const GroupFilters = styled(Stacker, {
  margin: "8px 0",
})

export const StyledCaret = styled(Caret, {
  marginLeft: "auto",
})
