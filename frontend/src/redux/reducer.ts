import { authReducer } from "./reducers/auth"
import { filtersReducer } from "./reducers/filters"
import { layoutReducer } from "./reducers/layout"

export default {
  auth: authReducer,
  filters: filtersReducer,
  layout: layoutReducer,
}
