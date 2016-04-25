import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { changeFilterAndFetchData } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    filter: table.getIn([ "query", "filter" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changeFilter: changeFilterAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Filter extends Component {
  constructor (props) {
    super(props)

    const settings = {
      maxLength: 50,
      changeFilter: this.changeFilter.bind(this)
    }

    Object.assign(this, settings)
  }

  changeFilter (event) {
    const { props: { changeFilter } } = this
    const { target: { value } } = event

    changeFilter(value)
  }

  select (event) {
    const { target } = event

    setTimeout(() => {
      target.select()
    })
  }

  render () {
    const {
      maxLength,
      select,
      changeFilter,
      props: { filter }
    } = this

    return (
      <div className="ui icon input">
        <input
          type="text"
          onFocus={select}
          onChange={changeFilter}
          value={filter}
          defaultValue={filter}
          maxLength={maxLength}
          placeholder="Search..." />
        <i className="search icon"></i>
      </div>
    )
  }
}