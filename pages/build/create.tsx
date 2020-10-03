import { useRouter } from "next/router"
import { Form, Formik, Field } from "formik"
import React from "react"
import { useDispatch } from "react-redux"
import Layout from "../../components/Layout"
import { ECategory, EState } from "../../types"
import ImageUpload from "../../components/ImageUpload"

interface IFormValues {
  name: string
  blueprint: string
  description: string
  state: EState | null
  tileable: boolean
  categories: ECategory[]
  image: File | null
}

const BuildsCreatePage: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <Formik<IFormValues>
      initialValues={{
        name: "",
        blueprint: "",
        description: "",
        state: null,
        tileable: false,
        categories: [],
        image: null,
      }}
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
            </div>

            <div>
              <label
                htmlFor="blueprint"
                style={{ display: "block", fontWeight: 700, marginTop: "8px" }}
              >
                Blueprint
              </label>
              <Field as="textarea" id="blueprint" name="blueprint" rows="5" />
            </div>

            <div>
              <label
                htmlFor="tileable"
                style={{ display: "block", fontWeight: 700, marginTop: "8px" }}
              >
                Tileable
              </label>
              <Field type="checkbox" id="tileable" name="tileable" />
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
                  return <option value={state}>{state.toLowerCase()}</option>
                })}
              </Field>
            </div>

            <div style={{ fontWeight: 700, marginTop: "8px" }}>Categories</div>
            {Object.keys(ECategory).map((category) => {
              return (
                <div>
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

            <div style={{ marginTop: "16px" }}>
              <button>save</button>
            </div>
          </Form>
        </Layout>
      )}
    </Formik>
  )
}

export default BuildsCreatePage
