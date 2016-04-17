import { parse as parseURL } from "url"
import { parse as parseQuery } from "qs"

export default function queryParser (options) {
  return function (req, res, next) {
    const { url } = req
    const parsedURL = parseURL(url)
    const { query } = parsedURL
    const parsedQuery = parseQuery(query)

    req.query = parsedQuery

    next()
  }
}