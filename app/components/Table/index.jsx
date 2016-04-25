import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import classNames from "classnames"
import Filter from "./Filter.jsx"
import Create from "./Create.jsx"
import Refresh from "./Refresh.jsx"
import Selected from "./Selected.jsx"
import Remove from "./Remove.jsx"
import HideColumn from "./HideColumn.jsx"
import ShowColumn from "./ShowColumn.jsx"
import CreateForm from "./CreateForm"
import Unselect from "./Unselect.jsx"
import Select from "./Select.jsx"
import Sort from "./Sort.jsx"
import PersonalFilter from "./PersonalFilter.jsx"
import Item from "./Item.jsx"
import Pagination from "./Pagination.jsx"
import PerPage from "./PerPage.jsx"
import Loader from "./Loader.jsx"
import { fetchData } from "actions/table"
import { changeSortAndFetchData, changeReverseAndFetchData } from "actions/table"

import "semantic-ui-reset/reset.css"
import "semantic-ui-grid/grid.css"
import "semantic-ui-container/container.css"
import "semantic-ui-menu/menu.css"
import "semantic-ui-table/table.css"
import "semantic-ui-loader/loader.css"
import "semantic-ui-icon/icon.css"
import "semantic-ui-input/input.css"
import "semantic-ui-button/button.css"
import "semantic-ui-form/form.css"
import "semantic-ui-header/header.css"
import "semantic-ui-checkbox/checkbox.css"
import "semantic-ui-segment/segment.css"
import "semantic-ui-loader/loader.css"

function mapStateToProps ({ table }) {
  return {
    items: table.get("items"),
    showCheckbox: table.getIn([ "params", "columns", "checkbox" ]),
    showId: table.getIn([ "params", "columns", "id" ]),
    showTitle: table.getIn([ "params", "columns", "title" ]),
    showDescription: table.getIn([ "params", "columns", "description" ]),
    showCreatedIn: table.getIn([ "params", "columns", "createdIn" ]),
    showRemove: table.getIn([ "params", "columns", "remove" ]),
    isCreatingItem: table.getIn([ "create", "isActive" ]),
    sort: table.getIn([ "query", "sort" ]),
    reverse: table.getIn([ "query", "reverse" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchData,
    changeSort: changeSortAndFetchData,
    changeReverse: changeReverseAndFetchData
  }, dispatch)
}

export default class Table extends Component {
  componentWillMount () {
    const { fetchData } = this.props

    fetchData()
  }

  render () {
    const {
      props: {
        items,
        showCheckbox,
        showId,
        showTitle,
        showDescription,
        showCreatedIn,
        showRemove,
        isCreatingItem
      }
    } = this

    return (
      <div className="ui container centered">
        {isCreatingItem && <CreateForm />}
        <table className="ui compact sortable celled definition table">
          <thead className="full-width">
            <tr>
              <th className="collapsing non-sortable">
                <Filter />
              </th>
              {showId && <Sort sortKey="id" title="Id" />}
              {showTitle && <Sort sortKey="title" title="Title" />}
              {showDescription && <Sort sortKey="description" title="Description" />}
              {showCreatedIn && <Sort sortKey="createdIn" title="Created in" />}
              <th className="collapsing non-sortable">
                <Refresh />
              </th>
            </tr>
            <tr>
              <th className="non-sortable">
                <Select />
              </th>
              {showId && <PersonalFilter filterKey="id" placeholder="Id..." />}
              {showTitle && <PersonalFilter filterKey="title" placeholder="Title..." />}
              {showDescription && <PersonalFilter filterKey="description" placeholder="Description..." />}
              {showCreatedIn && <PersonalFilter filterKey="createdIn" placeholder="Created in..." />}
              <th className="collapsing non-sortable"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((immutableItem) => {
              const item = immutableItem.toObject()
              const { id } = item
              return <Item key={id} {...item} />
            })}
          </tbody>
          <tfoot className="full-width">
            <tr>
              <th>
                {!showId && <ShowColumn column="id" title="Id" />}
                {!showTitle && <ShowColumn column="title" title="Title" />}
                {!showDescription && <ShowColumn column="description" title="Description" />}
                {!showCreatedIn && <ShowColumn column="createdIn" title="Created in" />}
              </th>
              {showId &&
                <th>
                  <HideColumn column="id" />
                </th>
              }
              {showTitle &&
                <th>
                  <HideColumn column="title" />
                </th>
              }
              {showDescription &&
                <th>
                  <HideColumn column="description" />
                </th>
              }
              {showCreatedIn &&
                <th>
                  <HideColumn column="createdIn" />
                </th>
              }
              <th></th>
            </tr>
            <tr>
              <th>
                <Selected />
              </th>
              <th colSpan="5">
                <Create />
                <Unselect />
                <Remove />
              </th>
            </tr>
            <tr>
              <th colSpan="6">
                <Pagination />
                <PerPage />
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)