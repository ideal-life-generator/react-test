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
      active: this.active.bind(this),
      passive: this.passive.bind(this),
      update: this.update.bind(this)
    }

    Object.assign(this, settings)
  }

  active () {
    const {
      props: { filterKey, personalFilterActive }
    } = this

    personalFilterActive(filterKey)
  }

  passive (event) {
    const {
      props: { filterKey, personalFilterDeactive }
    } = this

    personalFilterDeactive(filterKey)

    event.stopPropagation()
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
      active,
      passive,
      update,
      props: { isActive, filter, placeholder }
    } = this

    return (
      <th onClick={active}>
        {isActive ?
            <div className="ui icon input">
              <input
                type="text"
                onChange={update}
                value={filter}
                defaultValue={filter}
                maxLength={maxLength}
                placeholder={placeholder} />
              <i
                className="remove link icon"
                onClick={passive}>
              </i>
            </div>
          :
            <i className="search icon"></i>
        }
      </th>
    )
  }
}