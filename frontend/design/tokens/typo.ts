export enum EFontScale {
  F1 = "F1",
  F2B = "F2B",
  F2 = "F2",
  F3 = "F3",
  F4 = "F4",
  F5B = "F5B",
  F5 = "F5",
}

export enum ETypo {
  HEADER = "HEADER",
  PAGE_HEADER = "PAGE_HEADER",
  PAGE_SUBTITLE = "PAGE_SUBTITLE",
  BODY = "BODY",
  BODY_TITLE = "BODY_TITLE",
  FORM_LABEL = "FORM_LABEL",
  FORM_INPUT = "FORM_INPUT",
  CARD_TITLE = "CARD_TITLE",
  BUTTON = "BUTTON",
  METADATA = "METADATA",
  METADATA_TITLE = "METADATA_TITLE",
}

export const FONT_FAMILY = {
  HEADING: "DM Sans, sans-serif",
  BODY: "DM Sans, sans-serif",
}

export const TYPO = {
  [EFontScale.F1]: {
    SIZE: "24px",
    LINE_HEIGHT: 1.3,
    WEIGHT: 700,
    FAMILY: FONT_FAMILY.HEADING,
  },
  [EFontScale.F2B]: {
    SIZE: "18px",
    LINE_HEIGHT: 1.3,
    WEIGHT: 700,
    FAMILY: FONT_FAMILY.HEADING,
  },
  [EFontScale.F2]: {
    SIZE: "18px",
    LINE_HEIGHT: 1.3,
    WEIGHT: 400,
    FAMILY: FONT_FAMILY.BODY,
  },
  [EFontScale.F3]: {
    SIZE: "17px",
    LINE_HEIGHT: 1.3,
    WEIGHT: 400,
    FAMILY: FONT_FAMILY.BODY,
  },
  [EFontScale.F4]: {
    SIZE: "16px",
    LINE_HEIGHT: 1.3,
    WEIGHT: 700,
    FAMILY: FONT_FAMILY.HEADING,
  },
  [EFontScale.F5B]: {
    SIZE: "13px",
    LINE_HEIGHT: 1.3,
    WEIGHT: 700,
    FAMILY: FONT_FAMILY.BODY,
  },
  [EFontScale.F5]: {
    SIZE: "13px",
    LINE_HEIGHT: 1.3,
    WEIGHT: 400,
    FAMILY: FONT_FAMILY.BODY,
  },
}
