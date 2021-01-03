import { authReducer } from "./reducers/auth"
import { filtersReducer } from "./reducers/filters"
import { searchReducer } from "./reducers/search"

export default {
  auth: authReducer,
  filters: filtersReducer,
  search: searchReducer,
}
