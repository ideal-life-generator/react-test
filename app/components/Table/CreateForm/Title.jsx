import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { createdItemChangeTitle } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    title: table.getIn([ "create", "form", "title" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changeTitle: createdItemChangeTitle
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Title extends Component {
  constructor (props) {
    super(props)

    const settings = {
      changeTitle: this.changeTitle.bind(this)
    }

    Object.assign(this, settings)
  }

  changeTitle (event) {
    const { props: { changeTitle } } = this
    const { target: { value } } = event

    changeTitle(value)
  }

  render () {
    const {
      changeTitle,
      props: { title }
    } = this

    return (
      <input
        type="text"
        onChange={changeTitle}
        value={title}
        defaultValue={title}
        placeholder="Title"
        autoFocus />
    )
  }
}