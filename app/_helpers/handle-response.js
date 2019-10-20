import { authenticationService } from '../_services'

export function handleResponse (response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text)
    if (!response.ok) {
      if ([401, 403].indexOf(response.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        console.log('wrong')
        authenticationService.logout()
        // location.reload(true)
      }

      const error = (data && data.message) || response.statusText
      return Promise.reject(error)
    }
    console.log(data)
    return data
    // if (data.success) {
    //   return data
    // } else {
    //   authenticationService.logout()
    //   location.reload(true)
    //   const error = (data && data.message) || response.statusText
    //   return Promise.reject(error)
    // }
  })
}
