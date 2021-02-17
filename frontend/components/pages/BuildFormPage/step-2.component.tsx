import React, { useState } from "react"
import { FormikProps } from "formik"
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
import Step2Image from "./step-2-image.component"

interface IStep2Props {
  formikProps: FormikProps<IFormValues>
  submitStatus: { loading: boolean; error: boolean | string }
  payloadData: IFullPayload
}

const Step2: React.FC<IStep2Props> = (props) => {
  const [page, setPage] = useState<TPage>("data")

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
    <SC.Row>
      <SC.Content>
        <Stacker>
          <Pager
            currentPage={page}
            pagesState={{
              data: {
                isValid: validateFields([
                  "title",
                  "slug",
                  "description",
                  "tags",
                ]).isValid,
              },
              cover: { isValid: validateFields(["cover"]).isValid },
              image: {
                isValid: validateFields(["cover"]).isValid,
                optional: true,
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
          {page === "image" && <Step2Image formikProps={props.formikProps} />}

          <SC.ButtonsStack gutter={24} orientation="horizontal">
            <Button
              variant="success"
              disabled={
                props.submitStatus.loading || !props.formikProps.isValid
              }
            >
              <Stacker gutter={10} orientation="horizontal">
                <span>Save build</span>
                {props.submitStatus.loading && <Spinner />}
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
    </SC.Row>
  )
}

export default Step2
