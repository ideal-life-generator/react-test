import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

function mapStateToProps (state) {
  const { table } = state

  return {
    selectedCount: table.getIn([ "params", "selectedCount" ])
  }
}

@connect(mapStateToProps)
export default class Selected extends Component {
  render () {
    const {
      props: { selectedCount }
    } = this

    return (
      <div className="nowrap">
        <span>{selectedCount}</span>
        <span> selected</span>
      </div>
    )
  }
}
