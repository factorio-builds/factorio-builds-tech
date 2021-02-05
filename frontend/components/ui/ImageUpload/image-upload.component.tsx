import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import cx from "classnames"
import Lamp from "../../../icons/lamp"
import ThumbsUp from "../../../icons/thumbs-up"
import InputWrapper from "../../form/InputWrapper"
import * as SC from "./image-upload.styles"

export interface IImageUpload {
  file: File | null
  width: number | null
  height: number | null
}

interface IImageUploadProps {
  label: string
  imageFile: File | null
  imageUrl: string | null
  onChange: (image: IImageUpload) => void
}

interface IImagePreview {
  src: string
  width: number
  height: number
}

function toImage(buffer: ArrayBuffer) {
  const arrayBufferView = new Uint8Array(buffer)
  const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
  const urlCreator = window.URL || window.webkitURL
  return urlCreator.createObjectURL(blob)
}

function ImageUpload(props: IImageUploadProps): JSX.Element | null {
  const [imagePreview, setImagePreview] = useState<IImagePreview | null>(null)

  useEffect(() => {
    if (props.imageFile) {
      readFile(props.imageFile)
    }
  }, [])

  const readFile = useCallback((file: File) => {
    const reader = new FileReader()

    reader.onabort = () => {
      // TODO: handle abort
    }
    reader.onerror = () => {
      // TODO: handle error
    }
    reader.onload = () => {
      const image = new Image()
      image.src = toImage(reader.result as ArrayBuffer)

      image.onload = function () {
        setImagePreview({
          src: image.src,
          width: image.width,
          height: image.height,
        })
        props.onChange({
          width: image.width,
          height: image.height,
          file,
        })
      }
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const [file] = acceptedFiles

    readFile(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  const suggestRotating = React.useMemo(() => {
    if (!imagePreview) {
      return false
    }
    return imagePreview.width / imagePreview.height > 1.5
  }, [imagePreview?.width, imagePreview?.height])

  // function removeImage() {
  //   setImagePreview(null)
  //   props.onChange({
  //     width: null,
  //     height: null,
  //     file: null,
  //   })
  // }

  const image = imagePreview?.src || props.imageUrl

  if (!image && props.imageFile) {
    return null
  }

  return (
    <SC.ImageUploadWrapper
      className={cx({ "is-active": isDragActive, "has-image": imagePreview })}
    >
      <InputWrapper uid="build-image" label={props.label}>
        <SC.UploadZone {...getRootProps()}>
          <input {...getInputProps()} />
          {image ? (
            <SC.ImagePreview src={image} />
          ) : (
            <SC.NoImageBackdrop>
              <SC.Hint>
                {isDragActive ? "(drop image here)" : "(click or drag image)"}
              </SC.Hint>
            </SC.NoImageBackdrop>
          )}
        </SC.UploadZone>

        <SC.Recommended>
          <SC.StyledLamp />
          We recommended using a tall image, if possible, share the build image
          vertically.
        </SC.Recommended>

        {image && suggestRotating && (
          <SC.Feedback className="variant-warning">
            <Lamp />
            Consider rotating the image
          </SC.Feedback>
        )}

        {image && !suggestRotating && (
          <SC.Feedback className="variant-positive">
            <ThumbsUp />
            This looks perfect
          </SC.Feedback>
        )}
      </InputWrapper>
      {/* <SC.TopRow>
        <SC.Label>{props.label}</SC.Label>
        {/* {image && <SC.SwapImage onClick={removeImage}>swap image</SC.SwapImage>} 
      </SC.TopRow> */}
    </SC.ImageUploadWrapper>
  )
}

export default ImageUpload
