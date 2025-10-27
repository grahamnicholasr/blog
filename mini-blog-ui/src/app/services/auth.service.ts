import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isLoggedIn = signal<boolean>(false);
  isLoggedIn = this._isLoggedIn.asReadonly();

  private readonly TOKEN_NAME = 'access_token';
  private apiUrl = 'http://localhost:8000'; // Your FastAPI backend URL

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this._isLoggedIn.set(!!this.getToken());
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_NAME, token);
    this._isLoggedIn.set(true);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_NAME);
    this._isLoggedIn.set(false);
  }

  login(credentials: any): Observable<any> {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    return this.http.post(`${this.apiUrl}/token`, formData).pipe(
      tap((response: any) => {
        this.setToken(response.access_token);
        this.snackBar.open('Successful login.', 'Close', {
              duration: 5000,
            });
      })
    );
  }

  signup(credentials: any): Observable<any> {
    const user = {
      username: credentials.username,
      hashed_password: credentials.password
    }
    return this.http.post(`${this.apiUrl}/users/`, user);
  }

  logout(): void {
    this.snackBar.open('You have been logged out.', 'Close', {
              duration: 5000,
            });
    this.removeToken();
  }

  public getAuthorizationToken(): string | null {
    return this.getToken();
  }
}
