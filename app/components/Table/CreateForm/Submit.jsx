import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"

function mapStateToProps (state) {
  const { table } = state

  return {
    isResponseError: table.getIn([ "create", "isResponseError" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Submit extends Component {
  constructor (props) {
    super(props)

    const settings = {
    }

    Object.assign(this, settings)
  }

  render () {
    const {
      props: { isResponseError }
    } = this

    return (
      <button
        className="ui black button">
        Submit
        {isResponseError && <i className="right warning circle icon"></i>}
      </button>
    )
  }
}