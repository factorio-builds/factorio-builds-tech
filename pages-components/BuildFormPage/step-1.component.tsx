import React, { useMemo } from "react"
import { Field, FormikProps } from "formik"
import Input from "../../components/form/FormikInputWrapper"
import Button from "../../components/ui/Button"
import Stacker from "../../components/ui/Stacker"
import {
  decodeBlueprint,
  isBook,
  isValidBlueprint,
} from "../../utils/blueprint"
import { blueprintHeuristics } from "../../utils/blueprint-heuristics"
import { IFormValues, validate } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

interface IStep1Props {
  formikProps: FormikProps<IFormValues>
  goToNextStep: () => void
}

const Step1: React.FC<IStep1Props> = (props) => {
  const stepIsValid = useMemo(() => {
    const isValid = isValidBlueprint(props.formikProps.values.blueprint)

    if (isValid) {
      return true
    } else {
      return false
    }
  }, [props.formikProps.values.blueprint])

  function preFillForm(): void {
    const json = decodeBlueprint(props.formikProps.values.blueprint)

    const bp = isBook(json) ? json.blueprint_book : json.blueprint

    props.formikProps.setFieldValue("name", bp.label)
    props.formikProps.setFieldValue("description", bp.description || "")

    // TODO: extract
    // TODO: guess metadata from blueprint content
    if (!isBook(json)) {
      const bp = json.blueprint
      const { withMarkedInputs, withBeacons } = blueprintHeuristics(bp)
      props.formikProps.setFieldValue(
        "withMarkedInputs",
        withMarkedInputs.value
      )
      props.formikProps.setFieldValue("withBeacons", withBeacons.value)
    } else {
      const blueprints = json.blueprint_book.blueprints
      props.formikProps.setFieldValue(
        "withMarkedInputs",
        blueprints.some(({ blueprint }) => {
          return blueprintHeuristics(blueprint).withMarkedInputs.value
        })
      )
      props.formikProps.setFieldValue(
        "withBeacons",
        blueprints.some(({ blueprint }) => {
          return blueprintHeuristics(blueprint).withBeacons.value
        })
      )
    }

    props.goToNextStep()
  }

  function handleOnKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && stepIsValid) {
      preFillForm()
    }
  }

  return (
    <SC.Row>
      <SC.Content>
        <Stacker>
          <p>
            Get started with a blueprint string, we will parse your blueprint to
            extract the relevant metadata as best as we can!
          </p>

          <Field
            name="blueprint"
            label="Blueprint string"
            type="textarea"
            rows="5"
            required
            component={Input}
            validate={validate("blueprint")}
            onChange={props.formikProps.handleChange}
            onKeyPress={handleOnKeyPress}
            validFeedback="Found a valid blueprint"
          />

          {stepIsValid && (
            <>
              <p>
                Blueprint with a name of XXXXX, totally YYY entities.Assuming
                category of ABC, game state of DEF with ZZ% confidence.
              </p>

              <p>You’ll get to adjust everything on the next screen.</p>
            </>
          )}

          <SC.ButtonsStack gutter={24} orientation="horizontal">
            <Button
              variant="success"
              type="button"
              disabled={!stepIsValid}
              onClick={preFillForm}
            >
              Continue
            </Button>
            {!stepIsValid && (
              <SC.SkipButton onClick={props.goToNextStep}>
                or skip
              </SC.SkipButton>
            )}
          </SC.ButtonsStack>
        </Stacker>
      </SC.Content>
    </SC.Row>
  )
}

export default Step1
