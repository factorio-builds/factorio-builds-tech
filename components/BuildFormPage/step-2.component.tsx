import React from "react"
import { Field, FormikProps } from "formik"
import startCase from "lodash/startCase"
import { ECategory, EState } from "../../types"
import Button from "../Button"
import ImageUpload from "../ImageUpload"
import Input from "../Input"
import InputGroup from "../InputGroup"
import ItemIcon from "../ItemIcon"
import Spinner from "../Spinner"
import Stacker from "../Stacker"
import { IFormValues, validate } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

// TODO: extract
const STATE_MAP = [
  {
    name: "Early-game",
    value: EState.EARLY_GAME,
  },
  {
    name: "Mid-game",
    value: EState.MID_GAME,
  },
  {
    name: "Late-game",
    value: EState.LATE_GAME,
  },
]

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

interface IStep2Props {
  formikProps: FormikProps<IFormValues>
  submitStatus: { loading: boolean; error: boolean | string }
}

const Step2: React.FC<IStep2Props> = (props) => {
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

          <Field
            name="state"
            label="Game state"
            type="select"
            required
            component={Input}
            options={STATE_MAP.map((state) => ({
              label: state.name,
              value: state.value,
            }))}
            validate={validate("state")}
            size="small"
          />

          <InputGroup
            legend="Categories"
            error={props.formikProps.errors.categories}
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
