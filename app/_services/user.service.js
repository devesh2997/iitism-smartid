import { apiUrl } from '../config'
import { authHeader, handleResponse } from '../_helpers'

export const userService = {
  getAll,
  get,
  create
}

function getAll () {
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(`${apiUrl}/users`, requestOptions).then(handleResponse)
}

function get (admn_no) {
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(`${apiUrl}user/${admn_no}`, requestOptions).then(handleResponse)
}

function create(body){
  const requestOptions = { method: 'POST', headers: authHeader(), body: JSON.stringify(body) }
  return fetch(`${apiUrl}users`, requestOptions).then(handleResponse)
}