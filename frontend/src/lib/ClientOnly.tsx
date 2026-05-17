import React, { useSyncExternalStore } from "react"

function subscribe() {
  return () => {}
}
function getServerSnapshot() {
  return false
}
function getClientSnapshot() {
  return true
}

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ClientOnly({ children, fallback = null }: Props) {
  const isClient = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )
  return <>{isClient ? children : fallback}</>
}
