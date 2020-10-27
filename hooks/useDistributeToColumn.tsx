import { IBuild } from "../types"

function calcRatio(width: number, height: number): number {
  return height / width
}

function columnHeight(
  items: IBuild[],
  colWidth: number,
  gutter: number
): number {
  const gutterHeight = Math.max(items.length - 1, 0) * gutter
  const itemsTotalHeight = items.reduce((acc, item) => {
    return acc + calcRatio(item.image.width, item.image.height) * colWidth
  }, 0)
  return itemsTotalHeight + gutterHeight
}

function getShortestColumn(columns: any[], colWidth: number, gutter: number) {
  const currColumnsHeight = columns.map((column) =>
    columnHeight(column, colWidth, gutter)
  )
  const min = Math.min(...currColumnsHeight)
  const shortestColumnIndex = currColumnsHeight.indexOf(min)

  return columns[shortestColumnIndex]
}

export function useDistributeToColumn(
  items: IBuild[],
  colCount: number,
  containerWidth: number,
  gutter: number
): IBuild[][] {
  if (colCount === 0) {
    return []
  }

  const colWidth =
    containerWidth / colCount - (gutter * (colCount - 1)) / colCount

  const columns = Array.from({ length: colCount }, () => [])

  // TODO: memoize
  items.forEach((item) => {
    const shortestColumn = getShortestColumn(columns, colWidth, gutter)

    shortestColumn.push(item)
  })

  return columns
}
