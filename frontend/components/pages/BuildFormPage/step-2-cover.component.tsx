import React from "react"
import { FormikProps } from "formik"
import { IFullPayload } from "../../../types/models"
import { isBook } from "../../../utils/build"
import ErrorMessage from "../../form/ErrorMessage"
import Radio from "../../form/Radio"
import BlueprintItemExplorer from "../../ui/BlueprintItemExplorer"
import ImageUpload from "../../ui/ImageUpload"
import { IImageUpload } from "../../ui/ImageUpload/image-upload.component"
import Stacker from "../../ui/Stacker"
import { IFormValues } from "./build-form-page.d"
import * as SC from "./build-form-page.styles"

interface IStep2CoverProps {
  formikProps: FormikProps<IFormValues>
  payloadData: IFullPayload
}

const Step2Cover: React.FC<IStep2CoverProps> = (props) => {
  function onChangeImage(image: IImageUpload) {
    // these are optional
    // props.formikProps.setFieldValue("cover.crop.x", 0)
    // props.formikProps.setFieldValue("cover.crop.y", 0)
    // props.formikProps.setFieldValue("cover.crop.width", image.width)
    // props.formikProps.setFieldValue("cover.crop.height", image.height)
    props.formikProps.setFieldValue("cover.file", image.file)
    props.formikProps.setFieldTouched("cover.file")
  }

  function selectRenderedCover(
    e: React.MouseEvent,
    hash: IFullPayload["hash"]
  ) {
    e.stopPropagation()
    props.formikProps.setFieldValue("cover.hash", hash)
  }

  return (
    <Stacker orientation="vertical" gutter={16}>
      {isBook(props.payloadData) ? (
        <p>
          Select a generated render, or provide a custom image on the next step.
        </p>
      ) : (
        <p>
          This generated render will be used. Optionally, a custom image can be
          provided on the next step.
        </p>
      )}

      <Stacker orientation="vertical">
        <Radio
          id="cover-file"
          label="Upload a custom image"
          value="file"
          onChange={() => props.formikProps.setFieldValue("cover.type", "file")}
          checked={props.formikProps.values.cover.type === "file"}
        />

        {props.formikProps.values.cover.type === "file" && (
          <SC.CoverWrapper>
            <ImageUpload
              imageFile={props.formikProps.values.cover.file || null}
              imageUrl={props.formikProps.values.cover.url || null}
              onChange={onChangeImage}
            />
            {props.formikProps.touched.cover?.file &&
              props.formikProps.errors.cover?.file && (
                <ErrorMessage>
                  {props.formikProps.errors.cover.file}
                </ErrorMessage>
              )}
          </SC.CoverWrapper>
        )}

        <Radio
          id="cover-hash"
          label={
            isBook(props.payloadData)
              ? "Pick a rendered image"
              : "Use the rendered image"
          }
          value="hash"
          onChange={() => props.formikProps.setFieldValue("cover.type", "hash")}
          checked={props.formikProps.values.cover.type === "hash"}
        />

        {props.formikProps.values.cover.type === "hash" && (
          <SC.RenderedCovers>
            {isBook(props.payloadData) ? (
              <div>
                <BlueprintItemExplorer
                  type="selectable"
                  onSelect={selectRenderedCover}
                  selectedHash={props.formikProps.values.cover.hash}
                >
                  {props.payloadData.children}
                </BlueprintItemExplorer>
              </div>
            ) : (
              <SC.Rendered>
                <img
                  src={props.payloadData._links.rendering_thumb?.href}
                  alt=""
                />
              </SC.Rendered>
            )}
          </SC.RenderedCovers>
        )}
      </Stacker>
    </Stacker>
  )
}

export default Step2Cover
