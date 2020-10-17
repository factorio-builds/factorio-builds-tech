import { useRouter } from "next/router"
import { Form, Formik, Field } from "formik"
import React from "react"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import Layout from "../../components/Layout"
import { ECategory, EState } from "../../types"
import ImageUpload from "../../components/ImageUpload"
import Input from "../Input"
import Stacker from "../Stacker"
import InputGroup from "../InputGroup"

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

const BuildSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  blueprint: Yup.string().required("Required"),
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
})

const BuildCreatePage: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <Formik<IFormValues>
      initialValues={initialValues}
      validationSchema={BuildSchema}
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
      {(formikProps) => (
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
            <Stacker>
              <Field
                name="name"
                label="Name"
                type="text"
                required
                component={Input}
              />

              <Field
                name="description"
                label="Description"
                type="textarea"
                rows="5"
                component={Input}
              />

              <Field
                name="blueprint"
                label="Blueprint"
                type="textarea"
                rows="5"
                required
                component={Input}
              />

              <Field
                name="tileable"
                label="Tileable"
                type="checkbox"
                component={Input}
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
                    />
                  )
                })}
              </InputGroup>
            </Stacker>

            <div style={{ marginTop: "16px" }}>
              <button>save</button>
            </div>
          </Form>
        </Layout>
      )}
    </Formik>
  )
}

export default BuildCreatePage
