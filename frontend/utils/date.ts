import { format, formatDistanceToNow, parseISO, isYesterday, differenceInHours } from "date-fns"

const FORMAT = "yyyy-MM-dd h:m a O"

export const formatDate = (isoString: string): string => {
  return format(parseISO(isoString), FORMAT)
}

export const formatSince = (isoString: string): string => {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
}

export const formatDateHuman = (isoString: string): string => {
  const iso = parseISO(isoString)

  if (differenceInHours(new Date(), iso) < 24) {
    return `${differenceInHours(new Date(), iso)} hours ago`
  }

  if (isYesterday(iso)) {
    return "yesterday"
  }

  return format(iso, FORMAT)
}
