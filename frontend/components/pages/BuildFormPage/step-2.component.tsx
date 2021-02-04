import React, { useState } from "react"
import { FormikProps } from "formik"
import Button from "../../ui/Button"
import Spinner from "../../ui/Spinner"
import Stacker from "../../ui/Stacker"
import { IFormValues } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"
import Pager from "./pager.component"
import { TPage } from "./pager.component"
import Step2Cover from "./step-2-cover.component"
import Step2Data from "./step-2-data.component"

interface IStep2Props {
  formikProps: FormikProps<IFormValues>
  submitStatus: { loading: boolean; error: boolean | string }
}

const Step2: React.FC<IStep2Props> = (props) => {
  const [page, setPage] = useState<TPage>("data")

  const fieldsAreValid = (fields: (keyof IFormValues)[]): boolean => {
    const errors = props.formikProps.errors
    return fields.every((fieldName) => {
      return !errors[fieldName]
    })
  }

  return (
    <SC.Row>
      <SC.Content>
        <Stacker>
          <Pager
            currentPage={page}
            pagesState={{
              data: {
                isValid: fieldsAreValid([
                  "title",
                  "slug",
                  "description",
                  "tags",
                ]),
              },
              cover: { isValid: fieldsAreValid(["cover"]) },
            }}
            goToPage={setPage}
          />

          {page === "data" && <Step2Data formikProps={props.formikProps} />}
          {page === "cover" && <Step2Cover formikProps={props.formikProps} />}

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
              <SC.SkipButton onClick={() => setPage("cover")}>
                pick cover image
              </SC.SkipButton>
            )}
          </SC.ButtonsStack>
        </Stacker>
      </SC.Content>
    </SC.Row>
  )
}

export default Step2
