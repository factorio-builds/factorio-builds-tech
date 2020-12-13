import { ECategory, EState, IMetadata } from "../../../types"
import { decodeBlueprint, isBook } from "../../../utils/blueprint"
import { Build } from "../../entities/build.entity"

const generateIcons = (bpJSON: Build["json"]): IMetadata["icons"] => {
  const icons = isBook(bpJSON)
    ? bpJSON.blueprint_book.icons
    : bpJSON.blueprint.icons

  return icons || []
}

const bp1string =
  "0eNqlmt1uo0AMhV8lmmuoZjx/hMu+xqpapS2qkFKCgKxaRbz7kr9ulQzFPnsVJRGfJx6fg8fkoJ63+6rt6mZQ5UHVL7umV+Wvg+rrt2azPX42fLaVKlU9VO8qU83m/fiu+mi7qu/zvt3Ww1B1asxU3bxWH6o0Y8a+fOg2Td/uuiF/rrbDNwiNT5mqmqEe6uq8oNObz9/N/v15CleaJVam2l0/Xb5rjqv4OF3xqco8TkFe6656OX/ljqu9YZOYTUl2SLDtfArvqPZMDQ9+mesEXHdZLYfrxbnIL3gGPMjhxIZHQUbyS6odJyWFfNWGveq1GK7ZbKPRwvbLojEGhQcG/F6S+8kourduN73+LPhbfPZlSU27P3rOfTQrF5PnVI5xsJosg45r1THoQaKny9ZaVlYQpRKLXKBqcmMKB4vTpnCkgaK+Wsntjn1V9W4/zJQ1mf+IZ4F48H2UUY5kcUeYzd2sI5ADotFC5uajeXmTwNIDBbmxsSRMEbYeYtALuE/g0Ncw3Szfuaz8nnu1uBs6pegGdSRKOZIluLVhJNpKbqu5fvDXNKRYkn7X/EMt75dHTYsY8ICbFs21MfMGbKNc7oYjd1ugcjcMOKxHBtxpFK6Xt9cZeSPDyrdD2t9LgOO6FyvFIXdTLeA71Fh0Sv3Oo7ikmbgA/3ojb4tcBEcXDPdyBcjmVPca7oG0+AjmNRzMiPstb8T9Fku2nsT+q1lci9ov4xTp4TMqowXwXu6QrAbUA6dTVsvsI+wNdmSUHjxM4mzlGj/wkdzYAjpessvmE9B5r11uogOBbEbHFyzsYyT2sSAfArM0EODBEuMgHwLe23iGwgIi4ItDAEOWAAvap1qTgI6ckrSokRNYchYW0XEvoyQiwaLx8lNSxCdJ8kFSdHAwLy/G6IFo9udo8z9NPlxiPW6JEZ2ghGThFrgfBGAL1qgfJFdfaBQXkzh0fsR40lmgt1UO24Luw2E7kB0YbA/LP4gFWcgfr1p2kuSjpcRj7Kfs/L+A8tu/EDK13UyLmz4zYZWvitXjtNLV42a7aV5O8D9V15+vLyJRYdY60jj+BcYaEMs="
const bp1decoded = decodeBlueprint(bp1string)

const bp2string =
  "0eNrllkFvgyAYhv9Kw1kXsK22HnfuaddlabD91pEpGMCmTeN/H2gbzUqnctmSnQwf8vDy+vHGC8ryCkrJuN5mQnyi9NJVFEpfe0M7x3aCt2XFDpzmtqbPJaAUMQ0FChCnhR3BqZSgVKgl5aoUUocZ5BrVAWJ8DyeUkjoYDVFlzrQG2Vse1W8BAq6ZZtAKagbnLa+KzLyZkiEpASqFMssFt/sbZGiWnM0jMrvsmYRdOxdZod/g0WQ4vrEdtPkdrTKHlAcpzPNnsdhovVonKl1W1uE7/uKxofdc/LRspRKX1KWHVDxeaTzZ186G3ieLHejE32TSSWf8gfLVBI9vFjubYe3ZWmTYAoI97TWtYG5bczfTXh4EKKdmmamR2YZymD3TnPIdyHAD73b6CFI1rGSOyTqOyDyJuyuMrcR/ky7ucIl/IVxG5iAejsGFR9P/kVwZxk8I2MTXY6cXK5+4HpklY489JvI84sQZVdHEcHlhh4/hdCEuatj84/TRuUVnV7QyU9SoOsL2llEPtqm/ACpbH24="
const bp2decoded = decodeBlueprint(bp2string)

const bp3string =
  "0eNrllkFvgyAYhv9Kw1kXsK22HnfuaddlabD91pEpGMCmTeN/H2gbzUqnctmSnQwf8vDy+vHGC8ryCkrJuN5mQnyi9NJVFEpfe0M7x3aCt2XFDpzmtqbPJaAUMQ0FChCnhR3BqZSgVKgl5aoUUocZ5BrVAWJ8DyeUkjoYDVFlzrQG2Vse1W8BAq6ZZtAKagbnLa+KzLyZkiEpASqFMssFt/sbZGiWnM0jMrvsmYRdOxdZod/g0WQ4vrEdtPkdrTKHlAcpzPNnsdhovVonKl1W1uE7/uKxofdc/LRspRKX1KWHVDxeaTzZ186G3ieLHejE32TSSWf8gfLVBI9vFjubYe3ZWmTYAoI97TWtYG5bczfTXh4EKKdmmamR2YZymD3TnPIdyHAD73b6CFI1rGSOyTqOyDyJuyuMrcR/ky7ucIl/IVxG5iAejsGFR9P/kVwZxk8I2MTXY6cXK5+4HpklY489JvI84sQZVdHEcHlhh4/hdCEuatj84/TRuUVnV7QyU9SoOsL2llEPtqm/ACpbH24="
const bp3decoded = decodeBlueprint(bp3string)

export const builds: Omit<Build, "owner">[] = [
  {
    id: "a197ee1c-9b02-4824-bd5f-3725073fc772",
    name: "Single Lane Balancer",
    description: "",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    blueprint: bp2string,
    json: bp2decoded,
    metadata: {
      categories: [ECategory.BALANCER],
      state: EState.LATE_GAME,
      tileable: false,
      withMarkedInputs: false,
      withBeacons: false,
      area: 43,
      isBook: true,
      icons: generateIcons(bp2decoded),
    },
    image: {
      src:
        "https://factorio-builds-static-assets-dev-781466525417.s3.amazonaws.com/a197ee1c-9b02-4824-bd5f-3725073fc772",
      width: 2540,
      height: 1430,
    },
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "a84e9b6c-c920-4567-9ba0-2a018d734da7",
    name: "16 - 8 Belt Balancer",
    description: "",
    ownerId: "8358cfb0-2675-4651-a9c2-0d7cf57d6110",
    blueprint: bp1string,
    json: bp1decoded,
    metadata: {
      categories: [ECategory.BALANCER],
      state: EState.LATE_GAME,
      tileable: true,
      withMarkedInputs: false,
      withBeacons: false,
      area: 265,
      isBook: false,
      icons: generateIcons(bp1decoded),
    },
    image: {
      src:
        "https://factorio-builds-static-assets-dev-781466525417.s3.amazonaws.com/a84e9b6c-c920-4567-9ba0-2a018d734da7",
      width: 640,
      height: 640,
    },
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c5f4aad0-8237-4a88-8280-d9d33875d25a",
    name: "Easy-tile Solar Array",
    description:
      "A tiling-ready solar array built to near-perfect ratios.\n\n#### Features\n\n- 18:15 solar/accumulator ratio (1.2 accumulators short of perfect)\n- 2 tiles of space between for logistical convenience (walking paths, rail paths, or belt lines)\n- networked roboport for easy solar field expansion\n\n#### Stats\n- 180 solar panels producing 10.8MW\n- 150 accumulators storing 750 MJ\n- 16 substations providing electrical distribution\n- 48x48 tile footprint\n\nPlace down solar arrays using the logistics network area as an alignment guide. Adjacent arrays will connect to one another via substations, even across a 2-tile gap that should be present. Arrays can be packed closer together if so desired. To attain perfect ratios, 6 additional accumulators must be constructed per 5 solar arrays. These can be tacked into the 2-tile gap between arrays if certain areas are not needed as paths, belt lanes, or train tracks, or in a separate area of the factory.",
    ownerId: "8358cfb0-2675-4651-a9c2-0d7cf57d6110",
    blueprint: bp3string,
    json: bp3decoded,
    metadata: {
      categories: [ECategory.ENERGY],
      state: EState.MID_GAME,
      tileable: true,
      withMarkedInputs: false,
      withBeacons: false,
      area: 265,
      isBook: false,
      icons: generateIcons(bp3decoded),
    },
    image: {
      src:
        "https://factorio-builds-static-assets-dev-781466525417.s3.amazonaws.com/c5f4aad0-8237-4a88-8280-d9d33875d25a",
      width: 640,
      height: 635,
    },
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
