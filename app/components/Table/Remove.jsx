import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import classNames from "classnames"
import { removeSelectedItemsAndFetchData } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    selectedCount: table.getIn([ "params", "selectedCount" ]),
    selectedIsRemoving: table.getIn([ "params", "selectedIsRemoving" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    removeSelectedItems: removeSelectedItemsAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Remove extends Component {
  constructor (props) {
    super(props)

    const settings = {
      removeSelected: this.removeSelected.bind(this)
    }

    Object.assign(this, settings)
  }

  removeSelected () {
    const { props: { removeSelectedItems } } = this

    removeSelectedItems()
  }

  render () {
    const {
      removeSelected,
      props: { selectedCount, selectedIsRemoving }
    } = this

    return (
      <div
        className={classNames("ui red button", {
          disabled: selectedCount <= 0,
          loading: selectedIsRemoving
        })}
        onClick={removeSelected}>
        Remove selected
      </div>
    )
  }
}
