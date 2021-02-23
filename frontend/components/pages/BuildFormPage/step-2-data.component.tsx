import React, { useCallback, useMemo, useState } from "react"
import { Field, FormikProps } from "formik"
import startCase from "lodash/startCase"
import Caret from "../../../icons/caret"
import tags from "../../../tags.json"
import Input from "../../form/FormikInputWrapper"
import InputGroup from "../../form/InputGroup"
import Stacker from "../../ui/Stacker"
import { IFormValues } from "./build-form-page.component"
import * as SC from "./build-form-page.styles"

interface ICollapsableGroupProps {
  group: string
  groupTags: string[]
  isCollapsable: (tags: string[]) => boolean
}

interface IStep2DataProps {
  formikProps: FormikProps<IFormValues>
}

const CollapsableGroup = (props: ICollapsableGroupProps): JSX.Element => {
  const groupsToTags = useMemo(
    () => props.groupTags.map((tag) => `/${props.group}/${tag}`),
    [props.groupTags]
  )
  const isCollapsable = props.isCollapsable(groupsToTags)

  const [collapsed, setCollapsed] = useState(true)

  const expand = useCallback(() => {
    if (isCollapsable) {
      setCollapsed((prevCollapsed) => !prevCollapsed)
    }
  }, [collapsed, isCollapsable])

  return (
    <InputGroup
      key={props.group}
      legend={
        <SC.GroupTitle onClick={expand}>
          <Caret inverted={collapsed} />
          {startCase(props.group)}
        </SC.GroupTitle>
      }
    >
      {!collapsed && (
        <Stacker gutter={4}>
          {props.groupTags.map((tag) => {
            return (
              <Field
                key={tag}
                name="tags"
                label={tag}
                type="checkbox"
                value={`/${props.group}/${tag}`}
                component={Input}
              />
            )
          })}
        </Stacker>
      )}
    </InputGroup>
  )
}

const Step2Data: React.FC<IStep2DataProps> = (props) => {
  const isCollapsable = useCallback(
    (tags: string[]) => {
      return !tags.some((tag) => props.formikProps.values.tags.includes(tag))
    },
    [props.formikProps.values.tags]
  )

  return (
    <>
      <Field
        name="title"
        label="Title"
        type="text"
        required
        component={Input}
      />

      <Field name="slug" label="Slug" type="text" required component={Input} />

      <Field
        name="description"
        label="Description"
        type="textarea"
        rows="5"
        component={Input}
      />

      <InputGroup
        legend={
          <>
            Tags <span>(minimum one required)</span>
          </>
        }
      >
        <Stacker gutter={8}>
          {Object.keys(tags).map((tagCategory) => {
            const tagGroup = tags[tagCategory as keyof typeof tags]

            return (
              <CollapsableGroup
                key={tagCategory}
                group={tagCategory}
                groupTags={tagGroup}
                isCollapsable={isCollapsable}
              />
            )
          })}
        </Stacker>
      </InputGroup>
    </>
  )
}

export default Step2Data
