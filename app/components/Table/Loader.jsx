import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import classNames from "classnames"

function mapStateToProps (state) {
  const { table } = state

  return {
    isFetching: table.get("isFetching")
  }
}

@connect(mapStateToProps)
export default class Loader extends Component {
  render () {
    const { props: { isFetching } } = this

    return (
      <div className={classNames("ui loader", {
        active: isFetching
      })}>
      </div>
    )
  }
}