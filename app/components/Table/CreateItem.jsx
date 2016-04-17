import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { createItem, cancelCreateItem } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    isActive: table.getIn([ "createItem", "isActive" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    createItem,
    cancelCreateItem
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CreateItem extends Component {
  constructor (props) {
    super(props)

    const settings = {
      createItem: this.createItem.bind(this),
      cancelCreateItem: this.cancelCreateItem.bind(this)
    }

    Object.assign(this, settings)
  }

  createItem () {
    const { props: { createItem } } = this

    createItem()
  }

  cancelCreateItem () {
    const { props: { cancelCreateItem } } = this

    cancelCreateItem()
  }

  render () {
    const {
      createItem,
      cancelCreateItem,
      props: { isActive }
    } = this

    return !isActive ?
        (<button onClick={createItem}>create</button>)
      : 
        (<button onClick={cancelCreateItem}>close</button>)
  }
}