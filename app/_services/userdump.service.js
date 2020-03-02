import { apiUrl } from '../config'
import { authHeader, handleResponse, appendJWTToUrl } from '../_helpers'

export const userdumpService = {
  getAll,
  get,
  query,
  bulkUpload
}

function getAll () {
  console.log(authHeader())
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(appendJWTToUrl(`${apiUrl}user/getAll?`), requestOptions).then(
    handleResponse
  )
}

function get (admn_no) {
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(
    appendJWTToUrl(`${apiUrl}user/getById.php?id=${admn_no}`),
    requestOptions
  ).then(handleResponse)
}

function query (query, prefix) {
  if (prefix === '-') prefix = ''
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(
    appendJWTToUrl(`${apiUrl}user/search.php?s=${query}&prefix=${prefix}`),
    requestOptions
  ).then(handleResponse)
}

function bulkUpload (body) {
  console.log(body)
  const requestOptions = { method: 'POST', headers: authHeader(), body: body }
  return fetch(`${apiUrl}userdump/bulk`, requestOptions).then(handleResponse)
}
