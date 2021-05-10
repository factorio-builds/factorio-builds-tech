import React, { useCallback, useEffect, useMemo, useState } from "react"
import { AxiosError } from "axios"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import { useApi } from "../../../hooks/useApi"
import { IFullBuild, IFullPayload, IThinBuild } from "../../../types/models"
import Container from "../../ui/Container"
import LayoutDefault from "../../ui/LayoutDefault"
import {
  IFormValues,
  ISubmitStatus,
  IValidFormValues,
} from "./build-form-page.d"
import {
  createInitialValues,
  toFormData,
  toPatchFormData,
} from "./build-form-page.helpers"
import Step1 from "./step-1.component"
import Step2 from "./step-2.component"
import { validationSchema } from "./validation"

interface IBuildFormPageCreating {
  type: "CREATE"
  build?: undefined
}

interface IBuildFormPageEditing {
  type: "EDIT"
  build: IFullBuild
}

type TBuildFormPage = IBuildFormPageCreating | IBuildFormPageEditing

const BuildFormPage: React.FC<TBuildFormPage> = (props) => {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [build, setBuild] = useState<IFullBuild | undefined>(props.build)
  const [payloadData, setPayloadData] = useState<IFullPayload>()
  const [submit, setSubmit] = useState<ISubmitStatus>({
    loading: false,
    error: false,
  })

  const [, executePostPatch] = useApi<IThinBuild>(
    {
      url: props.type === "CREATE" ? "/builds" : props.build._links.self.href,
      method: props.type === "CREATE" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    { manual: true }
  )

  const [, executeGetBuild] = useApi<IFullBuild>(
    {
      url: `/builds/${router.query.user}/${router.query.slug}`,
    },
    { manual: true }
  )

  const [, executeGetPayload] = useApi<IFullPayload>(
    {
      url: `/payloads/${build?.latest_version.hash}`,
      params: { include_children: true },
    },
    { manual: true }
  )

  useEffect(() => {
    if (props.type === "EDIT" && !build) {
      executeGetBuild().then((res) => {
        setBuild(res.data)
      })
    }
  }, [props.type, build])

  useEffect(() => {
    if (props.type === "EDIT" && !payloadData) {
      executeGetPayload().then((res) => {
        setPayloadData(res.data)
      })
    }
  }, [props.type, payloadData])

  const initialValues = useMemo(() => {
    return createInitialValues(props.build || build)
  }, [props.build, build])

  const goToNextStep = useCallback((fullPayload: IFullPayload) => {
    setStep(2)
    setPayloadData(fullPayload)
  }, [])

  const title = props.type === "CREATE" ? "Create a build" : "Edit build"

  return (
    <Formik<IFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount={true}
      onSubmit={(values) => {
        setSubmit({
          loading: true,
          error: false,
        })
        executePostPatch({
          data:
            props.type === "CREATE"
              ? toFormData(values as IValidFormValues)
              : toPatchFormData(values as IValidFormValues),
        })
          .then((res) => {
            setSubmit({
              loading: false,
              error: false,
            })
            router.push(`/${res.data.owner.username}/${res.data.slug}`)
          })
          .catch((err: AxiosError) => {
            setSubmit({
              loading: false,
              error: err,
            })
          })
      }}
    >
      {(formikProps) => {
        return (
          <LayoutDefault title={title}>
            <Container direction="column" size="small">
              <h2>{title}</h2>
              <Form>
                {step === 1 && props.type === "CREATE" && (
                  <Step1
                    formikProps={formikProps}
                    goToNextStep={goToNextStep}
                  />
                )}

                {(step === 2 || props.type === "EDIT") && payloadData && (
                  <Step2
                    formikProps={formikProps}
                    payloadData={payloadData}
                    submitStatus={submit}
                    type={props.type}
                  />
                )}
              </Form>
            </Container>
          </LayoutDefault>
        )
      }}
    </Formik>
  )
}

export default BuildFormPage
