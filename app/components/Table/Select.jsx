import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
  selectAllItemsInPage,
  unselectAllItemsInPage,
  unselectAllSelectedItems,
  removeSelectedItemsAndFetchData
} from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    selectedInPage: table.getIn([ "params", "selectedInPage" ]),
    selectedCount: table.getIn([ "params", "selectedCount" ]),
    selectedIsRemoving: table.getIn([ "params", "selectedIsRemoving" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    selectAllItemsInPage,
    unselectAllItemsInPage,
    unselectAllSelectedItems,
    removeSelectedItems: removeSelectedItemsAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Select extends Component {
  constructor (props) {
    super(props)

    const settings = {
      selectInPageToggler: this.selectInPageToggler.bind(this),
      unselectAll: this.unselectAll.bind(this),
      removeSelected: this.removeSelected.bind(this)
    }

    Object.assign(this, settings)
  }

  selectInPageToggler (event) {
    const {
      props: {
        selectAllItemsInPage,
        unselectAllItemsInPage
      }
    } = this
    const { target: { checked } } = event

    if (checked) selectAllItemsInPage()
    else unselectAllItemsInPage()
  }

  unselectAll () {
    const { props: { unselectAllSelectedItems } } = this

    unselectAllSelectedItems()
  }

  removeSelected () {
    const { props: { removeSelectedItems } } = this

    removeSelectedItems()
  }

  render () {
    const {
      selectInPageToggler,
      unselectAll,
      removeSelected,
      props: { selectedInPage, selectedCount, selectedIsRemoving }
    } = this

    return (
      <div>
        <input
          type="checkbox"
          onChange={selectInPageToggler}
          checked={selectedInPage} />
        {selectedCount > 0 &&
          <div>
            <span><span>{selectedCount}</span> selected</span>
            <button onClick={unselectAll}>unselect</button>
            {!selectedIsRemoving ?
                <button onClick={removeSelected}>remove</button>
              :
                <span>removing</span>
            }
          </div>
        }
      </div>
    )
  }
}