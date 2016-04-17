import {
  TABLE_REQUEST,
  TABLE_RESPONSE,
  TABLE_RESPONSE_ERROR,
  TABLE_SELECT_ITEM,
  TABLE_UNSELECT_ITEM,
  TABLE_REMOVE_ITEM_REQUEST,
  TABLE_REMOVE_ITEM_RESPONSE,
  TABLE_REMOVE_ITEM_RESPONSE_ERROR,
  TABLE_CHANGE_FILTER,
  TABLE_CHANGE_SORT,
  TABLE_CHANGE_REVERSE,
  TABLE_CHANGE_LIMIT,
  TABLE_CHANGE_PAGE,
  TABLE_CREATE_ITEM,
  TABLE_CANCEL_CREATE_ITEM,
  TABLE_CREATED_ITEM_CHANGE_TITLE,
  TABLE_CREATED_ITEM_CHANGE_DESCRIPTION,
  TABLE_CREATED_ITEM_SUBMIT,
  TABLE_CREATED_ITEM_RESPONSE,
  TABLE_CREATED_ITEM_RESPONSE_ERROR,
  TABLE_SELECT_ALL_ITEMS_IN_PAGE,
  TABLE_UNSELECT_ALL_ITEMS_IN_PAGE,
  TABLE_UNSELECT_ALL_SELECTED_ITEMS,
  TABLE_REQUEST_REMOVE_ALL_SELECTED_ITEMS,
  TABLE_REMOVE_ALL_SELECTED_ITEMS_RESPONSE
} from "constants/table"
import fetch from "isomorphic-fetch"
import { stringify } from "qs"

export function request () {
  return {
    type: TABLE_REQUEST
  }
}

export function response (items, pages) {
  return {
    type: TABLE_RESPONSE,
    items,
    pages
  }
}

export function responseError () {
  return {
    type: TABLE_RESPONSE_ERROR
  }
}

function fetchHelper (dispatch, getState, forceUpdate) {
  const state = getState()
  const { table } = state
  const stateQueryImmutable = table.get("query")
  const stateQuery = stateQueryImmutable.toObject()
  const { filter, sort, reverse, limit } = stateQuery
  const paramsImmutable = table.get("params")
  const params = paramsImmutable.toObject()
  const { page } = params
  const from = (page - 1) * limit
  const to = page * limit
  const queryData = { filter, sort, reverse, from, to }
  const query = stringify(queryData)
  const requiredTime = Date.now()
  const queryDataWithRequiredTime = { ...queryData, requiredTime }
  const queryWithRequiredTime = stringify(queryDataWithRequiredTime)
  const { lastQuery } = fetchHelper

  if (forceUpdate || query !== lastQuery) {
    dispatch(request())

    fetch(`/table?${queryWithRequiredTime}`)
      .then((response) => {
        if (response.status >= 400) dispatch(responseError())
        else return response.json()
      })
      .then((data) => {
        const { requiredTime: responseRequiredTime, items, count } = data
        const { ceil } = Math
        const floatValue = count / limit
        const pages = ceil(floatValue) || 1

        if (page > pages) {
          const realPage = pages

          dispatch(changePageAndFetchData(realPage))
        } else {
          if (requiredTime >= responseRequiredTime) {
            dispatch(response(items, pages))

            fetchHelper.lastQuery = query
          }
        }
      })
  }
}

export function fetchData () {
  return function (dispatch, getState) {
    fetchHelper(dispatch, getState)
  }
}

export function refreshData () {
  return function (dispatch, getState) {
    fetchHelper(dispatch, getState, true)
  }
}

export function selectItem (id) {
  return {
    type: TABLE_SELECT_ITEM,
    id
  }
}

export function unselectItem (id) {
  return {
    type: TABLE_UNSELECT_ITEM,
    id
  }
}

export function requestRemoveItem (id) {
  return {
    type: TABLE_REMOVE_ITEM_REQUEST,
    id
  }
}

export function responseRemoveItem (id) {
  return {
    type: TABLE_REMOVE_ITEM_RESPONSE,
    id
  }
}

export function responseRemoveItemError (id) {
  return {
    type: TABLE_REMOVE_ITEM_RESPONSE_ERROR,
    id
  }
}

export function removeItemAndFetchData (id) {
  return function (dispatch, getState) {
    const state = getState()
    const { table } = state

    dispatch(requestRemoveItem(id))

    fetch(`/table/${id}`, {
      method: "DELETE"
    })
      .then((response) => {
        if (response.status === 200) {
          dispatch(responseRemoveItem(id))

          fetchHelper(dispatch, getState, true)
        } else dispatch(responseRemoveItemError(id))
      })
  }
}

export function changeFilter (filter) {
  return {
    type: TABLE_CHANGE_FILTER,
    filter
  }
}

export function changeFilterAndFetchData (filter) {
  return function (dispatch, getState) {
    dispatch(changeFilter(filter))

    fetchHelper(dispatch, getState)
  }
}

export function changeSort (sort) {
  return {
    type: TABLE_CHANGE_SORT,
    sort
  }
}

export function changeSortAndFetchData (sort) {
  return function (dispatch, getState) {
    dispatch(changeSort(sort))

    fetchHelper(dispatch, getState)
  }
}

export function changeReverse (reverse) {
  return {
    type: TABLE_CHANGE_REVERSE,
    reverse
  }
}

export function changeReverseAndFetchData (reverse) {
  return function (dispatch, getState) {
    dispatch(changeReverse(reverse))

    fetchHelper(dispatch, getState)
  }
}

export function changeLimit (limit) {
  return {
    type: TABLE_CHANGE_LIMIT,
    limit
  }
}

export function changeLimitAndFetchData (limit) {
  return function (dispatch, getState) {
    dispatch(changeLimit(limit))

    fetchHelper(dispatch, getState)
  }
}

export function changePage (page) {
  return {
    type: TABLE_CHANGE_PAGE,
    page
  }
}

export function changePageAndFetchData (page) {
  return function (dispatch, getState) {
    dispatch(changePage(page))

    fetchHelper(dispatch, getState)
  }
}

export function createItem () {
  return {
    type: TABLE_CREATE_ITEM
  }
}

export function cancelCreateItem () {
  return {
    type: TABLE_CANCEL_CREATE_ITEM
  }
}

export function createdItemChangeTitle (title) {
  return {
    type: TABLE_CREATED_ITEM_CHANGE_TITLE,
    title
  }
}

export function createdItemChangeDescription (description) {
  return {
    type: TABLE_CREATED_ITEM_CHANGE_DESCRIPTION,
    description
  }
}

export function submitCreatedItem () {
  return {
    type: TABLE_CREATED_ITEM_SUBMIT
  }
}

export function responseCreatedItem () {
  return {
    type: TABLE_CREATED_ITEM_RESPONSE
  }
}

export function responseCreatedItemError () {
  return {
    type: TABLE_CREATED_ITEM_RESPONSE_ERROR
  }
}

export function submitCreatedItemAndFetchData (item) {
  return function (dispatch, getState) {
    const state = getState()
    const { table } = state
    const createdItemImmutable = table.getIn([ "createItem", "form" ])
    const createdItem = createdItemImmutable.toObject()
    const createdItemJSON = JSON.stringify(createdItem)

    dispatch(submitCreatedItem())

    return fetch("/table", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: createdItemJSON
    })
      .then((response) => {
        if (response.status === 200) {
          dispatch(responseCreatedItem())

          fetchHelper(dispatch, getState, true)
        } else dispatch(responseCreatedItemError())
      })
  }
}

export function selectAllItemsInPage () {
  return function (dispatch, getState) {
    const state = getState()
    const { table } = state
    const items = table.get("items")
    const ids = items.map(item => item.get("id"))
    const action = {
      type: TABLE_SELECT_ALL_ITEMS_IN_PAGE,
      ids
    }

    dispatch(action)
  }
}

export function unselectAllItemsInPage () {
  return function (dispatch, getState) {
    const state = getState()
    const { table } = state
    const items = table.get("items")
    const ids = items.map(item => item.get("id"))
    const action = {
      type: TABLE_UNSELECT_ALL_ITEMS_IN_PAGE,
      ids
    }

    dispatch(action)
  }
}

export function unselectAllSelectedItems () {
  return  {
    type: TABLE_UNSELECT_ALL_SELECTED_ITEMS
  }
}

export function requestRemoveAllSelectedItems () {
  return {
    type: TABLE_REQUEST_REMOVE_ALL_SELECTED_ITEMS
  }
}

export function responseRemoveAllSelectedItems () {
  return {
    type: TABLE_REMOVE_ALL_SELECTED_ITEMS_RESPONSE
  }
}

export function removeSelectedItemsAndFetchData () {
  return function (dispatch, getState) {
    const state = getState()
    const { table } = state
    const itemsSettings = table.get("itemsSettings")
    const ids = itemsSettings.map(itemSettings => itemSettings.get("selected") && itemSettings.get("id"))
  
    dispatch(requestRemoveAllSelectedItems())

    const requests = ids.map((id) => {
      return new Promise((resolve, reject) => {
        fetch(`/table/${id}`, {
          method: "DELETE"
        })
          .then((response) => {
            if (response.status === 200) {
              dispatch(unselectItem(id))

              dispatch(responseRemoveItem(id))

              resolve()
            } else {
              dispatch(responseRemoveItemError(id))

              reject()
            }
          })
      })
    })

    Promise.all(requests).then(() => {
      dispatch(responseRemoveAllSelectedItems())

      fetchHelper(dispatch, getState, true)
    })
  }
}