import { createServer } from "http"
import {
  access,
  createReadStream,
} from "fs"
import { resolve, join }  from "path"
import connect from "connect"
import serveStatic from "serve-static"
import favicon from "serve-favicon"
import bodyParser from "body-parser"
import queryParser from "./utils/query-parser"

const HTTP_SERVER_PORT = 3000

const app = connect()
const server = createServer(app)

app.use(serveStatic("app/static", { "index": [ "index.html" ] }))

app.use(favicon(resolve("public/favicon.ico")))

app.use(bodyParser.json())

app.use(queryParser())


/*
 * Mock table
 *
 */

let items = [ ]

insertItem.id = 0

function insertItem (item) {
  const insertingItem = {
    id: insertItem.id++,
    ...item,
    createdIn: new Date().toJSON()
  }

  items.push(insertingItem)
}

function removeItem (removeItemId) {
  items.forEach((item, index, items) => {
    const { id } = item

    if (id === removeItemId) items.splice(index, 1)
  })
}

function insertAsync (callback) {
  setTimeout(() => {
    const item = {
      title: `title ${(Math.random() * 100).toFixed(0)}`,
      description: `description ${(Math.random() * 100).toFixed(0)}`
    }

    insertItem(item)

    callback && callback()
  }, 5)
}

let insertedCount = 0

function inserterAsync () {
  if (insertedCount++ < 15) insertAsync(inserterAsync)
}

insertAsync(inserterAsync)

app.use("/table", (req, res) => {
  const { method } = req

  switch (method) {
    case "GET":
      const { query: { filter, propsFilters, sort, reverse, from, to, requiredTime } } = req
      const filterInLowerCase = filter && filter.toLowerCase()
      const filteredItems = items.filter((item) => {
        for (const key in item) {
          let value = item[key]

          if (value) {
            if (!(typeof value === "string")) value = value.toString()

            value = value.toLowerCase()

            if (value.includes(filterInLowerCase)) return true
          }
        }
      })
      let propsFilteredItems = filteredItems

      propsFilters.forEach((filterSettings) => {
        const { key: filterKey, filter: filterValue } = filterSettings
        const filterValueInLowerCase = filterValue && filterValue.toLowerCase()

        if (filterValueInLowerCase) {
          propsFilteredItems = propsFilteredItems.filter((item) => {
            let value = item[ filterKey ]

            if (value) {
              if (!(typeof value === "string")) value = value.toString()

              value = value.toLowerCase()

              return value.includes(filterValueInLowerCase)
            }
          })
        }
      })

      const sorteredItems = propsFilteredItems.sort((previousItem, nextItem) => {
        const previousItemValue = previousItem[sort]
        const nextItemValue = nextItem[sort]

        if (reverse !== "true") {
          if (previousItemValue > nextItemValue) return 1
          else if (previousItemValue < nextItemValue) return -1
          else return 0
        } else {
          if (previousItemValue < nextItemValue) return 1
          else if (previousItemValue > nextItemValue) return -1
          else return 0
        }
      })
      const slicedItems = sorteredItems.slice(from, to)
      const data = {
        items: slicedItems,
        count: sorteredItems.length,
        requiredTime
      }
      const dataJSON = JSON.stringify(data)

      res.end(dataJSON)

      break
    case "POST":
      const { body: item } = req

      insertItem(item)

      res.end()

      break
    case "DELETE":
      const { url } = req
      const removeItemId = parseInt(url.slice(1))

      removeItem(removeItemId)

      res.end()

      break
  }
})

app.use((req, res) => {
  res.end("Page is not defined")
})

server.listen(HTTP_SERVER_PORT, () => {
  console.info(`listen on port ${HTTP_SERVER_PORT}`)
})

process.on("uncaughtException", (error) => {
  console.error(error.stack)
})