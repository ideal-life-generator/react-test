import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import classNames from "classnames"
import { unselectAllSelectedItems } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    selectedCount: table.getIn([ "params", "selectedCount" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    unselectAllSelected: unselectAllSelectedItems
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Remove extends Component {
  constructor (props) {
    super(props)

    const settings = {
      unselectAllSelected: this.unselectAllSelected.bind(this)
    }

    Object.assign(this, settings)
  }

  unselectAllSelected () {
    const { props: { unselectAllSelected } } = this

    unselectAllSelected()
  }

  render () {
    const {
      unselectAllSelected,
      props: { selectedCount }
    } = this

    return (
      <div
        className={classNames("ui button", {
          disabled: selectedCount <= 0
        })}
        onClick={unselectAllSelected}>
        Unselect selected
      </div>
    )
  }
}
