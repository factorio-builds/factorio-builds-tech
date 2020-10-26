import { useRouter } from "next/router"
import { Form, Formik, Field } from "formik"
import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import Layout from "../../components/Layout"
import { ECategory, EState } from "../../types"
import ImageUpload from "../../components/ImageUpload"
import Input from "../Input"
import Stacker from "../Stacker"
import InputGroup from "../InputGroup"
import {
  decodeBlueprint,
  isBook,
  isValidBlueprint,
} from "../../utils/blueprint"

interface IFormValues {
  name: string
  blueprint: string
  description: string
  state: EState | -1
  tileable: boolean
  categories: ECategory[]
  image: File | null
}

const FILE_SIZE = 160 * 1024
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"]

const initialValues: IFormValues = {
  name: "",
  blueprint: "",
  description: "",
  state: -1,
  tileable: false,
  categories: [],
  image: null,
}

const validation = {
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  blueprint: Yup.string()
    .required("Required")
    .test("valid", "Invalid blueprint string", (blueprint) => {
      if (!blueprint) {
        return false
      }
      return isValidBlueprint(blueprint)
    }),
  description: Yup.string(),
  state: Yup.string().oneOf(Object.keys(EState), "Required"),
  tileable: Yup.boolean(),
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
const validate = (fieldName: keyof IFormValues) => async (value: string) => {
  try {
    await validation[fieldName].validate(value)
    return
  } catch (err) {
    return err.message
  }
}

const BuildCreatePage: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [canInit, setCanInit] = useState(false)
  const [init, setInit] = useState(false)

  return (
    <Formik<IFormValues>
      initialValues={initialValues}
      onSubmit={(values) => {
        fetch("http://localhost:3000/api/build", {
          method: "POST",
          body: JSON.stringify(values),
        }).then((res) => {
          console.log(res)
          dispatch({ type: "CREATE_BUILD", payload: values })
          router.push("/")
        })
      }}
    >
      {(formikProps) => {
        useEffect(() => {
          const isValid = isValidBlueprint(formikProps.values.blueprint)

          if (isValid && formikProps.touched.blueprint) {
            setCanInit(true)
          }
        }, [formikProps.touched.blueprint, formikProps.values.blueprint])

        function preFillForm(): void {
          setInit(true)

          const json = decodeBlueprint(formikProps.values.blueprint)
          console.log(json)

          const bp = isBook(json) ? json.blueprint_book : json.blueprint

          formikProps.setFieldValue("name", bp.label)
          formikProps.setFieldValue("description", bp.description || "")

          // TODO: guess metadata from blueprint content
        }

        function handleOnKeyPress(
          e: React.KeyboardEvent<HTMLTextAreaElement>
        ): void {
          if (e.key === "Enter" && canInit) {
            preFillForm()
          }
        }

        return (
          <Layout
            title="Create a build"
            sidebar={
              <ImageUpload
                onChange={(file) => formikProps.setFieldValue("image", file)}
              />
            }
          >
            <h2>Create a build</h2>

            <Form>
              {!init && (
                <Stacker>
                  <Field
                    name="blueprint"
                    label="Blueprint"
                    type="textarea"
                    rows="5"
                    required
                    component={Input}
                    validate={validate("blueprint")}
                    onKeyPress={handleOnKeyPress}
                  />

                  <div style={{ marginTop: "16px" }}>
                    <button
                      type="button"
                      disabled={!canInit}
                      onClick={preFillForm}
                    >
                      continue
                    </button>
                  </div>
                </Stacker>
              )}

              {init && (
                <Stacker>
                  <Field
                    name="name"
                    label="Name"
                    type="text"
                    required
                    component={Input}
                    validate={validate("name")}
                  />

                  <Field
                    name="description"
                    label="Description"
                    type="textarea"
                    rows="5"
                    component={Input}
                    validate={validate("description")}
                  />

                  <Field
                    name="blueprint"
                    label="Blueprint"
                    type="textarea"
                    rows="5"
                    required
                    component={Input}
                    validate={validate("blueprint")}
                  />

                  <Field
                    name="tileable"
                    label="Tileable"
                    type="checkbox"
                    component={Input}
                    validate={validate("tileable")}
                  />

                  <Field
                    name="state"
                    label="Game state"
                    type="select"
                    required
                    component={Input}
                    options={Object.keys(EState).map((state) => ({
                      label: state,
                      value: state,
                    }))}
                    validate={validate("state")}
                  />

                  <InputGroup
                    legend="Categories"
                    error={formikProps.errors.categories}
                  >
                    {Object.keys(ECategory).map((category) => {
                      return (
                        <Field
                          name="categories"
                          label={category.toLowerCase()}
                          type="checkbox"
                          value={category}
                          inline={true}
                          component={Input}
                          validate={validate("categories")}
                        />
                      )
                    })}
                  </InputGroup>

                  <div style={{ marginTop: "16px" }}>
                    <button>save</button>
                  </div>
                </Stacker>
              )}
            </Form>
          </Layout>
        )
      }}
    </Formik>
  )
}

export default BuildCreatePage
