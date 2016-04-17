import React, { Component } from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import Filter from "./Filter.jsx"
import CreateItem from "./CreateItem.jsx"
import Refresh from "./Refresh.jsx"
import Title from "./CreateItemForm/Title.jsx"
import Description from "./CreateItemForm/Description.jsx"
import Submit from "./CreateItemForm/Submit.jsx"
import Select from "./Select.jsx"
import Sort from "./Sort.jsx"
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
      isCreatingItem
    } = this.props

    return (
      <div>
        <table className="ui inverted table">
          <thead>
            <tr>
              <th>
                <Filter />
              </th>
              <th>
                <CreateItem />
              </th>
              <th></th>
              <th></th>
              <th></th>
              <th>
                <Refresh />
              </th>
            </tr>
            {isCreatingItem &&
              <tr>
                <th></th>
                <th></th>
                <th>
                  <Title />
                </th>
                <th>
                  <Description />
                </th>
                <th></th>
                <th>
                  <Submit />
                </th>
              </tr>
            }
            <tr>
              <th>
                <Select />
              </th>
              <th>
                <Sort title="id" sortKey="id" />
              </th>
              <th>
                <Sort title="title" sortKey="title" />
              </th>
              <th>
                <Sort title="description" sortKey="description" />
              </th>
              <th>
                <Sort title="created in" sortKey="createdIn" />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((immutableItem) => {
              const item = immutableItem.toObject()
              const { id } = item

              return <Item key={id} {...item} />
            })}
          </tbody>
          <tfoot>
            <tr>
              <Pagination />
              <th></th>
              <th></th>
              <th></th>
              <th></th>
              <PerPage />
            </tr>
          </tfoot>
        </table>
        <Loading />
      </div>
    )
  }
}

function mapStateToProps ({ table }) {
  return {
    items: table.get("items"),
    isCreatingItem: table.getIn([ "createItem", "isActive" ])
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ fetchData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)