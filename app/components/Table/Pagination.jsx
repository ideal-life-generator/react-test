import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { changePageAndFetchData } from "actions/table"

function mapStateToProps (state) {
  const { table } = state

  return {
    page: table.getIn([ "params", "page" ]),
    pages: table.getIn([ "params", "pages" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    changePage: changePageAndFetchData
  }, dispatch)
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Pagination extends Component {
  constructor (props) {
    super(props)

    const settings = {
      minLimit: 1,
      prevPage: this.prevPage.bind(this),
      nextPage: this.nextPage.bind(this),
      changePage: this.changePage.bind(this),
      select: this.select.bind(this)
    }

    Object.assign(this, settings)
  }

  prevPage () {
    const {
      minLimit,
      props: { page, pages, changePage }
    } = this
    const newPage = page > minLimit ? page - minLimit : minLimit

    if (newPage !== page) {
      changePage(newPage)
    }
  }

  nextPage () {
    const { props: { page, pages, changePage } } = this
    const newPage = page < pages ? page + 1 : pages

    if (newPage !== page) {
      changePage(newPage)
    }
  }

  changePage (event) {
    const {
      minLimit,
      select,
      props: { page, pages, changePage }
    } = this
    const { target: { value } } = event
    const newPage = value >= minLimit ? value <= pages ? value : pages : minLimit

    changePage(newPage)

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
      minLimit,
      prevPage,
      nextPage,
      changePage,
      select,
      props: { page, pages }
    } = this

    return pages > minLimit &&
      (
        <div>
          {page > minLimit &&
            <a onClick={prevPage}>prev</a>
          }
          <input
            type="text"
            onFocus={select}
            onChange={changePage}
            value={page}
            defaultValue={page} />
          <span>of</span>
          <span>{pages || "..."}</span>
          {page < pages &&
            <a onClick={nextPage}>next</a>
          }
        </div>
      )
  }
}