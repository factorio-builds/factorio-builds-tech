import React from "react"
import { Field, FormikProps } from "formik"
import { useCategories } from "../../../hooks/useCategories"
import { useGameStates } from "../../../hooks/useGameStates"
import Input from "../../form/FormikInputWrapper"
import InputGroup from "../../form/InputGroup"
import Stacker from "../../ui/Stacker"
import { IFormValues, validate } from "./build-form-page.component"

interface IStep2DataProps {
  formikProps: FormikProps<IFormValues>
}

const Step2Data: React.FC<IStep2DataProps> = (props) => {
  const { categories } = useCategories()
  const { gameStates } = useGameStates()

  return (
    <>
      <Field
        name="title"
        label="Title"
        type="text"
        required
        component={Input}
        validate={validate("title")}
      />

      <Field
        name="slug"
        label="Slug"
        type="text"
        required
        component={Input}
        validate={validate("slug")}
      />

      <Field
        name="description"
        label="Description"
        type="textarea"
        rows="5"
        component={Input}
        validate={validate("description")}
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
          name="withMarkedInputs"
          label="Inputs are marked"
          type="checkbox"
          component={Input}
          validate={validate("withMarkedInputs")}
        />

        <Field
          name="withBeacons"
          label="With beacons"
          type="checkbox"
          component={Input}
          validate={validate("withBeacons")}
        />
      </Stacker>

      <InputGroup legend="Game states" error={props.formikProps.errors.state}>
        <Stacker gutter={8}>
          {gameStates.map((gameState) => {
            return (
              <Field
                key={gameState.value}
                name="state"
                label={gameState.name}
                prefix={gameState.icon}
                type="checkbox"
                value={gameState.value}
                component={Input}
                validate={validate("state")}
              />
            )
          })}
        </Stacker>
      </InputGroup>

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
    </>
  )
}

export default Step2Data
