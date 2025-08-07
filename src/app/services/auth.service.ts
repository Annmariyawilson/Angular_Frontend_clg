import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.baseUrl;
  private authStatus = new BehaviorSubject<boolean>(this.isTokenValid());

  constructor(private http: HttpClient, private router: Router) { }

  signup(name: string, email: string, password: string, code:string): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, { name, email, password , code});
  }

  login(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password, role }).pipe(
      tap((response: any) => {
        if (response.token) {
          const now = new Date().getTime();
          const expiryTime = now + 12 * 60 * 60 * 1000; // 12 hours in milliseconds

          const tokenData = {
            token: response.token,
            expiresAt: expiryTime
          };

          localStorage.setItem('authToken', JSON.stringify(tokenData));
          localStorage.setItem('role', role);
          this.authStatus.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    this.authStatus.next(false);
    this.router.navigate(['/hccmat']); // Redirect to login
  }

  isAuthenticated(): boolean {
    return this.isTokenValid();
  }

  getToken(): string | null {
    const tokenData = localStorage.getItem('authToken');
    if (!tokenData) return null;

    const { token, expiresAt } = JSON.parse(tokenData);
    const now = new Date().getTime();

    if (now > expiresAt) {
      this.logout();
      return null;
    }

    return token;
  }

  private isTokenValid(): boolean {
    const tokenData = localStorage.getItem('authToken');
    if (!tokenData) return false;

    const { expiresAt } = JSON.parse(tokenData);
    const now = new Date().getTime();

    return now < expiresAt;
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
}
