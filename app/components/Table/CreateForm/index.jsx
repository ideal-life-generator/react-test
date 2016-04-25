import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import classNames from "classnames"
import Title from "./Title.jsx"
import Description from "./Description.jsx"
import Close from "./Close.jsx"
import Submit from "./Submit.jsx"
import { submitCreatedItemAndFetchData } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    isUploading: table.getIn([ "create", "isUploading" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    submit: submitCreatedItemAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CreateForm extends Component {
  constructor (props) {
    super(props)

    const settings = {
      submit: this.submit.bind(this)
    }

    Object.assign(this, settings)
  }

  submit (event) {
    const { props: { submit } } = this

    submit()

    event.preventDefault()
  }

  render () {
    const {
      submit,
      props: { isUploading }
    } = this

    return (
      <div className="ui segment">
        <form
          className={classNames("ui form", {
            loading: isUploading
          })}
          onSubmit={submit}>
          <div className="field">
            <label>Title</label>
            <Title />
          </div>
          <div className="field">
            <label>Description</label>
            <Description />
          </div>
          <Close />
          <Submit />
        </form>
      </div>
    )
  }
}