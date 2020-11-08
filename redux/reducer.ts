import { buildsReducer } from "./reducers/builds"
import { filtersReducer } from "./reducers/filters"

export default {
  builds: buildsReducer,
  filters: filtersReducer,
}
