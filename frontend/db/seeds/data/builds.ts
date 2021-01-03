import imageSize from "probe-image-size"
import { ECategory, EState, IMetadata } from "../../../types"
import { decodeBlueprint, isBook } from "../../../utils/blueprint"
import { Build } from "../../entities/build.entity"
import blueprints from "./blueprints"

type Overwrite<T1, T2> = Pick<T1, Exclude<keyof T1, keyof T2>> & T2
type BuildWithoutOwner = Omit<Build, "owner">

const generateIcons = (bpJSON: Build["json"]): IMetadata["icons"] => {
  const icons = isBook(bpJSON)
    ? bpJSON.blueprint_book.icons
    : bpJSON.blueprint.icons

  return icons || []
}

interface IPartialBuild {
  id: keyof typeof blueprints
  name: Build["name"]
  description: Build["description"]
  ownerId: Build["ownerId"]
  metadata: Overwrite<
    Omit<Build["metadata"], "icons" | "isBook">,
    { area?: Build["metadata"]["area"] }
  >
}

const generateBuild = async (
  build: IPartialBuild
): Promise<BuildWithoutOwner> => {
  const blueprint = blueprints[build.id]
  const decoded = decodeBlueprint(blueprint)
  const imageSrc = `https://factorio-builds-static-assets-dev-781466525417.s3.amazonaws.com/${build.id}`
  const dimensions = await imageSize(imageSrc)

  if (!dimensions) {
    throw `Cannot get dimensions for build "${build.name}"`
  }

  return {
    id: build.id,
    name: build.name,
    description: build.description,
    ownerId: build.ownerId,
    blueprint: blueprint,
    json: decoded,
    metadata: {
      categories: build.metadata.categories,
      state: build.metadata.state,
      tileable: build.metadata.tileable,
      withMarkedInputs: build.metadata.withMarkedInputs,
      withBeacons: build.metadata.withBeacons,
      area: build.metadata.area || 0,
      isBook: isBook(decoded),
      icons: generateIcons(decoded),
    },
    image: {
      src: imageSrc,
      width: dimensions.width,
      height: dimensions.height,
    },
    views: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const builds: IPartialBuild[] = [
  {
    id: "a197ee1c-9b02-4824-bd5f-3725073fc772",
    name: "Single Lane Balancer",
    description: "",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    metadata: {
      categories: [ECategory.BALANCER],
      state: [EState.LATE_GAME],
      tileable: false,
      withMarkedInputs: false,
      withBeacons: false,
      area: 43,
    },
  },
  {
    id: "a84e9b6c-c920-4567-9ba0-2a018d734da7",
    name: "16 - 8 Belt Balancer",
    description: "",
    ownerId: "8358cfb0-2675-4651-a9c2-0d7cf57d6110",
    metadata: {
      categories: [ECategory.BALANCER],
      state: [EState.LATE_GAME],
      tileable: true,
      withMarkedInputs: false,
      withBeacons: false,
      area: 265,
    },
  },
  {
    id: "c5f4aad0-8237-4a88-8280-d9d33875d25a",
    name: "Easy-tile Solar Array",
    description:
      "A tiling-ready solar array built to near-perfect ratios.\n\n#### Features\n\n- 18:15 solar/accumulator ratio (1.2 accumulators short of perfect)\n- 2 tiles of space between for logistical convenience (walking paths, rail paths, or belt lines)\n- networked roboport for easy solar field expansion\n\n#### Stats\n- 180 solar panels producing 10.8MW\n- 150 accumulators storing 750 MJ\n- 16 substations providing electrical distribution\n- 48x48 tile footprint\n\nPlace down solar arrays using the logistics network area as an alignment guide. Adjacent arrays will connect to one another via substations, even across a 2-tile gap that should be present. Arrays can be packed closer together if so desired. To attain perfect ratios, 6 additional accumulators must be constructed per 5 solar arrays. These can be tacked into the 2-tile gap between arrays if certain areas are not needed as paths, belt lanes, or train tracks, or in a separate area of the factory.",
    ownerId: "8358cfb0-2675-4651-a9c2-0d7cf57d6110",
    metadata: {
      categories: [ECategory.ENERGY],
      state: [EState.MID_GAME],
      tileable: true,
      withMarkedInputs: false,
      withBeacons: false,
      area: 265,
    },
  },
  {
    id: "96f452d5-1c89-4aa8-94b8-a2cecb8c2cd5",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "## Whats is this?\n\nPack with 3 LOAD and 3 UNLOAD model stations. All with controlled-circuit to priorize best train load and unload.\n\n- 2 Way Fast LOAD Station (Supports trains setup 1-4-0 or 1-4-1)\n- 2 Way Fast UNLOAD Station (Supports trains setup 1-4-0 or 1-4-1)\n- 4 Way Fast LOAD Station (Supports trains setup 1-4-0 or 1-4-1)\n- 4 Way Fast UNLOAD Station (Supports trains setup 1-4-0 or 1-4-1)\n- 2 Way ORE LOAD 2-8-2 (Supports trains setup 2-8-0 or 2-8-2)\n- 2 Way ORE UNLOAD 2-8-2 (Supports trains setup 2-8-0 or 2-8-2)\n\n## Notes\n\n### For Load Stations\n\nSet ALL Stations to same name.\nFor correct work of autobalance is required set a resource, change in all stations (First Image RED Arrow, DONT COPY, change manual)\nChange, if need, train fuel (Second image, BLUE Arrow, need change in all stations)\n\n### For Unload Stations\n\n- Set ALL Stations to same name.\nBlueprint stations set to only unload Iron Ore, to use another resource need make this change. (First image RED Arrow)\n- Change, if need, train fuel (First image BLUE Arrow, need change in all stations)\n- For correct work of autobalance is required set a resource, change in all stations (Second Image GREEN Arrow, DONT COPY, change manual)\n\n## Versions:\n\n- 05 - Now Packed all stations in same Blueprint\n- 04 - Correct wrong wire connection (thanks Simon Holman for feedback)\n- 03 - Now supports trains setup 1-4-0 or 1-4-1\n- 02 - Fix and improve\n- 01 - First one",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: false,
      categories: [ECategory.TRAINS],
      withBeacons: false,
      withMarkedInputs: true,
    },
    name:
      "LOAD/UNLOAD Stations Pack for 1-4-0 / 1-4-1 / 2-8-0 / 2-8-2 trains setup v05 (with controlled-circuit to optimize trains load and unload) for v1.0",
  },
  {
    id: "9d3de969-db99-49a4-a493-5c048459d5ab",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description: "High scalability.",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: false,
      categories: [],
      withBeacons: false,
      withMarkedInputs: false,
    },
    name: "NRC's Mining[Ver0.17.69.02]",
  },
  {
    id: "b6fad7df-b147-44b8-b9a9-7e7491c2ff83",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "Comprehensive smelting blueprint book for all furnace, and belt types including Better Belts and Built-In-Beacons mods.\n\nNew fuel delivery method for stone, and steel furnaces enables you to have a full belt of fuel, and raw materials without taking a ton of space.",
    metadata: {
      area: 0,
      state: [EState.MID_GAME],
      tileable: false,
      categories: [ECategory.SMELTING],
      withBeacons: true,
      withMarkedInputs: true,
    },
    name: "Smelting Book",
  },
  {
    id: "e9b16a2e-20f4-4079-9e7a-7ff6577e4809",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "That's a lot of oil!\n100 refineries.\n15 train stacker (1-4-1)\n3x pumps per fluid wagon on all inputs/outputs\nStill needs some cleanup. Probably will add some additional tanks and possibly some cracking. Depends what I can fit.",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: false,
      categories: [ECategory.TRAINS, ECategory.REFINERY],
      withBeacons: false,
      withMarkedInputs: false,
    },
    name: "Refinery 100x",
  },
  {
    id: "eb3e4203-c9b6-4531-b2d7-0d59e6c6fbd2",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "Tessellating 3 drillers, 2 underground belts and 1 electricity pylon to maximise drilling output (just add underground belts to the end as necessary)",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: true,
      categories: [],
      withBeacons: false,
      withMarkedInputs: false,
    },
    name: "SUPER COMPACT tileable mining blueprint",
  },
  {
    id: "ec851964-1420-41b7-9a99-a74c79480111",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "This bot mall contains Power Armor MK2 and equipment to put in it.\n\nIt requires these materials to be available on the logistic network:\n\n- Iron plate\n- Copper plate\n- Steel plate\n- Electronic circuit ( Green chip )\n- Advanced circuit ( Red chip )\n- Processing unit ( Blue chip )\n- Plastic bar\n- Battery\n- Speed module 2\n- Efficiency module 2\n- Lubricant barrel",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: false,
      categories: [ECategory.PRODUCTION],
      withBeacons: false,
      withMarkedInputs: false,
    },
    name: "18-Armor & Equipment by ElderAxe (v3.1.0)",
  },
  {
    id: "f2f4e158-4b4b-470c-9e65-de83932ed6b7",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "I decided to update my old Nuclear blueprints for the latest update with Offshore Pumps. I wanted to incorporate landfill and offshore pumps directly going into the heat exchangers, so I added that feature. There is also a Land version of the blueprint with pipes coming out of the bottom area for easy water hookup.\n\nThis blueprint is centered around 12 Nuclear reactors, but also has the extra spaces filled in with a balanced ratio Solar Panel + Accumulator build. This allows you to get maximum power in the space while keeping the original Nuclear design intact.\n\n- 176 Heat Exchangers\n- 304 Steam Turbines\n- 436 Solar Panels\n- 368 Accumulators",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: false,
      categories: [ECategory.ENERGY],
      withBeacons: false,
      withMarkedInputs: false,
    },
    name: "Nuclear 12 Core Reactor Book - V0.18.10 - BobAAAces",
  },
  {
    id: "014ad13d-4988-4d04-ab04-1995a98ca35c",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "my new oil refinery is ready. 1 refinery to serve it all:\n\n6483 petroleum gas /sec (for plastic bars). It's enough for 2700spm science packs if they are full prod module augmented\n34.4 rocket fuel /sec (satellite+rockets)\n160 lubricant (some surplus for mall)\n757 sulfuric acid (optional - could be processed from petroleum gas elsewhere or taken directly. surplus for uranium mining operations\nlight oil for flamethrower action (more damage than crude oil)\n\nÖl Raffinerie für 2700spm. Genug für alle Flaschen (mit Prod-Modulen) + Mall + Uranerzabbau + Flammenwerfer\n - am Wasser bauen! - \nInput: 9497.2 water (8 pumps) + 6181.9 crude oil + 12.2 metal\nOutput: 6482.6 petrolelum gas + 160 lubricant + 34.4 rocket fuel + (optional) 757 sulfuric acid\n",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: false,
      categories: [ECategory.TRAINS, ECategory.REFINERY],
      withBeacons: true,
      withMarkedInputs: true,
    },
    name: "bbq 2700spm Raffinerie 1.1",
  },
  {
    id: "7256f0a4-5d0a-4a1e-a6b1-d7ee22c6d85f",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "https://forums.factorio.com/viewtopic.php?f=8&t=66732\n\nThank you for using my Blueprints! Lot of love :)",
    metadata: {
      area: 0,
      state: [EState.EARLY_GAME],
      tileable: false,
      categories: [ECategory.PRODUCTION],
      withBeacons: true,
      withMarkedInputs: true,
    },
    name: "TeKillA Mall BP Book MK2",
  },
  {
    id: "463ccd10-35d3-48eb-bb19-c8c82560d8f2",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "This blueprint is tileable vertically, and consistently outputs two full blue belts of green circuits given enough input (it consists of two symmetrical parts, both of which are included to make it easily tileable). A single part is made of 6 assemblers and 24 beacons (36 beacons total).\n\nIt's called The Fish because the power lines look like a fish from the map view.",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: true,
      categories: [ECategory.PRODUCTION],
      withBeacons: true,
      withMarkedInputs: false,
    },
    name:
      'Highly compact tileable green circuits (2 blue belts out) - "The Fish"',
  },
  {
    id: "09d85912-8671-42d4-8bbc-d1571ec77cba",
    ownerId: "c8b15803-1b90-4194-9896-a2869e67deb2",
    description:
      "IT'S FINALLY DONE...\nAfter about 40 hours of total build time, it's finally here. (Not that anyone has waited or asked for it)\n\nI wasn't very happy with my v4.1 mall, as I was relying on too many mixed belts to feed everything. This time I also took inspiration from Mike's Mall.\n\nIt does not produce as many items as the previous version, because I decided to get rid of (almost) every warfare stuff.\n\nIt builds:\n\n- Well, you can see it in the Image... I'm too lazy to list everything.\n- There is something special though: At the far end you can set the assemby machine to either build Modular Armor, Power Armor or Power Armor Mk2. So you can build whatever is available to you.\n\nInitially I intended to make additional lower tier versions of it, but I did not have any more patience to do it. So... Sorry\n\n~~I hope that I cought every mistake and you do not have to fix anything.~~\n\n### Update #3:\n\nChanged the two stack filter inserters to normal stack inserters as it is a tiny bit faster (At least it should be if it is not constrained by the amount of copper coming in)... And I also forgot to set their filters in \"Mike's Edition\".\n\n### Update #2:\n\nAdded the missing signals for the combinators. (Thanks for pointing out my mistakes)\n\n### Update #1:\n\nNow added the \"Choose your own amounts\" feature from Mike's Mall (You can set your desired amounts by using the constant combinators)\nMistakes have been made... and fixed",
    metadata: {
      area: 0,
      state: [EState.LATE_GAME],
      tileable: false,
      categories: [ECategory.PRODUCTION],
      withBeacons: false,
      withMarkedInputs: true,
    },
    name: "SK's Belt-Based Mall v5.1 (0.16)",
  },
]

export const generateBuilds = async (): Promise<BuildWithoutOwner[]> => {
  return Promise.all(builds.map(generateBuild))
}
