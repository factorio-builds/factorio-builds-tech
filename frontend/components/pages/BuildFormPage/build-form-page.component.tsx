import React, { useCallback, useState } from "react"
import { Form, Formik } from "formik"
import asFormData from "json-form-data"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { useApi } from "../../../hooks/useApi"
import {
  ICreateBuildRequest,
  ICreateVersionRequest,
  IEditBuildRequest,
  IFullBuild,
} from "../../../types/models"
import Layout from "../../ui/Layout"
import Step1 from "./step-1.component"
import Step2 from "./step-2.component"

export interface IFormValues {
  hash: string
  title: string
  slug: string
  description: string
  tags: string[]
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
  tags: string[]
  cover: {
    x: number
    y: number
    width: number
    height: number
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
  tags: [],
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
    tags: build.tags,
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
    .required("A slug is required")
    .matches(
      /[a-zA-Z0-9_-]+/,
      "A slug can only contain alphanumerical characters, plus _ and -"
    )
    .not(
      ["account", "admin", "administrator", "delete", "edit", "import", "raw"],
      "A slug cannot use a reserved keyword"
    ),
  description: Yup.string(),
  tags: Yup.array(Yup.string()),
  cover: Yup.object()
    .required()
    .shape({
      x: Yup.number()
        .nullable()
        .test({
          name: "x",
          message: "cover.x is required",
          test: function (value) {
            if (this.parent.file === null) {
              return true
            }
            return Number.isInteger(value)
          },
        }),
      y: Yup.number()
        .nullable()
        .test({
          name: "y",
          message: "cover.y is required",
          test: function (value) {
            if (this.parent.file === null) {
              return true
            }
            return Number.isInteger(value)
          },
        }),
      width: Yup.number()
        .nullable()
        .test({
          name: "width",
          message: "cover.width is required",
          test: function (value) {
            if (this.parent.file === null) {
              return true
            }
            return Number.isInteger(value)
          },
        }),
      height: Yup.number()
        .nullable()
        .test({
          name: "height",
          message: "cover.height is required",
          test: function (value) {
            if (this.parent.file === null) {
              return true
            }
            return Number.isInteger(value)
          },
        }),
      file: Yup.mixed()
        .nullable()
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
      // hash: Yup.string()
      //   .nullable()
      //   .when("file", {
      //     is: null,
      //     then: Yup.string().required("A hash is required"),
      //   }),
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

const toFormDataInner = (
  request: ICreateBuildRequest | ICreateVersionRequest | IEditBuildRequest
) => {
  // todo: not sure about the `ValidJSON` type. seems wrong to me...
  // `any` cast fixes the type error
  const formData = asFormData(request as any)

  // todo: not sure why the backend doesn't pick up the [file]
  // it works with all other fields. maybe a dotnet bug?
  if (formData.get("cover[file]")) {
    formData.append("cover.file", formData.get("cover[file]") as any)
    formData.delete("cover[file]")
  }

  return formData
}

const toFormData = (formValues: IValidFormValues) => {
  const request: ICreateBuildRequest = {
    slug: formValues.slug,
    hash: formValues.hash,
    title: formValues.title,
    description: formValues.description,
    tags: formValues.tags,
    cover: {
      x: formValues.cover.x,
      y: formValues.cover.y,
      width: formValues.cover.width,
      height: formValues.cover.height,
      file: formValues.cover.file,
      hash: formValues.cover.hash,
    },
    version: {
      icons: [
        {
          name: "solar-panel",
          type: "item",
        },
      ],
    },
  }

  return toFormDataInner(request)
}

const toPatchFormData = (formValues: IValidFormValues) => {
  const request: IEditBuildRequest = {
    title: formValues.title,
    description: formValues.description,
    tags: formValues.tags,
    cover: {
      x: formValues.cover.x,
      y: formValues.cover.y,
      width: formValues.cover.width,
      height: formValues.cover.height,
      file: formValues.cover.file,
      hash: formValues.cover.hash,
    },
  }

  return toFormDataInner(request)
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
      validationSchema={Yup.object(validation)}
      validateOnMount={true}
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
