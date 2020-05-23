import { authenticationService } from '../_services'

export function appendJWTToUrl (url) {
  // return authorization header with jwt token
  const currentUser = authenticationService.currentUserValue
  if (url[url.length - 1] === '?') {
    return url + 'jwt=' + currentUser.token
  } else {
    return url + '&' + 'jwt=' + currentUser.token
  }
  if (currentUser && currentUser.token) {
    if (url[url.length - 1] === '?') {
      return url + 'jwt=' + currentUser.token
    } else {
      return url + '&' + 'jwt=' + currentUser.token
    }
  } else {
    return ''
  }
}
