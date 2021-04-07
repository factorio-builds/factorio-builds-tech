import asFormData from "json-form-data"
import {
  ICreateBuildRequest,
  ICreateVersionRequest,
  IEditBuildRequest,
  IFullBuild,
} from "../../../types/models"
import { IFormValues, IValidFormValues } from "./build-form-page.d"

const baseInitialValues: IFormValues = {
  __operation: "CREATE",
  isBook: undefined,
  hash: "",
  title: "",
  slug: "",
  description: "",
  tags: [],
  cover: {
    type: "file",
    file: null,
    url: null,
    hash: null,
    crop: null,
  },
}

export const createInitialValues = (build?: IFullBuild): IFormValues => {
  if (!build) {
    return baseInitialValues
  }

  return {
    __operation: "EDIT",
    isBook: build.latest_version.type === "blueprint-book",
    hash: build.latest_version.hash,
    title: build.title,
    slug: build.slug,
    description: build.description || "",
    tags: build.tags,
    cover: {
      type: build.latest_version.type === "blueprint" ? "hash" : "file",
      crop: null,
      file: null,
      url: build._links.cover?.href || null,
      hash:
        build.latest_version.type === "blueprint"
          ? build.latest_version.hash
          : null,
    },
  }
}

const toFormDataInner = (
  request: ICreateBuildRequest | ICreateVersionRequest | IEditBuildRequest
): FormData => {
  // todo: not sure about the `ValidJSON` type. seems wrong to me...
  // `any` cast fixes the type error
  const formData = asFormData(request as any)

  // todo: not sure why the backend doesn't pick up the [file]
  // it works with all other fields. maybe a dotnet bug?
  if (formData.get("cover[file]")) {
    formData.append("cover.file", formData.get("cover[file]") as any)
    formData.delete("cover[file]")
  }

  // this is necessary for the version field to not get stripped with an empty array
  if (
    !formData.get("version[icons][0][type]") ||
    !formData.get("version[icons][0][name]")
  ) {
    formData.append("version[icons]", JSON.stringify([]))
  }

  return formData
}

export const toFormData = (formValues: IValidFormValues): FormData => {
  const request: ICreateBuildRequest = {
    slug: formValues.slug,
    hash: formValues.hash,
    title: formValues.title,
    description: formValues.description,
    tags: formValues.tags,
    cover: {
      file: formValues.cover.file,
      hash: formValues.cover.hash,
      crop: formValues.cover.crop,
    },
    version: {
      icons: formValues.version?.icons || [],
    },
  }

  return toFormDataInner(request)
}

export const toPatchFormData = (formValues: IValidFormValues): FormData => {
  const request: IEditBuildRequest = {
    title: formValues.title,
    description: formValues.description,
    tags: formValues.tags,
    cover: {
      file: formValues.cover.file,
      hash: formValues.cover.hash,
      crop: formValues.cover.crop,
    },
  }

  return toFormDataInner(request)
}
