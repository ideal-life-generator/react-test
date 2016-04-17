import { fromJS } from "immutable"
import caseReducer from "case-reducer"
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

function isAnySelectedInPage (state) {
  const items = state.get("items")
  const itemsSettings = state.get("itemsSettings")

  const selectedItems = items.find((item) => {
    const itemId = item.get("id")

    return itemsSettings.find(itemSettings => itemSettings.get("id") === itemId && itemSettings.get("selected"))
  })

  return Boolean(selectedItems)
}

function selectItem (itemsSettings, id) {
  const itemSettingsIndex = itemsSettings.findIndex(itemSettings => itemSettings.get("id") === id)

  if (itemSettingsIndex >= 0) return itemsSettings.setIn([ itemSettingsIndex, "selected" ], true)
  else {
    const itemSettings = fromJS({
      id,
      selected: true
    })

    return itemsSettings.push(itemSettings)
  }
}

function unselectItem (itemsSettings, id) {
  const itemSettingsIndex = itemsSettings.findIndex(itemSettings => itemSettings.get("id") === id)

  if (itemSettingsIndex >= 0) return itemsSettings.setIn([ itemSettingsIndex, "selected" ], false)
  else return itemsSettings
}

function selectItems (itemsSettings, ids) {
  ids.forEach((id) => {
    itemsSettings = selectItem(itemsSettings, id)
  })

  return itemsSettings
}

function unselectItems (itemsSettings, ids) {
  ids.forEach((id) => {
    itemsSettings = unselectItem(itemsSettings, id)
  })

  return itemsSettings
}

function unselectSelectedItems (itemsSettings) {
  return itemsSettings.map((itemSettings) => itemSettings.get("selected") && itemSettings.set("selected", false))
}

function getSelectedCount (state) {
  const itemsSettings = state.get("itemsSettings")
  const selected = itemsSettings.filter((itemSettings) => itemSettings.get("selected"))
  
  return selected.count()
}

function removingItem (itemsSettings, id) {
  const itemSettingsIndex = itemsSettings.findIndex(itemSettings => itemSettings.get("id") === id)

  if (itemSettingsIndex >= 0) return itemsSettings.setIn([ "itemSettingsIndex", "isRemoving" ], true)
  else {
    const itemSettings = fromJS({
      id,
      isRemoving: true
    })

    return itemsSettings.push(itemSettings)
  }
}

function removeItemSettings (itemsSettings, id) {
  const itemSettingsIndex = itemsSettings.findIndex(itemSettings => itemSettings.get("id") === id)

  return itemsSettings.delete(itemSettingsIndex)
}

function cancelRemoveItem (itemsSettings, id) {
  return itemsSettings.map((itemSettings) => itemSettings.get("isRemoving") && itemSettings.set("isRemoving", false))
}

function removeItemError (itemsSettings, id) {
  const itemSettingsIndex = itemsSettings.findIndex(itemSettings => itemSettings.get("id") === id)

  if (itemSettingsIndex >= 0) {
    return itemsSettings.mergeIn([ itemSettingsIndex ], {
      isRemoving: false,
      "isRemoveResponseError": true
    })
  }
  else {
    const itemSettings = fromJS({
      id,
      isRemoving: false,
      isRemoveResponseError: true
    })

    return itemsSettings.push(itemSettings)
  }
}

const cases = {
  [ TABLE_REQUEST ] (state) {
    return state.set("isFetching", true)
  },

  [ TABLE_RESPONSE ] (state, data) {
    const { items, pages } = data

    state = state
      .mergeDeep({
        isFetching: false,
        isResponseError: false,
        params: { pages }
      })
      .set("items", fromJS(items))

    state = state.setIn([ "params", "selectedCount" ], getSelectedCount(state))

    return state.setIn([ "params", "selectedInPage" ], isAnySelectedInPage(state))
  },

  [ TABLE_RESPONSE_ERROR ] (state) {
    return state.merge({
      "isFetching": false,
      "isResponseError": true
    })
  },

  [ TABLE_CHANGE_FILTER ] (state, data) {
    const { filter } = data

    return state.setIn([ "query", "filter" ], filter)
  },

  [ TABLE_CHANGE_SORT ] (state, data) {
    const { sort } = data

    return state.mergeDeep({
      query: {
        sort,
        reverse: false
      }
    })
  },

  [ TABLE_CHANGE_REVERSE ] (state, data) {
    const { reverse } = data

    return state.setIn([ "query", "reverse" ], reverse)
  },

  [ TABLE_CHANGE_LIMIT ] (state, data) {
    const { limit } = data

    return state.setIn([ "query", "limit" ], limit)
  },

  [ TABLE_CHANGE_PAGE ] (state, data) {
    const { page } = data

    return state.setIn([ "params", "page" ], page)
  },

  [ TABLE_SELECT_ITEM ] (state, data) {
    const { id } = data

    state = state.update("itemsSettings", itemsSettings => selectItem(itemsSettings, id))
    state = state.setIn([ "params", "selectedCount" ], getSelectedCount(state))

    return state.setIn([ "params", "selectedInPage" ], isAnySelectedInPage(state))
  },

  [ TABLE_UNSELECT_ITEM ] (state, data) {
    const { id } = data
    
    state = state.update("itemsSettings", itemsSettings => unselectItem(itemsSettings, id))
    state = state.setIn([ "params", "selectedCount" ], getSelectedCount(state))

    return state.setIn([ "params", "selectedInPage" ], isAnySelectedInPage(state))
  },

  [ TABLE_SELECT_ALL_ITEMS_IN_PAGE ] (state, data) {
    const { ids } = data
    
    state = state.update("itemsSettings", itemsSettings => selectItems(itemsSettings, ids))
    state = state.setIn([ "params", "selectedCount" ], getSelectedCount(state))

    return state.setIn([ "params", "selectedInPage" ], isAnySelectedInPage(state))
  },

  [ TABLE_UNSELECT_ALL_ITEMS_IN_PAGE ] (state, data) {
    const { ids } = data
    
    state = state.update("itemsSettings", itemsSettings => unselectItems(itemsSettings, ids))
    state = state.setIn([ "params", "selectedCount" ], getSelectedCount(state))

    return state.setIn([ "params", "selectedInPage" ], isAnySelectedInPage(state))
  },

  [ TABLE_UNSELECT_ALL_SELECTED_ITEMS ] (state) {
    state = state.update("itemsSettings", itemsSettings => unselectSelectedItems(itemsSettings))
    state = state.setIn([ "params", "selectedCount" ], getSelectedCount(state))

    return state.setIn([ "params", "selectedInPage" ], isAnySelectedInPage(state))
  },

  [ TABLE_CREATE_ITEM ] (state) {
    return state.setIn([ "createItem", "isActive" ], true)
  },

  [ TABLE_CANCEL_CREATE_ITEM ] (state) {
    return state.setIn([ "createItem", "isActive" ], false)
  },

  [ TABLE_CREATED_ITEM_CHANGE_TITLE ] (state, data) {
    const { title } = data

    return state.setIn([ "createItem", "form", "title" ], title)
  },

  [ TABLE_CREATED_ITEM_CHANGE_DESCRIPTION ] (state, data) {
    const { description } = data

    return state.setIn([ "createItem", "form", "description" ], description)
  },

  [ TABLE_CREATED_ITEM_SUBMIT ] (state) {
    return state.setIn([ "createItem", "isUploading" ], true)
  },

  [ TABLE_CREATED_ITEM_RESPONSE ] (state) {
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
  },

  [ TABLE_CREATED_ITEM_RESPONSE_ERROR ] (state) {
    return state.mergeDeep({
      "createItem": {
        isUploading: false,
        "isResponseError": true
      }
    })
  },

  [ TABLE_REMOVE_ITEM_REQUEST ] (state, data) {
    const { id } = data

    return state.update("itemsSettings", itemsSettings => removingItem(itemsSettings, id))
  },

  [ TABLE_REMOVE_ITEM_RESPONSE ] (state, data) {
    const { id } = data

    return state.update("itemsSettings", itemsSettings => removeItemSettings(itemsSettings, id))
  },

  [ TABLE_REMOVE_ITEM_RESPONSE_ERROR ] (state, data) {
    const { id } = data

    return state.update("itemsSettings", itemsSettings => removeItemError(itemsSettings, id))
  },

  [ TABLE_REQUEST_REMOVE_ALL_SELECTED_ITEMS ] (state) {
    return state.setIn([ "params", "selectedIsRemoving" ], true)
  },

  [ TABLE_REMOVE_ALL_SELECTED_ITEMS_RESPONSE ] (state) {
    return state.setIn([ "params", "selectedIsRemoving" ], false)
  }
}

export default caseReducer(initialState, cases)