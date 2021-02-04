import React from "react"
import { Field, FormikProps } from "formik"
import tags from "../../../tags.json"
import Input from "../../form/FormikInputWrapper"
import InputGroup from "../../form/InputGroup"
import Stacker from "../../ui/Stacker"
import { IFormValues, validate } from "./build-form-page.component"

interface IStep2DataProps {
  formikProps: FormikProps<IFormValues>
}

const Step2Data: React.FC<IStep2DataProps> = () => {
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
        {Object.keys(tags).map((tagCategory) => {
          const tagGroup = tags[tagCategory as keyof typeof tags]

          return (
            <InputGroup key={tagCategory} legend={tagCategory}>
              <Stacker gutter={4}>
                {tagGroup.map((tag) => {
                  return (
                    <Field
                      key={tag}
                      name="tags"
                      label={tag}
                      type="checkbox"
                      value={`/${tagCategory}/${tag}`}
                      component={Input}
                    />
                  )
                })}
              </Stacker>
            </InputGroup>
          )
        })}
      </Stacker>
    </>
  )
}

export default Step2Data
