import { authenticationService } from '../_services';

//function that return request headers along with the jwt token received after logging in with the api
export function authHeader() {
    // return authorization header with jwt token
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}`, "Content-Type": "application/json" };
    } else {
        return {};
    }
}