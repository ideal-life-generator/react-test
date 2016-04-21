import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import {
  personalFilterActiveAndFetchData,
  personalFilterDeactiveAndFetchData,
  changePersonalFilterAndFetchData
} from "actions/table"

function mapStateToProps (state, ownProps) {
  const { table } = state
  const { filterKey } = ownProps
  const additionalFilters = table.getIn([ "query", "additionalFilters" ])
  const personalFilterImmutable = additionalFilters.find((personalFilter) => personalFilter.get("key") === filterKey)
  const personalFilter = personalFilterImmutable ? personalFilterImmutable.toObject() : { }

  return {
    ...ownProps,
    ...personalFilter
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    personalFilterActive: personalFilterActiveAndFetchData,
    personalFilterDeactive: personalFilterDeactiveAndFetchData,
    changePersonalFilter: changePersonalFilterAndFetchData 
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PersonalFilter extends Component {
  constructor (props) {
    super(props)

    const settings = {
      maxLength: 50,
      toggler: this.toggler.bind(this),
      update: this.update.bind(this)
    }

    Object.assign(this, settings)
  }

  toggler () {
    const {
      props: { filterKey, isActive, personalFilterActive, personalFilterDeactive }
    } = this

    if (!isActive) personalFilterActive(filterKey)
    else personalFilterDeactive(filterKey)
  }

  update (event) {
    const { target: { value } } = event
    const {
      props: { filterKey, changePersonalFilter }
    } = this

    changePersonalFilter(filterKey, value)
  }

  render () {
    const {
      maxLength,
      toggler,
      update,
      props: { isActive, filter }
    } = this

    return (
      <span>
        {isActive && <input
          type="text"
          onChange={update}
          value={filter}
          defaultValue={filter}
          maxLength={maxLength}
          placeholder="filter" />
        }
        <span onClick={toggler}>&#9774;</span>
      </span>
    )
  }
}