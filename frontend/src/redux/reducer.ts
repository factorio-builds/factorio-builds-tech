import { authReducer } from "./reducers/auth"
import { filtersReducer } from "./reducers/filters"
import { layoutReducer } from "./reducers/layout"
import { searchReducer } from "./reducers/search"

export default {
  auth: authReducer,
  filters: filtersReducer,
  layout: layoutReducer,
  search: searchReducer,
}
