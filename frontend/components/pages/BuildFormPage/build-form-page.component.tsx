import React, { useCallback, useState } from "react"
import { Form, Formik } from "formik"
import kebabCase from "lodash/kebabCase"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { Build } from "../../../db/entities/build.entity"
import { useApi } from "../../../hooks/useApi"
import { ECategory, EState } from "../../../types"
import { isValidBlueprint } from "../../../utils/blueprint"
import Layout from "../../ui/Layout"
import Step1 from "./step-1.component"
import Step2 from "./step-2.component"

export interface IFormValues {
  hash: string
  title: string
  encoded: string
  description: string
  state: EState[]
  tileable: boolean
  withMarkedInputs: boolean
  withBeacons: boolean
  categories: ECategory[]
  image: File | string | null
}

interface IValidFormValues {
  hash: string
  title: string
  encoded: string
  description: string
  state: EState[]
  tileable: boolean
  withMarkedInputs: boolean
  withBeacons: boolean
  categories: ECategory[]
  image: File
}

const FILE_SIZE = 160 * 1024
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"]

const baseInitialValues: IFormValues = {
  hash: "",
  title: "",
  encoded: "",
  description: "",
  state: [],
  tileable: false,
  withMarkedInputs: false,
  withBeacons: false,
  categories: [],
  image: null,
}

// const createInitialValues = (build?: Build): IFormValues => {
//   if (!build) {
//     return baseInitialValues
//   }

//   const img = build.image ? build.image.src : null

//   return {
//     hash: "",
//     title: build.name,
//     encoded: "",
//     description: build.description,
//     state: build.metadata.state,
//     tileable: build.metadata.tileable,
//     withMarkedInputs: build.metadata.withMarkedInputs,
//     withBeacons: build.metadata.withBeacons,
//     categories: build.metadata.categories,
//     image: img,
//   }
// }

const validation = {
  hash: Yup.string(),
  title: Yup.string()
    .min(2, "Too Short!")
    .max(128, "Too Long!")
    .required("Required"),
  encoded: Yup.string()
    .required("Required")
    .test("valid", "Invalid blueprint string", (blueprint) => {
      if (!blueprint) {
        return false
      }
      return isValidBlueprint(blueprint)
    }),
  description: Yup.string(),
  state: Yup.array().required(),
  tileable: Yup.boolean(),
  withMarkedInputs: Yup.boolean(),
  withBeacons: Yup.boolean(),
  categories: Yup.array(),
  image: Yup.mixed()
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

  // todo: kebab alone is not good enough;
  // slug must be properly transliterated into [a-zA-Z0-9_-]+
  formData.append("slug", kebabCase(formValues.title))

  formData.append("hash", formValues.hash)
  formData.append("title", formValues.title)
  formData.append("description", formValues.description) // optional

  // this works but I don't know if there's a better way
  formData.append("tags[0]", "/production/rocket parts")
  formData.append("tags[1]", "/train/rails")

  // again, this works but looks wonky
  formData.append("icons[0].type", "item")
  formData.append("icons[0].name", "stone-wall")

  // formData.append("version.name", "hello there") // optional
  // formData.append("version.description", "lorem ipsum") // optional

  // formData.append("cover.x", "0") // optional
  // formData.append("cover.y", "0") // optional
  formData.append("cover.width", "480")
  formData.append("cover.height", "480")

  // either an uploaded file
  formData.append("cover.file", formValues.image)
  // ... or a hash
  // formData.append("cover.hash", formValues.image)

  return formData
}

interface IBuildFormPageCreating {
  type: "CREATE"
  build?: undefined
}

interface IBuildFormPageEditing {
  type: "EDIT"
  build: Build
}

type TBuildFormPage = IBuildFormPageCreating | IBuildFormPageEditing

const BuildFormPage: React.FC<TBuildFormPage> = (props) => {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [submit, setSubmit] = useState({
    loading: false,
    error: false,
  })

  const { /*data, loading, error, */ execute } = useApi({
    url: "/builds",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  // const initialValues = createInitialValues(props.build)

  const goToNextStep = useCallback(() => {
    setStep(2)
  }, [])

  const title = props.type === "CREATE" ? "Create a build" : "Edit build"

  return (
    <Formik<IFormValues>
      initialValues={baseInitialValues}
      onSubmit={(values) => {
        setSubmit({
          loading: true,
          error: false,
        })
        execute({
          data: toFormData(values as IValidFormValues),
        })
          .then((res) => {
            setSubmit({
              loading: false,
              error: false,
            })
            console.log(res)
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
