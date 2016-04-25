import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { closeCreate } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    isActive: table.getIn([ "create", "isActive" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    closeCreate
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Close extends Component {
  constructor (props) {
    super(props)

    const settings = {
      closeCreate: this.closeCreate.bind(this),
    }

    Object.assign(this, settings)
  }

  closeCreate (event) {
    const {
      props: { closeCreate }
    } = this

    closeCreate()

    event.preventDefault()
  }

  render () {
    const {
      closeCreate,
      props: { isActive }
    } = this

    return (
      <button
        className="ui button"
        onClick={closeCreate}>
        Close
      </button>
    )
  }
}