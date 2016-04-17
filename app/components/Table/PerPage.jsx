import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { changeLimitAndFetchData } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    limit: table.getIn([ "query", "limit" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changeLimit: changeLimitAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PerPage extends Component {
  constructor (props) {
    super(props)

    const settings = {
      minLimit: 5,
      maxLimit: 50,
      decrementLimit: this.decrementLimit.bind(this),
      incrementLimit: this.incrementLimit.bind(this),
      changeLimit: this.changeLimit.bind(this),
      select: this.select.bind(this)
    }

    Object.assign(this, settings)
  }

  decrementLimit () {
    const {
      minLimit,
      props: { limit, changeLimit }
    } = this
    const newLimit = limit > minLimit ? limit - 1 : limit

    changeLimit(newLimit)
  }

  incrementLimit () {
    const {
      maxLimit,
      props: { limit, changeLimit }
    } = this
    const newLimit = limit < maxLimit ? limit + 1 : limit

    changeLimit(newLimit)
  }

  changeLimit (event) {
    const { target: { value } } = event
    const {
      minLimit,
      maxLimit,
      select,
      props: { limit, changeLimit }
    } = this
    const newLimit = value >= minLimit ? value <= maxLimit ? value : maxLimit : minLimit

    changeLimit(newLimit)

    select(event)
  }

  select (event) {
    const { target } = event

    setTimeout(() => {
      target.select()
    })
  }

  render () {
    const {
      decrementLimit,
      incrementLimit,
      changeLimit,
      select,
      props: { limit }
    } = this

    return (
      <th>
        <span onClick={decrementLimit}>-</span>
        <input
          value={limit}
          onFocus={select}
          onChange={changeLimit}
          type="number" />
        <span onClick={incrementLimit}>+</span>
      </th>
    )
  }
}