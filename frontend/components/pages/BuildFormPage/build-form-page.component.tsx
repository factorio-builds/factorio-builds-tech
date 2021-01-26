import React, { useCallback, useState } from "react"
import { Form, Formik } from "formik"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { useApi } from "../../../hooks/useApi"
import { ECategory, EState } from "../../../types"
import { IFullBuild } from "../../../types/models"
import Layout from "../../ui/Layout"
import Step1 from "./step-1.component"
import Step2 from "./step-2.component"

export interface IFormValues {
  hash: string
  title: string
  slug: string
  description: string
  state: EState[]
  tileable: boolean
  withMarkedInputs: boolean
  withBeacons: boolean
  categories: ECategory[]
  cover: {
    x: number | null
    y: number | null
    width: number | null
    height: number | null
    file: File | null
    url: string | null
    hash: string | null
  }
}

interface IValidFormValues {
  hash: string
  title: string
  slug: string
  description: string
  state: EState[]
  tileable: boolean
  withMarkedInputs: boolean
  withBeacons: boolean
  categories: ECategory[]
  cover: {
    x: number | null
    y: number | null
    width: number | null
    height: number | null
    file: File | null
    url: string | null
    hash: string | null
  }
}

const FILE_SIZE = 160 * 1024
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"]

const baseInitialValues: IFormValues = {
  hash: "",
  title: "",
  slug: "",
  description: "",
  state: [],
  tileable: false,
  withMarkedInputs: false,
  withBeacons: false,
  categories: [],
  cover: {
    x: null,
    y: null,
    width: null,
    height: null,
    file: null,
    url: null,
    hash: null,
  },
}

const createInitialValues = (build?: IFullBuild): IFormValues => {
  if (!build) {
    return baseInitialValues
  }

  return {
    hash: build.latest_version.hash,
    title: build.title,
    slug: build.slug,
    description: build.description || "",
    state: [],
    tileable: false,
    withMarkedInputs: false,
    withBeacons: false,
    categories: [],
    cover: {
      x: null,
      y: null,
      width: null,
      height: null,
      file: null,
      url: build._links.cover?.href || null,
      hash: null,
    },
  }
}

const validation = {
  hash: Yup.string(),
  title: Yup.string()
    .min(2, "Too Short!")
    .max(128, "Too Long!")
    .required("Required"),
  slug: Yup.string()
    .min(3, "Too Short!")
    .max(100, "Too Long!")
    .matches(
      /[a-zA-Z0-9_-]+/,
      "A slug can only contain alphanumerical characters, plus _ and -"
    )
    .not(
      ["account", "admin", "administrator", "delete", "edit", "import", "raw"],
      "A slug cannot use a reserved keyword"
    ),
  description: Yup.string(),
  state: Yup.array().required(),
  tileable: Yup.boolean(),
  withMarkedInputs: Yup.boolean(),
  withBeacons: Yup.boolean(),
  categories: Yup.array(),
  cover: Yup.object()
    .required()
    .shape({
      x: Yup.number(),
      y: Yup.number(),
      width: Yup.number(),
      height: Yup.number(),
      file: Yup.mixed()
        .required("A file is required")
        .test(
          "fileSize",
          "File too large",
          (value) => value && value.size <= FILE_SIZE
        )
        .test(
          "fileFormat",
          "Unsupported Format",
          (value) => value && SUPPORTED_FORMATS.includes(value.type)
        ),
      hash: Yup.string(),
    }),
}

// TODO: validate image
export const validate = (fieldName: keyof IFormValues) => async (
  value: string
): Promise<any> => {
  try {
    await validation[fieldName].validate(value)
    return
  } catch (err) {
    return err.message
  }
}

const toFormData = (formValues: IValidFormValues) => {
  const formData = new FormData()

  formData.append("slug", formValues.slug)

  formData.append("hash", formValues.hash)
  formData.append("title", formValues.title)
  formData.append("description", formValues.description) // optional

  const tags = ["/production/rocket parts", "/train/rails"]
  tags.forEach((tag, index) => {
    formData.append(`tags[${index}]`, tag)
  })

  formData.append("version.name", "1.0.0") // optional
  formData.append("version.description", "Initial version") // optional

  if (formValues.cover.file) {
    formData.append("cover.file", formValues.cover.file)
    formData.append("cover.x", "0") // optional
    formData.append("cover.y", "0") // optional
    formData.append("cover.width", String(formValues.cover.width))
    formData.append("cover.height", String(formValues.cover.height))
  } else {
    // formData.append("cover.hash", "8a617f78-c14a-46a1-87ef-adb25f256f6a")
  }

  return formData
}

const toPatchFormData = (formValues: IValidFormValues) => {
  const formData = new FormData()

  formData.append("slug", formValues.slug)

  formData.append("hash", formValues.hash)
  formData.append("title", formValues.title)
  formData.append("description", formValues.description) // optional

  const tags = ["/production/rocket parts", "/train/rails"]
  tags.forEach((tag, index) => {
    formData.append(`tags[${index}]`, tag)
  })

  // formData.append("version.name", "hello there") // optional
  // formData.append("version.description", "lorem ipsum") // optional

  if (formValues.cover.file) {
    formData.append("cover.file", formValues.cover.file)
    formData.append("cover.x", "0") // optional
    formData.append("cover.y", "0") // optional
    formData.append("cover.width", String(formValues.cover.width))
    formData.append("cover.height", String(formValues.cover.height))
  } else {
    // formData.append("cover.hash", "8a617f78-c14a-46a1-87ef-adb25f256f6a")
  }

  return formData
}

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
  const [submit, setSubmit] = useState({
    loading: false,
    error: false,
  })

  const { /*data, loading, error, */ execute } = useApi(
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
    { manual: true }
  )

  const initialValues = createInitialValues(props.build)

  const goToNextStep = useCallback(() => {
    setStep(2)
  }, [])

  const title = props.type === "CREATE" ? "Create a build" : "Edit build"

  return (
    <Formik<IFormValues>
      initialValues={initialValues}
      onSubmit={(values) => {
        setSubmit({
          loading: true,
          error: false,
        })
        execute({
          url:
            props.type === "CREATE" ? "/builds" : props.build._links.self.href,
          method: props.type === "CREATE" ? "POST" : "PATCH",
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
          .catch((err) => {
            setSubmit({
              loading: false,
              error: err,
            })
          })
      }}
    >
      {(formikProps) => {
        return (
          <Layout title={title}>
            <h2>{title}</h2>
            <Form>
              {step === 1 && props.type === "CREATE" && (
                <Step1 formikProps={formikProps} goToNextStep={goToNextStep} />
              )}

              {(step === 2 || props.type === "EDIT") && (
                <Step2 formikProps={formikProps} submitStatus={submit} />
              )}
            </Form>
          </Layout>
        )
      }}
    </Formik>
  )
}

export default BuildFormPage
