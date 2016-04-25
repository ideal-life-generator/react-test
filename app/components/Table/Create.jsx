import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import classNames from "classnames"
import { create } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    isActive: table.getIn([ "create", "isActive" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    create
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Create extends Component {
  constructor (props) {
    super(props)

    const settings = {
      create: this.create.bind(this),
    }

    Object.assign(this, settings)
  }

  create () {
    const {
      props: { create }
    } = this

    create()
  }

  render () {
    const {
      create,
      props: { isActive }
    } = this

    return (
      <button
        className={classNames("ui right floated primary labeled icon button", {
          disabled: isActive
        })}
        onClick={create}>
        <i className="user icon"></i> Add Item
      </button>
    )
  }
}