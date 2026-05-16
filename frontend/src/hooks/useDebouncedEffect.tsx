import * as React from "react"

export function useDebouncedEffect(
  effect: () => void,
  delay: number,
  deps: React.DependencyList
): void {
  const callback = React.useCallback(effect, deps)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      callback()
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [callback, delay])
}
