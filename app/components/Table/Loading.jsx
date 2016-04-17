import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

function mapStateToProps (state) {
  const { table } = state

  return {
    isFetching: table.get("isFetching")
  }
}

@connect(mapStateToProps)
export default class Loading extends Component {
  render () {
    const { props: { isFetching } } = this

    return isFetching && (
      <div>loading</div>
    )
  }
}