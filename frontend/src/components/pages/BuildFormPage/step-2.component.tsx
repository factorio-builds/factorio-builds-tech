import React, { useState } from "react"
import { FormikProps } from "formik"
import { IFullPayload } from "../../../types/models"
import FormError from "../../form/FormError"
import Button from "../../ui/Button"
import Spinner from "../../ui/Spinner"
import Stacker from "../../ui/Stacker"
import { IFormValues, ISubmitStatus } from "./build-form-page.d"
import * as S from "./build-form-page.styles"
import Pager from "./pager.component"
import { TPage } from "./pager.component"
import Step2Cover from "./step-2-cover.component"
import Step2Data from "./step-2-data.component"
import useCanSave from "./useCanSave"

export interface IStep2Props {
  formikProps: FormikProps<IFormValues>
  submitStatus: ISubmitStatus
  payloadData: IFullPayload
  type: "CREATE" | "EDIT"
}

const Step2: React.FC<IStep2Props> = (props) => {
  const [page, setPage] = useState<TPage>("data")
  const { canSave, waitingForRender } = useCanSave(
    props.payloadData,
    props.submitStatus,
    props.formikProps
  )

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
    <S.Content>
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

        {page === "data" && (
          <Step2Data formikProps={props.formikProps} type={props.type} />
        )}
        {page === "cover" && (
          <Step2Cover
            formikProps={props.formikProps}
            payloadData={props.payloadData}
          />
        )}

        {!canSave && waitingForRender && (
          <S.WaitingForRender>
            Blueprint image is still rendering, please be patient.
          </S.WaitingForRender>
        )}

        {props.submitStatus.error && (
          <FormError error={props.submitStatus.error} />
        )}

        <S.ButtonsStack gutter={24} orientation="horizontal">
          <Button variant="success" disabled={!canSave}>
            <Stacker gutter={10} orientation="horizontal">
              <span>Save build</span>
              {props.submitStatus.loading && <Spinner />}
            </Stacker>
          </Button>
          {page === "data" && (
            <S.TextButton onClick={() => setPage("cover")}>
              pick cover image
            </S.TextButton>
          )}
        </S.ButtonsStack>
      </Stacker>
    </S.Content>
  )
}

export default Step2
