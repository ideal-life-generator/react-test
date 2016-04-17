import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { selectItem, unselectItem, removeItemAndFetchData } from "actions/table"

function mapStateToProps (state, ownProps) {
  const { table } = state
  const { id } = ownProps
  const itemsSettings = table.get("itemsSettings")
  const itemSettings = itemsSettings.find(itemSettings => itemSettings.get("id") === id)
  const selected = (itemSettings && itemSettings.get("selected")) || false
  const isRemoving = (itemSettings && itemSettings.get("isRemoving")) || false
  const isRemoveResponseError = (itemSettings && itemSettings.get("isRemoveResponseError")) || false

  return {
    selected,
    isRemoving,
    isRemoveResponseError
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    selectItem,
    unselectItem,
    removeItem: removeItemAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Item extends Component {
  constructor (props) {
    super(props)

    const settings = {
      selectToggler: this.selectToggler.bind(this),
      remove: this.remove.bind(this)
    }

    Object.assign(this, settings)
  }

  selectToggler (event) {
    const {
      props: { id, selectItem, unselectItem }
    } = this
    const { target: { checked } } = event

    if (checked) selectItem(id)
    else unselectItem(id)
  }

  remove () {
    const {
      props: { id, removeItem }
    } = this

    removeItem(id)
  }

  render () {
    const {
      selectToggler,
      remove,
      props: { id, title, description, createdIn, selected, isRemoving, isRemoveResponseError }
    } = this

    return (
      <tr>
        <td>
          <input
            type="checkbox"
            onChange={selectToggler}
            checked={selected} />
        </td>
        <td>{id}</td>
        <td>{title}</td>
        <td>{description}</td>
        <td>{createdIn}</td>
        <td>
          {!isRemoving ?
            <button onClick={remove}>
              remove
            </button>
            :
            <div>Removing</div>
          }
          {isRemoveResponseError && <span>!</span>}
        </td>
      </tr>
    )
  }
}