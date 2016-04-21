import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import store from "store"
import Table from "components/Table"
import "styles/fonts.less"
import "styles/common.less"

render(
  <Provider store={store}>
    <Table />
  </Provider>,
  document.getElementById("app")
)