import React, { useCallback, useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Form, Formik } from "formik"
import { useRouter } from "../../../lib/router"
import { useAppSelector } from "../../../redux/store"
import { IFullBuild, IFullPayload, IThinBuild } from "../../../types/models"
import { http, HttpError } from "../../../utils/http"
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
  const [step1Payload, setStep1Payload] = useState<IFullPayload>()
  const [submit, setSubmit] = useState<ISubmitStatus>({
    loading: false,
    error: false,
  })

  const accessToken = useAppSelector((s) => s.auth?.user?.accessToken)
  const editHash =
    props.type === "EDIT" ? props.build.latest_version.hash : undefined

  const payloadQuery = useQuery({
    queryKey: ["payload", editHash, { includeChildren: true }],
    queryFn: async ({ signal }) => {
      const res = await http.get<IFullPayload>(`/payloads/${editHash}`, {
        params: { include_children: true },
        signal,
        accessToken,
      })
      return res.data
    },
    enabled: props.type === "EDIT" && Boolean(editHash),
  })

  const payloadData = step1Payload ?? payloadQuery.data

  const postPatchMutation = useMutation<IThinBuild, HttpError, FormData>({
    mutationFn: async (data) => {
      const url =
        props.type === "CREATE" ? "/builds" : props.build._links.self.href
      const method = props.type === "CREATE" ? http.post : http.patch
      const res = await method<IThinBuild>(url, { data, accessToken })
      return res.data
    },
  })

  const initialValues = useMemo(() => {
    return createInitialValues(props.build)
  }, [props.build])

  const goToNextStep = useCallback((fullPayload: IFullPayload) => {
    setStep(2)
    setStep1Payload(fullPayload)
  }, [])

  const title = props.type === "CREATE" ? "Create a build" : "Edit build"

  return (
    <Formik<IFormValues>
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount={true}
      onSubmit={(values) => {
        setSubmit({ loading: true, error: false })
        const formData =
          props.type === "CREATE"
            ? toFormData(values as IValidFormValues)
            : toPatchFormData(values as IValidFormValues)
        postPatchMutation.mutate(formData, {
          onSuccess: (data) => {
            setSubmit({ loading: false, error: false })
            router.push(`/${data.owner.username}/${data.slug}`)
          },
          onError: (err) => {
            setSubmit({ loading: false, error: err })
          },
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
