import React, { useCallback, useMemo, useState } from "react"
import { Field, FormikProps } from "formik"
import startCase from "lodash/startCase"
import Caret from "../../../icons/caret"
import { useAppSelector } from "../../../redux/store"
import tags from "../../../tags.json"
import ErrorMessage from "../../form/ErrorMessage"
import Input from "../../form/FormikInputWrapper"
import InputGroup from "../../form/InputGroup"
import RichText from "../../ui/RichText"
import useParseRichText from "../../ui/RichText/useParseRichText.hook"
import Stacker from "../../ui/Stacker"
import { IFormValues } from "./build-form-page.d"
import * as S from "./build-form-page.styles"

interface ICollapsableGroupProps {
  group: string
  groupTags: string[]
  selectedTags: (tags: string[]) => string[]
}

interface IStep2DataProps {
  formikProps: FormikProps<IFormValues>
  type: "CREATE" | "EDIT"
}

const CollapsableGroup = (props: ICollapsableGroupProps): JSX.Element => {
  const groupsToTags = useMemo(
    () => props.groupTags.map((tag) => `/${props.group}/${tag}`),
    [props.groupTags]
  )
  const selectedTags = props.selectedTags(groupsToTags)

  const [collapsed, setCollapsed] = useState(true)

  const expand = useCallback(() => {
    setCollapsed((prevCollapsed) => !prevCollapsed)
  }, [collapsed])

  return (
    <S.CollapsableGroupWrapper>
      <InputGroup
        key={props.group}
        legend={
          <S.GroupTitle type="button" onClick={expand}>
            <Caret inverted={collapsed} />
            {startCase(props.group)}
            {selectedTags.length > 0 && (
              <S.GroupCount>{selectedTags.length}</S.GroupCount>
            )}
          </S.GroupTitle>
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
    </S.CollapsableGroupWrapper>
  )
}

const Step2Data: React.FC<IStep2DataProps> = (props) => {
  const user = useAppSelector((state) => state.auth.user)

  const parsedRichText = useParseRichText(props.formikProps.values.title)
  const titleHasRichText = parsedRichText.some((part) => part.type !== "text")

  const selectedTags = useCallback(
    (tags: string[]) => {
      return props.formikProps.values.tags.filter((tag) => tags.includes(tag))
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

      {titleHasRichText && (
        <S.InputHint>
          <RichText input={props.formikProps.values.title}></RichText>
        </S.InputHint>
      )}

      <Field
        name="slug"
        label="Slug"
        type="text"
        required
        component={Input}
        readOnly={props.type === "EDIT"}
        prefix={<>{user?.username} /</>}
      />

      <S.InputHint>
        {props.type === "CREATE"
          ? "Be mindful of your slug, as it cannot be edited at the moment."
          : "The slug cannot be edited at the moment."}
      </S.InputHint>

      <Field
        name="description"
        label="Description"
        type="markdown"
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
                selectedTags={selectedTags}
              />
            )
          })}

          {props.formikProps.touched.tags && props.formikProps.errors.tags && (
            <ErrorMessage>{props.formikProps.errors.tags}</ErrorMessage>
          )}
        </Stacker>
      </InputGroup>
    </>
  )
}

export default Step2Data
