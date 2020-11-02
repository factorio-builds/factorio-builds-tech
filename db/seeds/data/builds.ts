import { ECategory, EState, IBuild } from "../../../types"

export const builds: IBuild[] = [
  {
    id: "a197ee1c-9b02-4824-bd5f-3725073fc772",
    name: "Single Lane Balancer",
    description: "",
    // @ts-ignore
    owner_id: "c8b15803-1b90-4194-9896-a2869e67deb2",
    blueprint:
      "0eNrllkFvgyAYhv9Kw1kXsK22HnfuaddlabD91pEpGMCmTeN/H2gbzUqnctmSnQwf8vDy+vHGC8ryCkrJuN5mQnyi9NJVFEpfe0M7x3aCt2XFDpzmtqbPJaAUMQ0FChCnhR3BqZSgVKgl5aoUUocZ5BrVAWJ8DyeUkjoYDVFlzrQG2Vse1W8BAq6ZZtAKagbnLa+KzLyZkiEpASqFMssFt/sbZGiWnM0jMrvsmYRdOxdZod/g0WQ4vrEdtPkdrTKHlAcpzPNnsdhovVonKl1W1uE7/uKxofdc/LRspRKX1KWHVDxeaTzZ186G3ieLHejE32TSSWf8gfLVBI9vFjubYe3ZWmTYAoI97TWtYG5bczfTXh4EKKdmmamR2YZymD3TnPIdyHAD73b6CFI1rGSOyTqOyDyJuyuMrcR/ky7ucIl/IVxG5iAejsGFR9P/kVwZxk8I2MTXY6cXK5+4HpklY489JvI84sQZVdHEcHlhh4/hdCEuatj84/TRuUVnV7QyU9SoOsL2llEPtqm/ACpbH24=",
    json: JSON.stringify(require("./bp2.json")),
    metadata: {
      categories: [ECategory.BALANCER],
      state: EState.LATE_GAME,
      tileable: false,
      area: 43,
    },
    image: {
      src:
        "https://factorio-builds-static-assets-dev-781466525417.s3.amazonaws.com/a197ee1c-9b02-4824-bd5f-3725073fc772",
      width: 2540,
      height: 1430,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "a84e9b6c-c920-4567-9ba0-2a018d734da7",
    name: "16 - 8 Belt Balancer",
    description: "",
    // @ts-ignore
    owner_id: "8358cfb0-2675-4651-a9c2-0d7cf57d6110",
    blueprint:
      "0eNqlmt1uo0AMhV8lmmuoZjx/hMu+xqpapS2qkFKCgKxaRbz7kr9ulQzFPnsVJRGfJx6fg8fkoJ63+6rt6mZQ5UHVL7umV+Wvg+rrt2azPX42fLaVKlU9VO8qU83m/fiu+mi7qu/zvt3Ww1B1asxU3bxWH6o0Y8a+fOg2Td/uuiF/rrbDNwiNT5mqmqEe6uq8oNObz9/N/v15CleaJVam2l0/Xb5rjqv4OF3xqco8TkFe6656OX/ljqu9YZOYTUl2SLDtfArvqPZMDQ9+mesEXHdZLYfrxbnIL3gGPMjhxIZHQUbyS6odJyWFfNWGveq1GK7ZbKPRwvbLojEGhQcG/F6S+8kourduN73+LPhbfPZlSU27P3rOfTQrF5PnVI5xsJosg45r1THoQaKny9ZaVlYQpRKLXKBqcmMKB4vTpnCkgaK+Wsntjn1V9W4/zJQ1mf+IZ4F48H2UUY5kcUeYzd2sI5ADotFC5uajeXmTwNIDBbmxsSRMEbYeYtALuE/g0Ncw3Szfuaz8nnu1uBs6pegGdSRKOZIluLVhJNpKbqu5fvDXNKRYkn7X/EMt75dHTYsY8ICbFs21MfMGbKNc7oYjd1ugcjcMOKxHBtxpFK6Xt9cZeSPDyrdD2t9LgOO6FyvFIXdTLeA71Fh0Sv3Oo7ikmbgA/3ojb4tcBEcXDPdyBcjmVPca7oG0+AjmNRzMiPstb8T9Fku2nsT+q1lci9ov4xTp4TMqowXwXu6QrAbUA6dTVsvsI+wNdmSUHjxM4mzlGj/wkdzYAjpessvmE9B5r11uogOBbEbHFyzsYyT2sSAfArM0EODBEuMgHwLe23iGwgIi4ItDAEOWAAvap1qTgI6ckrSokRNYchYW0XEvoyQiwaLx8lNSxCdJ8kFSdHAwLy/G6IFo9udo8z9NPlxiPW6JEZ2ghGThFrgfBGAL1qgfJFdfaBQXkzh0fsR40lmgt1UO24Luw2E7kB0YbA/LP4gFWcgfr1p2kuSjpcRj7Kfs/L+A8tu/EDK13UyLmz4zYZWvitXjtNLV42a7aV5O8D9V15+vLyJRYdY60jj+BcYaEMs=",
    json: JSON.stringify(require("./bp1.json")),
    metadata: {
      categories: [ECategory.BALANCER],
      state: EState.LATE_GAME,
      tileable: true,
      area: 265,
    },
    image: {
      src:
        "https://factorio-builds-static-assets-dev-781466525417.s3.amazonaws.com/a84e9b6c-c920-4567-9ba0-2a018d734da7",
      width: 640,
      height: 640,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "c5f4aad0-8237-4a88-8280-d9d33875d25a",
    name: "Easy-tile Solar Array",
    description:
      "A tiling-ready solar array built to near-perfect ratios.\n\n#### Features\n\n- 18:15 solar/accumulator ratio (1.2 accumulators short of perfect)\n- 2 tiles of space between for logistical convenience (walking paths, rail paths, or belt lines)\n- networked roboport for easy solar field expansion\n\n#### Stats\n- 180 solar panels producing 10.8MW\n- 150 accumulators storing 750 MJ\n- 16 substations providing electrical distribution\n- 48x48 tile footprint\n\nPlace down solar arrays using the logistics network area as an alignment guide. Adjacent arrays will connect to one another via substations, even across a 2-tile gap that should be present. Arrays can be packed closer together if so desired. To attain perfect ratios, 6 additional accumulators must be constructed per 5 solar arrays. These can be tacked into the 2-tile gap between arrays if certain areas are not needed as paths, belt lanes, or train tracks, or in a separate area of the factory.",
    // @ts-ignore
    owner_id: "8358cfb0-2675-4651-a9c2-0d7cf57d6110",
    blueprint:
      "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",
    json: JSON.stringify(require("./bp3.json")),
    metadata: {
      categories: [ECategory.ENERGY],
      state: EState.MID_GAME,
      tileable: true,
      area: 265,
    },
    image: {
      src:
        "https://factorio-builds-static-assets-dev-781466525417.s3.amazonaws.com/c5f4aad0-8237-4a88-8280-d9d33875d25a",
      width: 640,
      height: 635,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
