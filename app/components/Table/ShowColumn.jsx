import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { showColumn } from "actions/table"

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    showColumn
  }, dispatch)
}

@connect(null, mapDispatchToProps)
export default class ShowColumn extends Component {
  constructor (props) {
    super(props)

    const settings = {
      show: this.show.bind(this)
    }

    Object.assign(this, settings)
  }

  show () {
    const {
      props: { showColumn, column }
    } = this

    showColumn(column)
  }

  render () {
    const {
      show,
      props: { title }
    } = this

    return (
      <button onClick={show}>
        {title}
      </button>
    )
  }
}