import * as Yup from "yup"

const FILE_SIZE = 10 * 1000 * 1024 // 10MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"] as const

export const validation = {
  isBook: Yup.boolean(),
  hash: Yup.string(),
  title: Yup.string().min(2, "Too Short!").max(128, "Too Long!").required("Required"),
  slug: Yup.string()
    .min(3, "Too Short!")
    .max(100, "Too Long!")
    .required("A slug is required")
    .matches(/[a-zA-Z0-9_-]+/, "A slug can only contain alphanumerical characters, plus _ and -")
    .not(
      ["account", "admin", "administrator", "delete", "edit", "import", "raw"],
      "A slug cannot use a reserved keyword"
    ),
  description: Yup.string(),
  tags: Yup.array(Yup.string()).test({
    name: "tags-required",
    message: "At least one tag must be selected",
    test: function (value) {
      return Array.isArray(value) && value.length !== 0
    },
  }),
  cover: Yup.object()
    .required()
    .shape({
      crop: Yup.object().nullable().shape({
        x: Yup.number().nullable(),
        y: Yup.number().nullable(),
        width: Yup.number().nullable(),
        height: Yup.number().nullable(),
      }),
      file: Yup.mixed()
        .nullable()
        .test({
          name: "file",
          message: "cover.file is required",
          test: function (value) {
            if (value) return true
            // optional in edit
            // @ts-ignore
            if (this.options.from[1].value.__operation === "EDIT") return true
            // optional if it's a single blueprint
            // @ts-ignore
            if (!this.options.from[1].value.isBook) return true
            // otherwise, is required if no hash is provided
            if (!this.parent.hash) return false
            return true
          },
        })
        .test("fileSize", "File too large", function (value) {
          if (value && value.size >= FILE_SIZE) return false
          return true
        })
        .test("fileFormat", "Unsupported Format", function (value) {
          if (value && !SUPPORTED_FORMATS.includes(value.type)) return false
          return true
        }),
      hash: Yup.mixed()
        .nullable()
        .test({
          name: "hash",
          message: "cover.hash is required",
          test: function (value) {
            if (value) return true
            // optional in edit
            // @ts-ignore
            if (this.options.from[1].value.__operation === "EDIT") return true
            // optional if it's a single blueprint
            // @ts-ignore
            if (!this.options.from[1].value.isBook) return true
            // is required if no file is provided
            if (!this.parent.file) return false
            return true
          },
        }),
    }),
  version: Yup.mixed().nullable(),
}

export const validationSchema = Yup.object(validation)
