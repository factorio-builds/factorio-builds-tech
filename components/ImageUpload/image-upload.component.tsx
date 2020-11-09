import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import cx from "classnames"
import * as SC from "./image-upload.styles"

interface IImageUploadProps {
  image: string | null
  onChange: (file: File | null) => void
}

function toImage(buffer: ArrayBuffer) {
  const arrayBufferView = new Uint8Array(buffer)
  const blob = new Blob([arrayBufferView], { type: "image/jpeg" })
  // @ts-ignore
  const urlCreator = window.URL || window.webkitURL!
  return urlCreator.createObjectURL(blob)
}

function ImageUpload(props: IImageUploadProps): JSX.Element {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const [file] = acceptedFiles

    const reader = new FileReader()

    reader.onabort = () => {
      // TODO: handle abort
    }
    reader.onerror = () => {
      // TODO: handle error
    }
    reader.onload = () => {
      const binaryStr = reader.result
      const imageUrl = toImage(binaryStr as ArrayBuffer)
      setImagePreview(imageUrl)
      props.onChange(file)
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  function removeImage() {
    setImagePreview(null)
    props.onChange(null)
  }

  const image = imagePreview || props.image

  return (
    <SC.ImageUploadWrapper
      className={cx({ "is-active": isDragActive, "has-image": imagePreview })}
    >
      <SC.UploadZone {...getRootProps()}>
        <input {...getInputProps()} />
        {image ? (
          <SC.ImagePreview src={image} />
        ) : (
          <React.Fragment>
            <SC.StyledPlusIcon color="#67469b" />
            <SC.Hint>
              {isDragActive ? "(drop image here)" : "(click or drag image)"}
            </SC.Hint>
          </React.Fragment>
        )}
      </SC.UploadZone>

      <SC.DeleteButtonWrapper>
        {image && (
          <SC.DeleteButton onClick={removeImage}>delete image</SC.DeleteButton>
        )}
      </SC.DeleteButtonWrapper>
    </SC.ImageUploadWrapper>
  )
}

export default ImageUpload
