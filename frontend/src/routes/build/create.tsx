import { createFileRoute } from "@tanstack/react-router"
import BuildFormPage from "../../components/pages/BuildFormPage"

export const Route = createFileRoute("/build/create")({
  head: () => ({ meta: [{ title: "Factorio Builds | Create a build" }] }),
  component: () => <BuildFormPage type="CREATE" />,
})
