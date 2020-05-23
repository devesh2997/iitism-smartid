import { apiUrl } from '../config'
import { authHeader, handleResponse } from '../_helpers'

export const merchantService = {
  getAll,
  get,
  create
}

function getAll () {
  console.log(authHeader())
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(`${apiUrl}merchants`, requestOptions).then(handleResponse)
}

function get (merchant_id) {
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(`${apiUrl}merchant/${merchant_id}`, requestOptions).then(
    handleResponse
  )
}

function create (body) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: body
  }
  return fetch(`${apiUrl}merchants`, requestOptions).then(handleResponse)
}
