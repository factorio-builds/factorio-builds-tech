import React /*{ useCallback }*/ from "react"
// import cx from "classnames"
import { FormikProps } from "formik"
import { IFullPayload } from "../../../types/models"
import { isBook } from "../../../utils/build"
import Stacker from "../../ui/Stacker"
import { IFormValues } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

interface IStep2CoverProps {
  formikProps: FormikProps<IFormValues>
  payloadData: IFullPayload
}

const Step2Cover: React.FC<IStep2CoverProps> = (props) => {
  // function selectRenderedCover({ href, hash }: { href: string; hash: string }) {
  //   props.formikProps.setFieldValue("cover.hash", hash)
  //   props.formikProps.setFieldValue("cover.url", href)
  //   props.formikProps.setFieldTouched("cover.hash")
  // }

  // const coverIsSelected = useCallback(
  //   (hash: string) => props.formikProps.values.cover.hash === hash,
  //   [props.formikProps.values.cover.hash]
  // )

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

      <Stacker orientation="horizontal">
        <SC.RenderedCovers>
          <SC.RenderedCoversTitle>Rendered blueprint</SC.RenderedCoversTitle>
          {isBook(props.payloadData) ? (
            <div>todo..</div>
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
      </Stacker>
    </Stacker>
  )
}

export default Step2Cover
