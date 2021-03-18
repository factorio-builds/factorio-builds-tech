import React, { useCallback, useEffect, useMemo, useState } from "react"
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
  IFullPayload,
  IThinBuild,
} from "../../../types/models"
import Container from "../../ui/Container"
import Layout from "../../ui/Layout"
import Step1 from "./step-1.component"
import Step2 from "./step-2.component"

export interface IFormValues {
  isBook: boolean | undefined
  hash: string
  title: string
  slug: string
  description: string
  tags: string[]
  cover: {
    type: "file" | "hash"
    file: File | null
    url: string | null
    hash: string | null
    crop: {
      x: number
      y: number
      width: number
      height: number
    } | null
  }
  version?: ICreateBuildRequest["version"]
}

interface IValidFormValues {
  isBook: boolean
  hash: string
  title: string
  slug: string
  description: string
  tags: string[]
  cover: {
    type: "file" | "hash"
    file: File | null
    url: string | null
    hash: string | null
    crop: {
      x: number
      y: number
      width: number
      height: number
    } | null
  }
  version?: ICreateBuildRequest["version"]
}

const FILE_SIZE = 10 * 1000 * 1024 // 10MB
const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/gif",
  "image/png",
] as const

const baseInitialValues: IFormValues = {
  isBook: undefined,
  hash: "",
  title: "",
  slug: "",
  description: "",
  tags: [],
  cover: {
    type: "file",
    file: null,
    url: null,
    hash: null,
    crop: null,
  },
}

const createInitialValues = (build?: IFullBuild): IFormValues => {
  if (!build) {
    return baseInitialValues
  }

  return {
    isBook: build.latest_version.type === "blueprint-book",
    hash: build.latest_version.hash,
    title: build.title,
    slug: build.slug,
    description: build.description || "",
    tags: build.tags,
    cover: {
      type: build.latest_version.type === "blueprint" ? "hash" : "file",
      crop: null,
      file: null,
      url: build._links.cover?.href || null,
      hash:
        build.latest_version.type === "blueprint"
          ? build.latest_version.hash
          : null,
    },
  }
}

const validation = {
  isBook: Yup.boolean(),
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
  tags: Yup.array(Yup.string()).test({
    name: "tags-required",
    message: "At least one tag must be selected",
    test: function (value) {
      return Array.isArray(value) && value.length !== 0
    },
  }),
  cover: Yup.object()
    .required()
    .shape({
      crop: Yup.object().nullable().shape({
        x: Yup.number().nullable(),
        y: Yup.number().nullable(),
        width: Yup.number().nullable(),
        height: Yup.number().nullable(),
      }),
      file: Yup.mixed()
        .nullable()
        .test({
          name: "file",
          message: "cover.file is required",
          test: function (value) {
            if (value) return true
            // optional if it's a single blueprint
            // @ts-ignore
            if (!this.options.from[1].value.isBook) return true
            // otherwise, is required if no hash is provided
            if (!this.parent.hash) return false
            return true
          },
        })
        .test("fileSize", "File too large", function (value) {
          if (value && value.size >= FILE_SIZE) return false
          return true
        })
        .test("fileFormat", "Unsupported Format", function (value) {
          if (value && !SUPPORTED_FORMATS.includes(value.type)) return false
          return true
        }),
      hash: Yup.mixed()
        .nullable()
        .test({
          name: "hash",
          message: "cover.hash is required",
          test: function (value) {
            if (value) return true
            // optional if it's a single blueprint
            // @ts-ignore
            if (!this.options.from[1].value.isBook) return true
            // is required if no file is provided
            if (!this.parent.file) return false
            return true
          },
        }),
    }),
  version: Yup.mixed().nullable(),
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

  // this is necessary for the version field to not get stripped with an empty array
  if (
    !formData.get("version[icons][0][type]") ||
    !formData.get("version[icons][0][name]")
  ) {
    formData.append("version[icons]", JSON.stringify([]))
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
      file: formValues.cover.file,
      hash: formValues.cover.hash,
      crop: formValues.cover.crop,
    },
    version: {
      icons: formValues.version?.icons || [],
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
      file: formValues.cover.file,
      hash: formValues.cover.hash,
      crop: formValues.cover.crop,
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
  const [build, setBuild] = useState<IFullBuild | undefined>(props.build)
  const [payloadData, setPayloadData] = useState<IFullPayload>()
  const [submit, setSubmit] = useState({
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
      validationSchema={Yup.object(validation)}
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
                  />
                )}
              </Form>
            </Container>
          </Layout>
        )
      }}
    </Formik>
  )
}

export default BuildFormPage
