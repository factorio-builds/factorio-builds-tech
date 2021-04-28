import { useDistributeToColumn } from "../useDistributeToColumn"

const COL_WIDTH = 250
const GUTTER = 15
const ITEMS = [
  { id: 1, _links: { cover: { width: 250, height: 250 } } },
  { id: 2, _links: { cover: { width: 250, height: 140 } } },
  { id: 3, _links: { cover: { width: 250, height: 458 } } },
  { id: 4, _links: { cover: { width: 250, height: 254 } } },
  { id: 5, _links: { cover: { width: 250, height: 637 } } },
  { id: 6, _links: { cover: { width: 250, height: 89 } } },
  { id: 7, _links: { cover: { width: 250, height: 132 } } },
  { id: 8, _links: { cover: { width: 250, height: 89 } } },
  { id: 9, _links: { cover: { width: 250, height: 89 } } },
  { id: 10, _links: { cover: { width: 250, height: 89 } } },
]
const OUTPUT = [
  [
    { id: 1, _links: { cover: { width: 250, height: 250 } } },
    { id: 5, _links: { cover: { width: 250, height: 637 } } },
  ],
  [
    { id: 2, _links: { cover: { width: 250, height: 140 } } },
    { id: 4, _links: { cover: { width: 250, height: 254 } } },
    { id: 6, _links: { cover: { width: 250, height: 89 } } },
    { id: 8, _links: { cover: { width: 250, height: 89 } } },
    { id: 10, _links: { cover: { width: 250, height: 89 } } },
  ],
  [
    { id: 3, _links: { cover: { width: 250, height: 458 } } },
    { id: 7, _links: { cover: { width: 250, height: 132 } } },
    { id: 9, _links: { cover: { width: 250, height: 89 } } },
  ],
]

describe("useDistributeToColumn", () => {
  it.each([0, 2, 3, 4])("distributes by the right amount of %i columns", (a) => {
    expect(useDistributeToColumn(ITEMS as any, a, COL_WIDTH, GUTTER)).toHaveLength(a)
  })

  it("distributes when no items are passed", () => {
    const items = [] as any
    expect(useDistributeToColumn(items, 3, COL_WIDTH, GUTTER)).toEqual([[], [], []])
  })

  it("distributes less items than the column count", () => {
    const items = [
      { id: 1, _links: { cover: { width: 250, height: 250 } } },
      { id: 2, _links: { cover: { width: 250, height: 140 } } },
    ]
    expect(useDistributeToColumn(items as any, 3, COL_WIDTH, GUTTER)).toEqual([
      [{ id: 1, _links: { cover: { width: 250, height: 250 } } }],
      [{ id: 2, _links: { cover: { width: 250, height: 140 } } }],
      [],
    ])
  })

  it("distributes items equal to the column count", () => {
    const items = [
      { id: 1, _links: { cover: { width: 250, height: 250 } } },
      { id: 2, _links: { cover: { width: 250, height: 140 } } },
      { id: 3, _links: { cover: { width: 250, height: 458 } } },
    ]
    expect(useDistributeToColumn(items as any, 3, COL_WIDTH, GUTTER)).toEqual([
      [{ id: 1, _links: { cover: { width: 250, height: 250 } } }],
      [{ id: 2, _links: { cover: { width: 250, height: 140 } } }],
      [{ id: 3, _links: { cover: { width: 250, height: 458 } } }],
    ])
  })

  it("returns the expected output", () => {
    expect(useDistributeToColumn(ITEMS as any, 3, COL_WIDTH, GUTTER)).toEqual(OUTPUT)
  })

  it("carries the original value in the value key", () => {
    const items = [
      {
        id: 1,
        _links: {
          cover: { width: 250, height: 250, value: { name: "PHOTO1" } },
        },
      },
      {
        id: 2,
        _links: {
          cover: { width: 250, height: 140, value: { name: "PHOTO2" } },
        },
      },
      {
        id: 3,
        _links: {
          cover: { width: 250, height: 458, value: { name: "PHOTO3" } },
        },
      },
    ]
    expect(useDistributeToColumn(items as any, 3, COL_WIDTH, GUTTER)).toEqual([
      [
        {
          id: 1,
          _links: {
            cover: { width: 250, height: 250, value: { name: "PHOTO1" } },
          },
        },
      ],
      [
        {
          id: 2,
          _links: {
            cover: { width: 250, height: 140, value: { name: "PHOTO2" } },
          },
        },
      ],
      [
        {
          id: 3,
          _links: {
            cover: { width: 250, height: 458, value: { name: "PHOTO3" } },
          },
        },
      ],
    ])
  })

  it("avoids crashing with 0 width/height", () => {
    const items = [
      { id: 1, _links: { cover: { width: 250, height: 250 } } },
      { id: 2, _links: { cover: { width: 0, height: 0 } } },
      { id: 3, _links: { cover: { width: 250, height: 458 } } },
    ]
    expect(useDistributeToColumn(items as any, 3, COL_WIDTH, GUTTER)).toEqual([
      [
        {
          id: 1,
          _links: { cover: { width: 250, height: 250 } },
        },
      ],
      [
        {
          id: 2,
          _links: { cover: { width: 0, height: 0 } },
        },
      ],
      [
        {
          id: 3,
          _links: { cover: { width: 250, height: 458 } },
        },
      ],
    ])
  })
})
