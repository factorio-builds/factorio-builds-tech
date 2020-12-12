import { css, FlattenSimpleInterpolation } from "styled-components"
import { EFontScale, ETypo, TYPO } from "../tokens/typo"

function typoMapper(typo: ETypo): EFontScale {
  switch (typo) {
    case ETypo.PAGE_HEADER:
      return EFontScale.F1
    case ETypo.FORM_LABEL:
    case ETypo.BODY_TITLE:
    case ETypo.CARD_TITLE:
      return EFontScale.F2B
    case ETypo.BODY:
    case ETypo.FORM_INPUT:
      return EFontScale.F2
    case ETypo.BUTTON:
    case ETypo.HEADER:
      return EFontScale.F3
    case ETypo.PAGE_SUBTITLE:
      return EFontScale.F4
    case ETypo.METADATA_TITLE:
      return EFontScale.F5B
    case ETypo.METADATA:
      return EFontScale.F5
  }
}

function getStyles(fontScale: EFontScale): FlattenSimpleInterpolation {
  const styles = TYPO[fontScale]

  return css`
    font-size: ${styles.SIZE};
    line-height: ${styles.LINE_HEIGHT};
    font-weight: ${styles.WEIGHT};
    font-family: ${styles.FAMILY};
  `
}

function getRawStyles(fontScale: EFontScale): React.CSSProperties {
  const styles = TYPO[fontScale]

  return {
    fontSize: styles.SIZE,
    lineHeight: styles.LINE_HEIGHT,
    fontWeight: styles.WEIGHT,
    fontFamily: styles.FAMILY,
  }
}

export function getTypo(typo: ETypo): FlattenSimpleInterpolation {
  const mappedTypo = typoMapper(typo)
  return getStyles(mappedTypo)
}

export function getRawTypo(typo: ETypo): React.CSSProperties {
  const mappedTypo = typoMapper(typo)
  return getRawStyles(mappedTypo)
}
