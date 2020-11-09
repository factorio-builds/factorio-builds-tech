import { authReducer } from "./reducers/auth"
import { buildsReducer } from "./reducers/builds"
import { filtersReducer } from "./reducers/filters"

export default {
  auth: authReducer,
  builds: buildsReducer,
  filters: filtersReducer,
}
