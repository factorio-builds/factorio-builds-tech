import React, { ComponentType, lazy, Suspense } from "react"
import ClientOnly from "./ClientOnly"

// next/dynamic compat. Supports `ssr: false` and an optional `loading` placeholder.
interface DynamicOptions {
  ssr?: boolean
  loading?: () => React.ReactElement | null
}

export default function dynamic<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options?: DynamicOptions
) {
  const Lazy = lazy(loader)
  const fallback = options?.loading ? options.loading() : null
  const ssr = options?.ssr !== false

  return function Dynamic(props: P) {
    const tree = (
      <Suspense fallback={fallback}>
        <Lazy {...(props as P)} />
      </Suspense>
    )
    return ssr ? tree : <ClientOnly fallback={fallback}>{tree}</ClientOnly>
  }
}
