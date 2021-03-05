import React, { useMemo, useState } from "react"
import { FormikProps } from "formik"
import getConfig from "next/config"
import { IFullPayload } from "../../../types/models"
import Button from "../../ui/Button"
import Spinner from "../../ui/Spinner"
import Stacker from "../../ui/Stacker"
import { IFormValues } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"
import Pager from "./pager.component"
import { TPage } from "./pager.component"
import Step2Cover from "./step-2-cover.component"
import Step2Data from "./step-2-data.component"
import useImageRenderIsReady from "./useImageRenderIsReady"

const { publicRuntimeConfig } = getConfig()

interface IStep2Props {
  formikProps: FormikProps<IFormValues>
  submitStatus: { loading: boolean; error: boolean | string }
  payloadData: IFullPayload
}

const Step2: React.FC<IStep2Props> = (props) => {
  const [page, setPage] = useState<TPage>("data")
  const selectedImageHref = useMemo(() => {
    if (props.payloadData.type === "blueprint") {
      return (
        props.payloadData._links.rendering_thumb?.href ||
        props.formikProps.values.cover.url
      )
    }

    const hash = props.formikProps.values.cover.hash

    return hash
      ? `${publicRuntimeConfig.apiUrl}/payloads/${hash}/rendering/thumb`
      : null
  }, [
    props.payloadData._links.rendering_thumb?.href,
    props.formikProps.values.cover.url,
    props.formikProps.values.cover.hash,
  ])
  const renderIsReady = useImageRenderIsReady(selectedImageHref || undefined)

  const validateFields = <T extends keyof IFormValues>(
    fields: T[]
  ): {
    isValid: boolean
    invalidFields: T[]
  } => {
    const invalidFields = fields.filter(
      (field) => props.formikProps.errors[field]
    )

    return {
      isValid: invalidFields.length === 0,
      invalidFields,
    }
  }

  return (
    <SC.Content>
      <Stacker>
        <Pager
          currentPage={page}
          pagesState={{
            data: {
              isValid: validateFields(["title", "slug", "description", "tags"])
                .isValid,
            },
            cover: {
              isValid: validateFields(["cover"]).isValid,
              optional: props.payloadData.type === "blueprint",
            },
          }}
          goToPage={setPage}
        />

        {page === "data" && <Step2Data formikProps={props.formikProps} />}
        {page === "cover" && (
          <Step2Cover
            formikProps={props.formikProps}
            payloadData={props.payloadData}
          />
        )}

        <SC.ButtonsStack gutter={24} orientation="horizontal">
          <Button
            variant="success"
            disabled={
              !renderIsReady ||
              props.submitStatus.loading ||
              !props.formikProps.isValid
            }
          >
            <Stacker gutter={10} orientation="horizontal">
              <span>Save build</span>
              {!renderIsReady || (props.submitStatus.loading && <Spinner />)}
            </Stacker>
          </Button>
          {page === "data" && (
            <SC.TextButton onClick={() => setPage("cover")}>
              pick cover image
            </SC.TextButton>
          )}
        </SC.ButtonsStack>
      </Stacker>
    </SC.Content>
  )
}

export default Step2
