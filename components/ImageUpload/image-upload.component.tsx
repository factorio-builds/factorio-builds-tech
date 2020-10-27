import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import cx from "classnames"
import * as SC from "./image-upload.styles"

interface IImageUploadProps {
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

    reader.onabort = () => console.log("file reading was aborted")
    reader.onerror = () => console.log("file reading has failed")
    reader.onload = () => {
      const binaryStr = reader.result
      const imageUrl = toImage(binaryStr as ArrayBuffer)
      console.log(imageUrl)
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

  return (
    <SC.ImageUploadWrapper
      className={cx({ "is-active": isDragActive, "has-image": imagePreview })}
    >
      <SC.UploadZone {...getRootProps()}>
        <input {...getInputProps()} />
        {imagePreview ? (
          <SC.ImagePreview src={imagePreview} />
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
        {imagePreview && (
          <SC.DeleteButton onClick={removeImage}>delete image</SC.DeleteButton>
        )}
      </SC.DeleteButtonWrapper>
    </SC.ImageUploadWrapper>
  )
}

export default ImageUpload
