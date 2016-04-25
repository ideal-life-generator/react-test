import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { selectAllItemsInPage, unselectAllItemsInPage } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    selectedInPage: table.getIn([ "params", "selectedInPage" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    selectAllItemsInPage,
    unselectAllItemsInPage
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Select extends Component {
  constructor (props) {
    super(props)

    const settings = {
      selectInPageToggler: this.selectInPageToggler.bind(this)
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

  render () {
    const {
      selectInPageToggler,
      props: { selectedInPage }
    } = this

    return (
      <div className="ui fitted slider checkbox">
        <input
          type="checkbox"
          onChange={selectInPageToggler}
          checked={selectedInPage} />
        <label></label>
      </div>
    )
  }
}
