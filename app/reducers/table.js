import { fromJS } from "immutable"
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

const initialState = fromJS({
  isFetching: false,
  isResponseError: false,
  items: [ ],
  query: {
    filter: null,
    sort: "createdIn",
    reverse: true,
    limit: 5
  },
  params: {
    page: 1,
    pages: null,
    selectedInPage: null,
    selectedCount: null,
    selectedIsRemoving: false
  },
  createItem: {
    isActive: false,
    isResponseError: false,
    form: {
      title: null,
      description: null
    },
    isUploading: false
  },
  itemsSettings: [ ]
})

export default function (state = initialState, action) {
  switch (action.type) {
    case TABLE_REQUEST:
      return state.set("isFetching", true)
    case TABLE_RESPONSE:
      state = response(state, action.items, action.pages)
      return selectedInPage(state)
    case TABLE_RESPONSE_ERROR:
      return state.merge({
        "isFetching": false,
        "isResponseError": true
      })
    case TABLE_CHANGE_FILTER:
      return state.setIn([ "query", "filter" ], action.filter)
    case TABLE_CHANGE_SORT:
      return state.mergeDeep({
        query: {
          sort: action.sort,
          reverse: false
        }
      })
    case TABLE_CHANGE_REVERSE:
      return state.setIn([ "query", "reverse" ], action.reverse)
    case TABLE_CHANGE_LIMIT:
      return state.setIn([ "query", "limit" ], action.limit)
    case TABLE_CHANGE_PAGE:
      return state.setIn([ "params", "page" ], action.page)
    case TABLE_SELECT_ITEM:
      state = state.update("itemsSettings", (itemsSettings) => itemSettingsSetter(itemsSettings, { id: action.id, operation: "selected", value: true }))
      state = updateSelectedCount(state)
      return selectedInPage(state)
    case TABLE_UNSELECT_ITEM:
      state = state.update("itemsSettings", itemsSettings => itemSettingsSetter(itemsSettings, { id: action.id, operation: "selected", value: false }))
      state = updateSelectedCount(state)
      return selectedInPage(state)
    case TABLE_SELECT_ALL_ITEMS_IN_PAGE:
      state = state.update("itemsSettings", itemsSettings => itemsSettingsSetter(itemsSettings, { ids: action.ids, operation: "selected", value: true }))
      state = updateSelectedCount(state)
      return selectedInPage(state)
    case TABLE_UNSELECT_ALL_ITEMS_IN_PAGE:
      state = state.update("itemsSettings", itemsSettings => itemsSettingsSetter(itemsSettings, { ids: action.ids, operation: "selected", value: false }))
      state = updateSelectedCount(state)
      return selectedInPage(state)
    case TABLE_UNSELECT_ALL_SELECTED_ITEMS:
      state = state.update("itemsSettings", itemsSettings => itemsSettingsSetterWhere(itemsSettings, { where: "selected", value: true }, { operation: "selected", value: false }))
      state = updateSelectedCount(state)
      return selectedInPage(state)
    case TABLE_CREATE_ITEM:
      return state.setIn([ "createItem", "isActive" ], true)
    case TABLE_CANCEL_CREATE_ITEM:
      return state.setIn([ "createItem", "isActive" ], false)
    case TABLE_CREATED_ITEM_CHANGE_TITLE:
      return state.setIn([ "createItem", "form", "title" ], action.title)
    case TABLE_CREATED_ITEM_CHANGE_DESCRIPTION:
      return state.setIn([ "createItem", "form", "description" ], action.description)
    case TABLE_CREATED_ITEM_SUBMIT:
      return state.setIn([ "createItem", "isUploading" ], true)
    case TABLE_CREATED_ITEM_RESPONSE:
      return state.mergeDeep({
        createItem: {
          isUploading: false,
          isResponseError: false,
          form: {
            title: null,
            description: null
          }
        }
      })
    case TABLE_CREATED_ITEM_RESPONSE_ERROR:
      return state.mergeDeep({
        "createItem": {
          isUploading: false,
          "isResponseError": true
        }
      })
    case TABLE_REMOVE_ITEM_REQUEST:
      return state.update("itemsSettings", itemsSettings => itemSettingsSetter(itemsSettings, { id: action.id, operation: "isRemoving", value: true }))
    case TABLE_REMOVE_ITEM_RESPONSE:
      return state.update("itemsSettings", itemsSettings => itemsSettingsRemoveWhere(itemsSettings, { where: "id", value: action.id }))
    case TABLE_REMOVE_ITEM_RESPONSE_ERROR:
      return state.update("itemsSettings", itemsSettings => itemSettingsSetter(itemsSettings, { id: action.id, operation: "isRemoving", value: false }))
                  .update("itemsSettings", itemsSettings => itemSettingsSetter(itemsSettings, { id: action.id, operation: "isRemoveResponseError", value: true }))
    case TABLE_REQUEST_REMOVE_ALL_SELECTED_ITEMS:
      state = state.setIn([ "params", "selectedIsRemoving" ], true)
      return state.update("itemsSettings", itemsSettings => itemsSettingsSetterWhere(itemsSettings, { where: "selected", value: true }, { operation: "isRemoving", value: true }))
    case TABLE_REMOVE_ALL_SELECTED_ITEMS_RESPONSE:
      return state.setIn([ "params", "selectedIsRemoving" ], false)
    default:
      return state
  }
}

function response (state, items, pages) {
  return state
    .set("isFetching", false)
    .set("isResponseError", false)
    .set("items", fromJS(items))
    .setIn([ "params", "pages" ], pages)
}

function checkRealPage (pages, page) {
  return page > pages ? pages : page
}

function itemSettingsSetter (itemsSettings, options) {
  const { id, operation, value } = options

  const itemSettingsIndex = itemsSettings.findIndex(itemSettings => itemSettings.get("id") === id)

  if (itemSettingsIndex >= 0) {
    return itemsSettings.setIn([ itemSettingsIndex, operation ], value)
  } else {
    const itemSettings = fromJS({
      id,
      [ operation ]: value
    })

    return itemsSettings.push(itemSettings)
  }
}

function itemsSettingsSetter (itemsSettings, options) {
  const { ids, operation, value } = options

  ids.forEach((id) => {
    const settingsOptions = {
      id,
      operation,
      value
    }

    itemsSettings = itemSettingsSetter(itemsSettings, settingsOptions)
  })

  return itemsSettings
}

function itemsSettingsSetterWhere (itemsSettings, whereOptions, setOptions) {
  const {
    where,
    value: whereValue
  } = whereOptions
  const {
    operation,
    value
  } = setOptions

  return itemsSettings.map((itemSettings) => {
    const currentWhereValue = itemSettings.get(where)

    if (whereValue === currentWhereValue) {
      return itemSettings.set(operation, value)
    }
    else return itemSettings
  })
}

function updateSelectedCount (state) {
  const selected = state.get("itemsSettings").filter(itemSettings => itemSettings.get("selected"))
  const selectedCount = selected.count()
  
  return state.setIn([ "params", "selectedCount" ], selectedCount)
}

function itemsSettingsRemoveWhere (itemsSettings, whereOptions) {
  const {
    where,
    value: whereValue
  } = whereOptions

  return itemsSettings.filter((itemSettings) => {
    const currentWhereValue = itemSettings.get(where)

    return whereValue !== currentWhereValue
  })
}

function selectedInPage (state) {
  const itemsSettings = state.get("itemsSettings")
  const selectedInPage = state.get("items").find((item) => {
    return itemsSettings.find(itemSettings => itemSettings.get("id") === item.get("id") && itemSettings.get("selected"))
  })

  return state.setIn([ "params", "selectedInPage" ], selectedInPage)
}