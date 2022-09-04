import { styled } from "../../../design/stitches.config"

export const StyledMarkdownEditor = styled("div", {
  ".EasyMDEContainer:focus-within .CodeMirror, .EasyMDEContainer:focus-within .editor-toolbar":
    {
      boxShadow: "0 0 0 3px #aad1ff",
      outline: "none",
    },

  ".CodeMirror": {
    background: "$input",
    color: "$fadedBlue700",
    border: "2px solid $fadedBlue500",
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px",
  },

  ".CodeMirror-cursor": {
    borderColor: "$fadedBlue700",
  },

  ".CodeMirror-scroll": {
    marginRight: 0,
  },

  ".editor-toolbar": {
    borderTop: "2px solid $fadedBlue500",
    borderLeft: "2px solid $fadedBlue500",
    borderRight: "2px solid $fadedBlue500",
    borderTopLeftRadius: "6px",
    borderTopRightRadius: "6px",
  },

  ".editor-toolbar i.separator": {
    borderRight: "1px solid $fadedBlue300",
    borderLeft: "none",
  },

  ".editor-toolbar button": {
    color: "$fadedBlue700",

    "&.active, &:hover": {
      background: "$input",
      border: "none",
    },
  },

  ".editor-toolbar.disabled-for-preview button:not(.no-disable)": {
    opacity: 0.4,
  },

  ".editor-preview": {
    background: "$input",
  },

  ".editor-statusbar": {
    color: "$fadedBlue700",
  },
})
