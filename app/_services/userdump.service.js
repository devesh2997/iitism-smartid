import { apiUrl } from '../config'
import { authHeader, handleResponse } from '../_helpers'

export const userdumpService = {
  getAll,
  bulkUpload
}

function getAll () {
  const requestOptions = { method: 'GET', headers: authHeader() }
  return fetch(`${apiUrl}/userdumps`, requestOptions).then(handleResponse)
}

function bulkUpload (body) {
    console.log(body)
  const requestOptions = { method: 'POST', headers: authHeader(), body: body }
  return fetch(`${apiUrl}userdump/bulk`, requestOptions).then(handleResponse)
}
