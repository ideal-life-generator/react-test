import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { hideColumn } from "actions/table"

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    hideColumn
  }, dispatch)
}

@connect(null, mapDispatchToProps)
export default class HideColumn extends Component {
  constructor (props) {
    super(props)

    const settings = {
      hide: this.hide.bind(this)
    }

    Object.assign(this, settings)
  }

  hide () {
    const {
      props: { hideColumn, column }
    } = this

    hideColumn(column)
  }

  render () {
    const { hide } = this

    return (
      <button
        className="ui icon button"
        onClick={hide}>
        <i className="hide icon"></i>
      </button>
    )
  }
}