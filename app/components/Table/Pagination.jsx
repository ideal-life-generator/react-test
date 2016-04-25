import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import classNames from "classnames"
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
      spaceLimit: 2,
      prevPage: this.prevPage.bind(this),
      nextPage: this.nextPage.bind(this),
      selectPage: this.selectPage.bind(this),
      calculatePagination: this.calculatePagination.bind(this)
    }

    Object.assign(this, settings)
  }

  prevPage() {
    const {
      minLimit,
      props: { page, pages, changePage }
    } = this
    const newPage = page > minLimit ? page - minLimit : minLimit

    if (newPage !== page) {
      changePage(newPage)
    }
  }

  nextPage() {
    const { props: { page, pages, changePage } } = this
    const newPage = page < pages ? page + 1 : pages

    if (newPage !== page) {
      changePage(newPage)
    }
  }

  selectPage(page) {
    const { props: { changePage } } = this

    changePage(page)
  }

  calculatePagination() {
    const {
      minLimit,
      spaceLimit,
      selectPage,
      props: { page, pages }
    } = this
    const pagesList = [ ]
    let startSpacePushed = false
    let endSpacePushed = false

    for (let index = minLimit; index < pages+minLimit; index++) {
      if (index === minLimit || (index >= page-spaceLimit && index <= page+spaceLimit) || index === pages) {
        pagesList.push(
          <a
            className={classNames("item", {
              active: page === index
            })}
            key={index}
            onClick={selectPage.bind(null, index)}>
            {index}
          </a>
        )
      } else if (!startSpacePushed && (index > minLimit && index < page-spaceLimit)) {
        pagesList.push(
          <div
            className="disabled item"
            key={index}>
            ...
          </div>
        )

        startSpacePushed = true
      } else if (!endSpacePushed && (index > page+minLimit && index < pages+spaceLimit)) {
        pagesList.push(
          <div
            className="disabled item"
            key={index}>
            ...
          </div>
        )

        endSpacePushed = true
      }
    }

    return pagesList
  }

  render () {
    const {
      minLimit,
      calculatePagination,
      prevPage,
      nextPage,
      changePage,
      selectPage,
      props: { page, pages }
    } = this

    return pages > minLimit &&
      (
        <div className="ui left floated pagination menu">
          <a
            className={classNames("icon item", {
              disabled: page === minLimit
            })}
            onClick={prevPage}>
            <i className="left chevron icon"></i>
          </a>
          {calculatePagination()}
          <a
            className={classNames("icon item", {
              disabled: page === pages
            })}
            onClick={nextPage}>
            <i className="right chevron icon"></i>
          </a>
        </div>
      )
  }
}