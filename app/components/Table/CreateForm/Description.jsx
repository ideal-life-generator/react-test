import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { createdItemChangeDescription } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    description: table.getIn([ "create", "form", "description" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changeDescription: createdItemChangeDescription
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Description extends Component {
  constructor (props) {
    super(props)

    const settings = {
      changeDescription: this.changeDescription.bind(this)
    }

    Object.assign(this, settings)
  }

  changeDescription (event) {
    const { props: { changeDescription } } = this
    const { target: { value } } = event

    changeDescription(value)
  }

  render () {
    const {
      changeDescription,
      props: { description }
    } = this

    return (
      <textarea
        onChange={changeDescription}
        value={description}
        defaultValue={description}
        placeholder="Description">
      </textarea>
    )
  }
}