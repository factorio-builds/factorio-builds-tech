import React, { useCallback } from "react"
// import cx from "classnames"
import { FormikProps } from "formik"
import { IBlueprintPayload, IFullPayload } from "../../../types/models"
import { isBook } from "../../../utils/build"
import ErrorMessage from "../../form/ErrorMessage"
import Radio from "../../form/Radio"
import BlueprintItem from "../../ui/BlueprintItem"
import ImageUpload from "../../ui/ImageUpload"
import { IImageUpload } from "../../ui/ImageUpload/image-upload.component"
import Stacker from "../../ui/Stacker"
import { IFormValues } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

interface IStep2CoverProps {
  formikProps: FormikProps<IFormValues>
  payloadData: IFullPayload
}

const Step2Cover: React.FC<IStep2CoverProps> = (props) => {
  function onChangeImage(image: IImageUpload) {
    props.formikProps.setFieldValue("cover.x", 0)
    props.formikProps.setFieldValue("cover.y", 0)
    props.formikProps.setFieldValue("cover.width", image.width)
    props.formikProps.setFieldValue("cover.height", image.height)
    props.formikProps.setFieldValue("cover.file", image.file)
    props.formikProps.setFieldTouched("cover.file")
  }

  function selectRenderedCover(e: React.MouseEvent, bp: IBlueprintPayload) {
    e.stopPropagation()
    props.formikProps.setFieldValue("cover.hash", bp.hash)
  }

  const coverIsSelected = useCallback(
    (hash: string) => props.formikProps.values.cover.hash === hash,
    [props.formikProps.values.cover.hash]
  )

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
              label="Build image"
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
          label="Pick a rendered image"
          value="hash"
          onChange={() => props.formikProps.setFieldValue("cover.type", "hash")}
          checked={props.formikProps.values.cover.type === "hash"}
        />

        {props.formikProps.values.cover.type === "hash" && (
          <SC.RenderedCovers>
            {isBook(props.payloadData) ? (
              <div>
                {props.payloadData.children.map((bp) => {
                  if (isBook(bp)) {
                    return (
                      <BlueprintItem
                        key={bp.hash}
                        depth={0}
                        isBook={true}
                        title={bp.label}
                        icons={bp.icons}
                        description={bp.description}
                        image={bp._links?.rendering_thumb}
                        nodes={bp.children}
                      />
                    )
                  }

                  return (
                    <BlueprintItem
                      key={bp.hash}
                      depth={0}
                      isBook={false}
                      title={bp.label}
                      icons={bp.icons}
                      description={bp.description}
                      image={bp._links?.rendering_thumb}
                      entities={bp.entities}
                      tiles={bp.tiles}
                      highlighted={coverIsSelected(bp.hash)}
                    >
                      <SC.SelectRenderButton
                        variant="alt"
                        type="button"
                        onClick={(e) => {
                          selectRenderedCover(e, bp)
                        }}
                      >
                        Select render
                      </SC.SelectRenderButton>
                    </BlueprintItem>
                  )
                })}
              </div>
            ) : (
              <SC.Rendered
                // className={cx({
                //   "is-selected": coverIsSelected(props.payloadData.hash),
                // })}
                type="button"
                // onClick={() =>
                //   selectRenderedCover({
                //     href: props.payloadData._links.rendering_thumb
                //       ?.href as string,
                //     hash: props.payloadData.hash,
                //   })
                // }
              >
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
