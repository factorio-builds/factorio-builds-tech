import React from "react"
import { FormikProps } from "formik"
import ErrorMessage from "../../form/ErrorMessage"
import ImageUpload from "../../ui/ImageUpload"
import { IImageUpload } from "../../ui/ImageUpload/image-upload.component"
import { IFormValues } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

interface IStep2CoverProps {
  formikProps: FormikProps<IFormValues>
}

const Step2Cover: React.FC<IStep2CoverProps> = (props) => {
  function onChangeImage(image: IImageUpload) {
    props.formikProps.setFieldValue("cover.width", image.width)
    props.formikProps.setFieldValue("cover.height", image.height)
    props.formikProps.setFieldValue("cover.file", image.file)
  }

  return (
    <SC.CoverWrapper>
      <ImageUpload
        label="Build image"
        image={props.formikProps.values.cover.url || null}
        onChange={onChangeImage}
      />
      {props.formikProps.touched && props.formikProps.errors.cover?.file && (
        <ErrorMessage>{props.formikProps.errors.cover.file}</ErrorMessage>
      )}
    </SC.CoverWrapper>
  )
}

export default Step2Cover
