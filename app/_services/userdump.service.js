import { apiUrl } from '../config'
import { authHeader, handleResponse } from '../_helpers'

export const userdumpService = {
  getAll,
  get,
  query,
  bulkUpload
}

function getAll () {
  console.log(authHeader())
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(`${apiUrl}userdumps`, requestOptions).then(handleResponse)
}

function get (admn_no) {
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(`${apiUrl}userdump/${admn_no}`, requestOptions).then(handleResponse)
}

function query(query) {
  const requestOptions = {method: 'GET', headers: authHeader()}
  return fetch(`${apiUrl}userdump/query/${query}`, requestOptions).then(handleResponse)
}

function bulkUpload (body) {
    console.log(body)
  const requestOptions = { method: 'POST', headers: authHeader(), body: body }
  return fetch(`${apiUrl}userdump/bulk`, requestOptions).then(handleResponse)
}
