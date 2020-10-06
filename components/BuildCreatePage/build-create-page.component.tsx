import { useRouter } from "next/router"
import { Form, Formik, Field } from "formik"
import React from "react"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import Layout from "../../components/Layout"
import { ECategory, EState } from "../../types"
import ImageUpload from "../../components/ImageUpload"

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
            <div>
              <label
                htmlFor="name"
                style={{ display: "block", fontWeight: 700, marginTop: "8px" }}
              >
                Name
              </label>
              <Field id="name" name="name" />
              <div style={{ color: "#f00" }}>{formikProps.errors.name}</div>
            </div>

            <div>
              <label
                htmlFor="description"
                style={{ display: "block", fontWeight: 700, marginTop: "8px" }}
              >
                Description
              </label>
              <Field
                as="textarea"
                id="description"
                name="description"
                rows="5"
              />
              <div style={{ color: "#f00" }}>
                {formikProps.errors.description}
              </div>
            </div>

            <div>
              <label
                htmlFor="blueprint"
                style={{ display: "block", fontWeight: 700, marginTop: "8px" }}
              >
                Blueprint
              </label>
              <Field as="textarea" id="blueprint" name="blueprint" rows="5" />
              <div style={{ color: "#f00" }}>
                {formikProps.errors.blueprint}
              </div>
            </div>

            <div>
              <label
                htmlFor="tileable"
                style={{ display: "block", fontWeight: 700, marginTop: "8px" }}
              >
                Tileable
              </label>
              <Field type="checkbox" id="tileable" name="tileable" />
              <div style={{ color: "#f00" }}>{formikProps.errors.tileable}</div>
            </div>

            <div>
              <label
                htmlFor="state"
                style={{ display: "block", fontWeight: 700, marginTop: "8px" }}
              >
                Game state
              </label>
              <Field as="select" id="state" name="state">
                <option value={-1}>-- select --</option>
                {Object.keys(EState).map((state) => {
                  return (
                    <option key={state} value={state}>
                      {state.toLowerCase()}
                    </option>
                  )
                })}
              </Field>
              <div style={{ color: "#f00" }}>{formikProps.errors.state}</div>
            </div>

            <div style={{ fontWeight: 700, marginTop: "8px" }}>Categories</div>
            {Object.keys(ECategory).map((category) => {
              return (
                <div key={category}>
                  <label htmlFor={`category-${category}`}>
                    {category.toLowerCase()}
                  </label>
                  <Field
                    type="checkbox"
                    id={`category-${category}`}
                    name="categories"
                    value={category}
                  />
                </div>
              )
            })}
            <div style={{ color: "#f00" }}>{formikProps.errors.categories}</div>

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
