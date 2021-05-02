import React, { useMemo, useState } from "react"
import { FormikProps } from "formik"
import { useApi } from "../../../hooks/useApi"
import {
  IDecodedBlueprintBookData,
  IDecodedBlueprintData,
} from "../../../types"
import { ICreatePayloadResult, IFullPayload } from "../../../types/models"
import {
  decodeBlueprint,
  isBlueprintItem,
  isBook,
  isValidBlueprint,
} from "../../../utils/blueprint"
import { tagsFromHeuristics } from "../../../utils/blueprint-heuristics"
import Input from "../../form/Input"
import InputWrapper from "../../form/InputWrapper"
import Button from "../../ui/Button"
import Stacker from "../../ui/Stacker"
import WithIcons from "../../ui/WithIcons"
import { IFormValues } from "./build-form-page.d"
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
  tags: string[]
}

interface IStepStateValidBook {
  isValid: true
  isBook: true
  data: IBlueprintData
  tags: string[]
  json: IDecodedBlueprintBookData
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
  goToNextStep: (payload: IFullPayload) => void
}

const Step1: React.FC<IStep1Props> = (props) => {
  const [encoded, setEncoded] = useState("")
  const [{ error }, execute] = useApi<ICreatePayloadResult>({
    url: "/payloads",
    method: "PUT",
  })

  const stepState: TStepState = useMemo(() => {
    const isValid = isValidBlueprint(encoded)

    if (!isValid) {
      return {
        isValid: false,
      }
    }

    const json = decodeBlueprint(encoded)

    if (isBook(json)) {
      return {
        isValid: true,
        isBook: true,
        json,
        data: getBlueprintData(json),
        tags: tagsFromHeuristics(json.blueprint_book),
      }
    } else {
      return {
        isValid: true,
        isBook: false,
        json,
        data: getBlueprintData(json),
        tags: tagsFromHeuristics(json.blueprint),
      }
    }
  }, [encoded])

  async function preFillForm(): Promise<void> {
    if (!stepState.isValid) {
      return
    }

    const res = await execute({
      data: JSON.stringify({ encoded }),
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

    props.formikProps.setFieldValue("isBook", stepState.isBook)
    props.formikProps.setFieldValue("title", bp.label)
    // TODO: set validity/availability of slug
    props.formikProps.setFieldValue("slug", res.data.extracted_slug.slug)
    props.formikProps.setFieldValue("description", bp.description || "")
    props.formikProps.setFieldValue("hash", res.data.payload.hash)
    props.formikProps.setFieldValue("tags", stepState.tags)
    props.formikProps.setFieldValue("version.icons", res.data.payload.icons)

    if (!stepState.isBook) {
      props.formikProps.setFieldValue("cover.type", "hash")
      props.formikProps.setFieldValue("cover.hash", res.data.payload.hash)
    }

    props.goToNextStep(res.data.payload)
  }

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setEncoded(e.target.value)
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
          if (!isBlueprintItem(curr)) {
            return acc
          }
          if (!curr.blueprint.entities) {
            return acc
          }
          return acc + curr.blueprint.entities.length
        }, 0),
      }
    } else {
      const bp = json.blueprint
      return {
        label: bp.label,
        isBook: false,
        blueprintCount: 1,
        entityCount: bp.entities?.length || 0,
      }
    }
  }

  return (
    <SC.Content>
      <Stacker>
        <p>
          Get started with a blueprint string, we will parse your blueprint to
          extract the relevant metadata as best as we can!
        </p>

        <InputWrapper uid="encoded">
          <Input.Textarea
            id="encoded"
            value={encoded}
            rows={5}
            spellCheck={false}
            onChange={handleOnChange}
            onKeyPress={handleOnKeyPress}
          ></Input.Textarea>
        </InputWrapper>

        {stepState.isValid && (
          <>
            {/* prettier-ignore */}
            <p>
              {stepState.data.label && <>Blueprint with a name of <b><WithIcons input={stepState.data.label} /></b>, </>}
              {!stepState.data.label && <>Unnamed blueprint, </>}
              totalling <b>{stepState.data.entityCount}</b> entities.<br />
              {stepState.data.isBook && <>Found a <b>blueprint book</b>, with <b>{stepState.data.blueprintCount}</b> blueprints.</>}
              {!stepState.data.isBook && <>Found a <b>single blueprint</b>.</>}
              {/*Assuming category of ABC, game state of DEF with ZZ% confidence.*/}
            </p>

            <p>You’ll get to adjust everything on the next screen.</p>
          </>
        )}

        {error?.response?.status === 401 && (
          <SC.FormError>Failed: unauthentified, please log in.</SC.FormError>
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
        </SC.ButtonsStack>
      </Stacker>
    </SC.Content>
  )
}

export default Step1
