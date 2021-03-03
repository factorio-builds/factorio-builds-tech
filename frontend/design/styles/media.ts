import { createMedia } from "@artsy/fresnel"

const AppMedia = createMedia({
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1024,
    lg: 1400,
  },
})

// Make styles for injection into the header of the page
export const mediaStyles = AppMedia.createMediaStyle()

export const { Media, MediaContextProvider } = AppMedia
