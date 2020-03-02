import { BehaviorSubject } from 'rxjs'

import { apiUrl } from '../config'
import { handleResponse } from '../_helpers'

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem('currentUser'))
)

export const authenticationService = {
  login,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue () {
    return currentUserSubject.value
  }
}

function login (id, password) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({ id: id, password: password }),
    mode: 'cors'
  }

  return fetch(
    `${apiUrl}user/login.php?id=${id}&password=${password}`,
    requestOptions
  )
    .then(handleResponse)
    .then(data => {
      console.log('datahere', data)
      if (!data) throw 'Login failed.'
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      // console.log(user)
      let admin = { ...data.admin }
      admin['token'] = data.jwt
      console.log(admin)
      localStorage.setItem('currentUser', JSON.stringify(admin))
      console.log('getting', localStorage.getItem('currentUser'))
      currentUserSubject.next(admin)

      return admin
    })
}

function logout () {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser')
  currentUserSubject.next(null)
}
