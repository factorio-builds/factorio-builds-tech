import React from "react"
import { FormikProps } from "formik"
import ErrorMessage from "../../form/ErrorMessage"
import ImageUpload from "../../ui/ImageUpload"
import { IImageUpload } from "../../ui/ImageUpload/image-upload.component"
import Stacker from "../../ui/Stacker"
import { IFormValues } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

interface IStep2CoverProps {
  formikProps: FormikProps<IFormValues>
}

const Step2Image: React.FC<IStep2CoverProps> = (props) => {
  function onChangeImage(image: IImageUpload) {
    props.formikProps.setFieldValue("cover.x", 0)
    props.formikProps.setFieldValue("cover.y", 0)
    props.formikProps.setFieldValue("cover.width", image.width)
    props.formikProps.setFieldValue("cover.height", image.height)
    props.formikProps.setFieldValue("cover.file", image.file)
    props.formikProps.setFieldTouched("cover.file")
  }

  return (
    <Stacker orientation="vertical" gutter={16}>
      <p>asdf</p>

      <SC.CoverWrapper>
        <ImageUpload
          label="Build image"
          imageFile={props.formikProps.values.cover.file || null}
          imageUrl={props.formikProps.values.cover.url || null}
          onChange={onChangeImage}
        />
        {props.formikProps.touched.cover?.file &&
          props.formikProps.errors.cover?.file && (
            <ErrorMessage>{props.formikProps.errors.cover.file}</ErrorMessage>
          )}
      </SC.CoverWrapper>
    </Stacker>
  )
}

export default Step2Image
