import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { changeSortAndFetchData, changeReverseAndFetchData } from "actions/table"

function mapStateToProps (state, ownProps) {
  const { table } = state

  return {
    sort: table.getIn([ "query", "sort" ]),
    reverse: table.getIn([ "query", "reverse" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changeSort: changeSortAndFetchData,
    changeReverse: changeReverseAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Sort extends Component {
  constructor (props) {
    super(props)

    const settings = {
      sortToggler: this.sortToggler.bind(this)
    }

    Object.assign(this, settings)
  }

  sortToggler () {
    const { props: { sortKey, sort, reverse, changeSort, changeReverse } } = this

    if (sort !== sortKey) changeSort(sortKey)
    else changeReverse(!reverse)
  }

  render () {
    const {
      sortToggler,
      props: { title, sortKey, sort, reverse }
    } = this

    return (
      <div>
        <span onClick={sortToggler}>{title}</span>
        {sort && sort === sortKey &&
          (reverse ?
              <span>&#8593;</span>
            :
              <span>&#8595;</span>
          )
        }
      </div>
    )
  }
}