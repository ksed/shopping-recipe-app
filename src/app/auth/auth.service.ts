import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { User } from './user.model';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    private authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseApiKey;
    private entryUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseApiKey;

    constructor(private http: HttpClient, private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(this.authUrl, {
            'email': email,
            'password': password,
            'returnSecureToken': true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logIn(email: string, password: string) {
        return this.http.post<AuthResponseData>(this.entryUrl, {
            'email': email,
            'password': password,
            'returnSecureToken': true
        }).pipe(catchError(this.handleError), tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }));
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) { clearTimeout(this.tokenExpirationTimer); }
    }

    autoLogout(expirationDuration: number) {
        // console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => { this.logout(); }, expirationDuration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResp: HttpErrorResponse) {
        let errorMessage = "An unknown error occurred!";
        if (!errorResp.error || !errorResp.error.error) { return throwError(errorMessage); }
        switch (errorResp.error.error.message) {
            case 'EMAIL_EXISTS': errorMessage = "This email is already registered."; break;
            case 'EMAIL_NOT_FOUND': errorMessage = "Invalid credentials. Try signing up."; break;
            case 'INVALID_PASSWORD': errorMessage = "Invalid credentials."; break;
        }
        return throwError(errorMessage);
    }
}
