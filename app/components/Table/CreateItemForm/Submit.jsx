import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { submitCreatedItemAndFetchData } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    isUploading: table.getIn([ "createItem", "isUploading" ]),
    isResponseError: table.getIn([ "createItem", "isResponseError" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    submit: submitCreatedItemAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Submit extends Component {
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
  }

  render () {
    const {
      submit,
      props: { isUploading, isResponseError }
    } = this

    return (
      <div>
        {!isUploading ?
          <div>
            <button onClick={submit}>submit</button>
            {isResponseError && <span>!</span>}
          </div>
        :
          <div>isUploading</div>
        }
      </div>
    )
  }
}