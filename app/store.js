import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from "redux-thunk"
import reducers from "reducers"

const thunk = applyMiddleware(thunkMiddleware)

export default createStore(
  reducers,
  thunk
)