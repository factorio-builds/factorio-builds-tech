import React, { useMemo } from "react"
import { Field, FormikProps } from "formik"
import { useApi } from "../../../hooks/useApi"
import {
  IDecodedBlueprintBookData,
  IDecodedBlueprintData,
} from "../../../types"
import {
  decodeBlueprint,
  isBook,
  isValidBlueprint,
} from "../../../utils/blueprint"
import { blueprintHeuristics } from "../../../utils/blueprint-heuristics"
import Input from "../../form/FormikInputWrapper"
import Button from "../../ui/Button"
import Stacker from "../../ui/Stacker"
import { IFormValues, validate } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

interface IBlueprintData {
  label: string
  isBook: boolean
  blueprintCount: number
  entityCount: number
}

interface IStepStateValidSingle {
  isValid: true
  isBook: false
  data: IBlueprintData
  json: IDecodedBlueprintData
  heuristics: ReturnType<typeof blueprintHeuristics>
}

interface IStepStateValidBook {
  isValid: true
  isBook: true
  data: IBlueprintData
  json: IDecodedBlueprintBookData
  heuristics: Array<ReturnType<typeof blueprintHeuristics>>
}

interface IStepStateInvalid {
  isValid: false
}

type TStepState =
  | IStepStateValidSingle
  | IStepStateValidBook
  | IStepStateInvalid

interface IStep1Props {
  formikProps: FormikProps<IFormValues>
  goToNextStep: () => void
}

const Step1: React.FC<IStep1Props> = (props) => {
  const { /*data, loading, error,*/ execute } = useApi({
    url: "/payloads",
    method: "PUT",
  })

  const stepState: TStepState = useMemo(() => {
    const bpString = props.formikProps.values.encoded
    const isValid = isValidBlueprint(bpString)

    if (!isValid) {
      return {
        isValid: false,
      }
    }

    const json = decodeBlueprint(bpString)

    if (isBook(json)) {
      return {
        isValid: true,
        isBook: true,
        json,
        data: getBlueprintData(json),
        heuristics: json.blueprint_book.blueprints.map((bp) =>
          blueprintHeuristics(bp.blueprint)
        ),
      }
    } else {
      return {
        isValid: true,
        isBook: false,
        json,
        data: getBlueprintData(json),
        heuristics: blueprintHeuristics(json.blueprint),
      }
    }
  }, [props.formikProps.values.encoded])

  async function preFillForm(): Promise<void> {
    if (!stepState.isValid) {
      return
    }

    const res = await execute({
      data: JSON.stringify({ encoded: props.formikProps.values.encoded }),
    }).catch((err) => {
      // TODO: handle error
      console.error(err)
    })

    if (!res) {
      return
    }

    const bp = stepState.isBook
      ? stepState.json.blueprint_book
      : stepState.json.blueprint

    props.formikProps.setFieldValue("title", bp.label)
    props.formikProps.setFieldValue("description", bp.description || "")
    props.formikProps.setFieldValue("hash", res.data.hash)

    // TODO: extract
    // TODO: guess metadata from blueprint content
    // if (!stepState.isBook) {
    //   const bp = stepState.json.blueprint
    //   const { withMarkedInputs, withBeacons } = blueprintHeuristics(bp)
    //   props.formikProps.setFieldValue(
    //     "withMarkedInputs",
    //     withMarkedInputs.value
    //   )
    //   props.formikProps.setFieldValue("withBeacons", withBeacons.value)
    // } else {
    //   const blueprints = stepState.json.blueprint_book.blueprints
    //   props.formikProps.setFieldValue(
    //     "withMarkedInputs",
    //     blueprints.some(({ blueprint }) => {
    //       return blueprintHeuristics(blueprint).withMarkedInputs.value
    //     })
    //   )
    //   props.formikProps.setFieldValue(
    //     "withBeacons",
    //     blueprints.some(({ blueprint }) => {
    //       return blueprintHeuristics(blueprint).withBeacons.value
    //     })
    //   )
    // }

    props.goToNextStep()
  }

  function handleOnKeyPress(e: React.KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && stepState.isValid) {
      preFillForm()
    }
  }

  function getBlueprintData(
    json: IDecodedBlueprintData | IDecodedBlueprintBookData
  ): IBlueprintData {
    if (isBook(json)) {
      const book = json.blueprint_book
      return {
        label: book.label,
        isBook: true,
        blueprintCount: book.blueprints.length,
        entityCount: book.blueprints.reduce((acc, curr) => {
          return acc + curr.blueprint.entities.length
        }, 0),
      }
    } else {
      const bp = json.blueprint
      return {
        label: bp.label,
        isBook: false,
        blueprintCount: 1,
        entityCount: bp.entities.length,
      }
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
            name="encoded"
            label="Blueprint string"
            type="textarea"
            rows="5"
            required
            spellCheck={false}
            component={Input}
            validate={validate("encoded")}
            onChange={props.formikProps.handleChange}
            onKeyPress={handleOnKeyPress}
            validFeedback="Found a valid blueprint"
          />

          {stepState.isValid && (
            <>
              {/* prettier-ignore */}
              <p>
                Blueprint with a name of <b>{stepState.data.label}</b>, totalling <b>{stepState.data.entityCount}</b> entities.<br />
                {stepState.data.isBook && <>Found a <b>blueprint book</b>, with <b>{stepState.data.blueprintCount}</b> blueprints.</>}
                {!stepState.data.isBook && <>Found a <b>single blueprint</b>.</>}
                {/*Assuming category of ABC, game state of DEF with ZZ% confidence.*/}
              </p>

              <p>You’ll get to adjust everything on the next screen.</p>
            </>
          )}

          <SC.ButtonsStack gutter={24} orientation="horizontal">
            <Button
              variant="success"
              type="button"
              disabled={!stepState.isValid}
              onClick={preFillForm}
            >
              Continue
            </Button>
            {!stepState.isValid && (
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
