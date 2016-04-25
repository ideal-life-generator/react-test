import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import classNames from "classnames"
import { refreshData } from "actions/table"

function mapStateToProps (state, ownProps) {
  const { table } = state

  return {
    isFetching: table.get("isFetching"),
    isResponseError: table.get("isResponseError")
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    refreshData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Refresh extends Component {
  constructor (props) {
    super(props)

    const settings = {
      refresh: this.refresh.bind(this)
    }

    Object.assign(this, settings)
  }

  refresh () {
    const { props: { refreshData } } = this

    refreshData()
  }

  render () {
    const {
      refresh,
      props: { isFetching, isResponseError }
    } = this

    return (
      <span>
        <span>
          <button
            className={classNames("ui secondary button", {
              loading: isFetching
            })}
            onClick={refresh}>
            Refresh
            {isResponseError && <i className="right warning circle icon"></i>}
          </button>
        </span>
      </span>
    )
  }
}