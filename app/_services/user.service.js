import { apiUrl } from '../config'
import { authHeader, handleResponse, appendJWTToUrl } from '../_helpers'

export const userService = {
  getAll,
  get,
  create,
  credit
}

function getAll () {
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(appendJWTToUrl(`${apiUrl}/users?`), requestOptions).then(
    handleResponse
  )
}

function get (admn_no) {
  const requestOptions = { method: 'GET', headers: authHeader() }
  const url = `${apiUrl}user/getById?id=${admn_no}`
  console.log('url',url)
  return fetch(
    appendJWTToUrl(url),
    requestOptions
  ).then(handleResponse)
}

function create (user) {
  const id = user.id
  const smartid_no = user.smartid_no
  const requestOptions = {
    method: 'GET'
  }
  return fetch(
    appendJWTToUrl(
      `${apiUrl}user/initSmartId?id=${id}&smartid_no=${smartid_no}`
    ),
    requestOptions
  ).then(handleResponse)
}

function credit (body) {
  const requestOptions = {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(body)
  }
  return fetch(`${apiUrl}transactions/credit`, requestOptions).then(
    handleResponse
  )
}
