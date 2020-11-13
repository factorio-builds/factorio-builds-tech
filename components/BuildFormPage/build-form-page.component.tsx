import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Form, Formik, Field } from "formik"
import startCase from "lodash/startCase"
import { useRouter } from "next/router"
import * as Yup from "yup"
import { ECategory, EState, IBuild } from "../../types"
import {
  decodeBlueprint,
  isBook,
  isValidBlueprint,
} from "../../utils/blueprint"
import Button from "../Button"
import ImageUpload from "../ImageUpload"
import Input from "../Input"
import InputGroup from "../InputGroup"
import ItemIcon from "../ItemIcon"
import Layout from "../Layout"
import Stacker from "../Stacker"
import * as SC from "./build-form-page.styles"

interface IFormValues {
  name: string
  blueprint: string
  description: string
  state: EState | -1
  tileable: boolean
  categories: ECategory[]
  image: File | string | null
}

interface IValidFormValues {
  name: string
  blueprint: string
  description: string
  state: EState
  tileable: boolean
  categories: ECategory[]
  image: File
}

const FILE_SIZE = 160 * 1024
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"]

// TODO: extract
const CATEGORY_MAP = [
  {
    icon: "splitter",
    name: startCase(ECategory.BALANCER),
    value: ECategory.BALANCER,
  },
  {
    icon: "stone-furnace",
    name: startCase(ECategory.SMELTING),
    value: ECategory.SMELTING,
  },
  {
    icon: "straight-rail",
    name: startCase(ECategory.TRAINS),
    value: ECategory.TRAINS,
  },
  {
    icon: "assembling-machine-1",
    name: startCase(ECategory.PRODUCTION),
    value: ECategory.PRODUCTION,
  },
  {
    icon: "solar-panel",
    name: startCase(ECategory.ENERGY),
    value: ECategory.ENERGY,
  },
]

const baseInitialValues: IFormValues = {
  name: "",
  blueprint: "",
  description: "",
  state: -1,
  tileable: false,
  categories: [],
  image: null,
}

const createInitialValues = (build?: IBuild): IFormValues => {
  if (!build) {
    return baseInitialValues
  }

  return {
    name: build.name,
    blueprint: build.blueprint,
    description: build.description,
    state: build.metadata.state,
    tileable: build.metadata.tileable,
    categories: build.metadata.categories,
    image: build.image.src,
  }
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

const toFormData = (formValues: IValidFormValues) => {
  const formData = new FormData()

  formData.append("name", formValues.name)
  formData.append("blueprint", formValues.blueprint)
  formData.append("description", formValues.description)
  formData.append("state", formValues.state)
  formData.append("tileable", String(formValues.tileable))
  formData.append("categories", JSON.stringify(formValues.categories))
  formData.append("image", formValues.image)

  return formData
}

interface IBuildFormPageCreating {
  type: "CREATE"
  build?: undefined
}

interface IBuildFormPageEditing {
  type: "EDIT"
  build: IBuild
}

type TBuildFormPage = IBuildFormPageCreating | IBuildFormPageEditing

const BuildFormPage: React.FC<TBuildFormPage> = (props) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [canInit, setCanInit] = useState(false)
  const [init, setInit] = useState(false)

  const initialValues = createInitialValues(props.build)

  return (
    <Formik<IFormValues>
      initialValues={initialValues}
      onSubmit={(values) => {
        const endpoint =
          props.type === "EDIT" ? `build/${props.build.id}` : `build`
        fetch(`http://localhost:3000/api/${endpoint}`, {
          method: "POST",
          body: toFormData(values as IValidFormValues),
        })
          .then((res) => res.json())
          .then((res) => {
            if (props.type === "EDIT") {
              dispatch({
                type: "EDIT_BUILD",
                payload: res,
              })
            } else {
              dispatch({
                type: "CREATE_BUILD",
                payload: res,
              })
            }
            router.push("/")
          })
      }}
    >
      {(formikProps) => {
        useEffect(() => {
          const isValid = isValidBlueprint(formikProps.values.blueprint)

          if (isValid && formikProps.touched.blueprint) {
            setCanInit(true)
          } else {
            setCanInit(false)
          }
        }, [formikProps.touched.blueprint, formikProps.values.blueprint])

        function preFillForm(): void {
          setInit(true)

          const json = decodeBlueprint(formikProps.values.blueprint)

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
            /* TODO: extract style */
            subheader={
              <h2 style={{ fontSize: "24px", fontWeight: 700 }}>
                {props.type === "CREATE" ? "Create a build" : "Edit build"}
              </h2>
            }
          >
            <Form>
              <SC.Row>
                <SC.Content>
                  {!init && props.type === "CREATE" && (
                    <Stacker>
                      <p>
                        Get started with a blueprint string, we will parse your
                        blueprint to extract the relevant metadata as best as we
                        can!
                      </p>

                      <Field
                        name="blueprint"
                        label="Blueprint string"
                        type="textarea"
                        rows="5"
                        required
                        component={Input}
                        validate={validate("blueprint")}
                        onKeyPress={handleOnKeyPress}
                        validFeedback="Found a valid blueprint"
                      />

                      {canInit && (
                        <>
                          <p>
                            Blueprint with a name of XXXXX, totally YYY
                            entities.Assuming category of ABC, game state of DEF
                            with ZZ% confidence.
                          </p>

                          <p>
                            You’ll get to adjust everything on the next screen.
                          </p>
                        </>
                      )}

                      <div style={{ marginTop: "16px" }}>
                        <Button
                          variant="success"
                          type="button"
                          disabled={!canInit}
                          onClick={preFillForm}
                        >
                          Continue
                        </Button>
                      </div>
                    </Stacker>
                  )}

                  {(init || props.type === "EDIT") && (
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
                        size="small"
                      />

                      <InputGroup
                        legend="Categories"
                        error={formikProps.errors.categories}
                      >
                        {CATEGORY_MAP.map((category) => {
                          return (
                            <Field
                              key={category.value}
                              name="categories"
                              label={category.name}
                              prefix={<ItemIcon itemName={category.icon} />}
                              type="checkbox"
                              value={category.value}
                              component={Input}
                              validate={validate("categories")}
                            />
                          )
                        })}
                      </InputGroup>

                      <div style={{ marginTop: "16px" }}>
                        <Button variant="success">Save build</Button>
                      </div>
                    </Stacker>
                  )}
                </SC.Content>
                <SC.Sidebar>
                  {(init || props.type === "EDIT") && (
                    <ImageUpload
                      label="Build image"
                      image={
                        typeof formikProps.values.image === "string"
                          ? formikProps.values.image
                          : null
                      }
                      onChange={(file) =>
                        formikProps.setFieldValue("image", file)
                      }
                    />
                  )}
                </SC.Sidebar>
              </SC.Row>
            </Form>
          </Layout>
        )
      }}
    </Formik>
  )
}

export default BuildFormPage
