import React from "react"
import { Field, FormikProps } from "formik"
import Input from "../../components/form/FormikInputWrapper"
import InputGroup from "../../components/form/InputGroup"
import Button from "../../components/ui/Button"
import ImageUpload from "../../components/ui/ImageUpload"
import Spinner from "../../components/ui/Spinner"
import Stacker from "../../components/ui/Stacker"
import { useCategories } from "../../hooks/useCategories"
import { useGameStates } from "../../hooks/useGameStates"
import { IFormValues, validate } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

interface IStep2Props {
  formikProps: FormikProps<IFormValues>
  submitStatus: { loading: boolean; error: boolean | string }
}

const Step2: React.FC<IStep2Props> = (props) => {
  const { categories } = useCategories()
  const { gameStates } = useGameStates()

  return (
    <SC.Row>
      <SC.Content>
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

          <Stacker gutter={8}>
            <Field
              name="tileable"
              label="Tileable"
              type="checkbox"
              component={Input}
              validate={validate("tileable")}
            />

            <Field
              name="markedInputs"
              label="Inputs are marked"
              type="checkbox"
              component={Input}
              validate={validate("markedInputs")}
            />
          </Stacker>

          <Field
            name="state"
            label="Game state"
            type="select"
            required
            component={Input}
            options={gameStates.map((gameState) => ({
              label: (
                <>
                  {gameState.icon} {gameState.name}
                </>
              ),
              value: gameState.value,
            }))}
            validate={validate("state")}
            size="small"
          />

          <InputGroup
            legend="Categories"
            error={props.formikProps.errors.categories}
          >
            <Stacker gutter={8}>
              {categories.map((category) => {
                return (
                  <Field
                    key={category.value}
                    name="categories"
                    label={category.name}
                    prefix={category.icon}
                    type="checkbox"
                    value={category.value}
                    component={Input}
                    validate={validate("categories")}
                  />
                )
              })}
            </Stacker>
          </InputGroup>

          <SC.ButtonsStack gutter={24} orientation="horizontal">
            <Button variant="success" disabled={props.submitStatus.loading}>
              <Stacker gutter={10} orientation="horizontal">
                <span>Save build</span>
                {props.submitStatus.loading && <Spinner />}
              </Stacker>
            </Button>
          </SC.ButtonsStack>
        </Stacker>
      </SC.Content>
      <SC.Sidebar>
        <ImageUpload
          label="Build image"
          image={
            typeof props.formikProps.values.image === "string"
              ? props.formikProps.values.image
              : null
          }
          onChange={(file) => props.formikProps.setFieldValue("image", file)}
        />
      </SC.Sidebar>
    </SC.Row>
  )
}

export default Step2
