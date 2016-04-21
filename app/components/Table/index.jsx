import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Filter from "./Filter.jsx"
import CreateItem from "./CreateItem.jsx"
import Refresh from "./Refresh.jsx"
import HideColumn from "./HideColumn.jsx"
import ShowColumn from "./ShowColumn.jsx"
import Title from "./CreateItemForm/Title.jsx"
import Description from "./CreateItemForm/Description.jsx"
import Submit from "./CreateItemForm/Submit.jsx"
import Select from "./Select.jsx"
import Sort from "./Sort.jsx"
import PersonalFilter from "./PersonalFilter.jsx"
import Item from "./Item.jsx"
import Pagination from "./Pagination.jsx"
import PerPage from "./PerPage.jsx"
import Loading from "./Loading.jsx"
import { fetchData } from "actions/table"

// import "semantic-ui-table/table.css"

export default class Table extends Component {
  componentWillMount () {
    const { fetchData } = this.props

    fetchData()
  }

  render () {
    const {
      items,
      showCheckbox,
      showId,
      showTitle,
      showDescription,
      showCreatedIn,
      showRemove,
      isCreatingItem
    } = this.props

    return (
      <div>
        <header>
          <Filter />
          <CreateItem />
          <Refresh />
        </header>
        <br />
        {isCreatingItem &&
          <div>
            <Title />
            <Description />
            <Submit />
          </div>
        }
        <div>
          {!showCheckbox && <ShowColumn column="checkbox" title="show checkbox" />}
          {!showId && <ShowColumn column="id" title="show id" />}
          {!showTitle && <ShowColumn column="title" title="show title" />}
          {!showDescription && <ShowColumn column="description" title="show description" />}
          {!showCreatedIn && <ShowColumn column="createdIn" title="show created in" />}
          {!showRemove && <ShowColumn column="remove" title="show remove" />}
        </div>
        <table className="ui inverted table">
          <thead>
            <tr>
              {showCheckbox &&
                <th>
                  <Select />
                  <HideColumn column="checkbox" />
                </th>
              }
              {showId &&
                <th>
                  <Sort title="id" sortKey="id" />
                  <PersonalFilter filterKey="id" />
                  <HideColumn column="id" />
                </th>
              }
              {showTitle &&
                <th>
                  <Sort title="title" sortKey="title" />
                  <PersonalFilter filterKey="title" />
                  <HideColumn column="title" />
                </th>
              }
              {showDescription &&
                <th>
                  <Sort title="description" sortKey="description" />
                  <PersonalFilter filterKey="description" />
                  <HideColumn column="description" />
                </th>
              }
              {showCreatedIn &&
                <th>
                  <Sort title="created in" sortKey="createdIn" />
                  <PersonalFilter filterKey="createdIn" />
                  <HideColumn column="createdIn" />
                </th>
              }
              {showRemove &&
                <th>
                  <HideColumn column="remove" />
                </th>
              }
            </tr>
          </thead>
          <tbody>
            {items.map((immutableItem) => {
              const item = immutableItem.toObject()
              const { id } = item

              return <Item key={id} {...item} />
            })}
          </tbody>
        </table>
        <Pagination />
        <PerPage />
        <Loading />
      </div>
    )
  }
}

function mapStateToProps ({ table }) {
  return {
    items: table.get("items"),
    showCheckbox: table.getIn([ "params", "columns", "checkbox" ]),
    showId: table.getIn([ "params", "columns", "id" ]),
    showTitle: table.getIn([ "params", "columns", "title" ]),
    showDescription: table.getIn([ "params", "columns", "description" ]),
    showCreatedIn: table.getIn([ "params", "columns", "createdIn" ]),
    showRemove: table.getIn([ "params", "columns", "remove" ]),
    isCreatingItem: table.getIn([ "createItem", "isActive" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)