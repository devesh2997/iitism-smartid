import { BehaviorSubject } from 'rxjs';

import {apiUrl} from '../config';
import { handleResponse } from '../_helpers';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`${apiUrl}admins/login`, requestOptions)
        .then(handleResponse)
        .then(data => {
            console.log('datahere',data)
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // console.log(user)
            let admin = {...data.admin}
            admin['token']=data.token
            console.log(admin)
            localStorage.setItem('currentUser', JSON.stringify(admin));
            console.log('getting',localStorage.getItem('currentUser'))
            currentUserSubject.next(admin);

            return admin;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
