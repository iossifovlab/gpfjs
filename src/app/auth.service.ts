import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config/config.service';
import { Observable, Subject, take, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import pkceChallenge from 'pkce-challenge';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private readonly options = { headers: this.headers };
  private accessToken = '';
  private refreshAccessToken = '';

  public tokenExchangeSubject = new Subject<boolean>();

  public constructor(
    private http: HttpClient,
    private config: ConfigService,
    private router: Router,
    @Inject(APP_BASE_HREF) private baseHref: string
  ) {
    this.accessToken = localStorage.getItem('access_token') || '';
    this.refreshAccessToken = localStorage.getItem('refresh_token') || '';
  }

  public getAccessToken(): string {
    return this.accessToken;
  }

  public generatePKCE(): string {
    const pkce = pkceChallenge();
    localStorage.setItem('code_verifier', pkce['code_verifier']);
    return pkce['code_challenge'];
  }

  public requestAccessToken(code: string): Observable<object> {
    return this.http.post(`${this.config.rootUrl}${this.baseHref}o/token/`, {
      client_id: this.config.oauthClientId,
      code: code,
      grant_type: 'authorization_code',
      code_verifier: localStorage.getItem('code_verifier'),
    }, this.options).pipe(take(1), tap(res => {
      this.setTokens(res);
      localStorage.removeItem('code_verifier');
      // Remove auth code from query params and refresh navigation
      this.router.navigate([], {
        queryParams: {'code': null},
        queryParamsHandling: 'merge'
      });
      this.tokenExchangeSubject.next(true);
    }));
  }

  public revokeAccessToken(): Observable<object> {
    return this.http.post(`${this.config.rootUrl}${this.baseHref}o/revoke_token/`, {
      client_id: this.config.oauthClientId,
      token: this.accessToken,
    }, this.options).pipe(take(1), tap(this.clearTokens));
  }

  public clearTokens(): void {
    this.accessToken = '';
    this.refreshAccessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  public refreshToken(): Observable<object> {
    if (this.refreshAccessToken !== '') {
      return this.http.post(`${this.config.rootUrl}${this.baseHref}o/token/`, {
        grant_type: 'refresh_token',
        client_id: this.config.oauthClientId,
        refresh_token: this.refreshAccessToken,
      }, this.options).pipe(
        take(1),
        tap(res => {
          this.setTokens(res);
        }),
        catchError((err, caught) => {
          if (err.status === 400 && err.error.error === 'invalid_grant') {
            this.clearTokens();
            window.location.reload();
          }
          return caught;
        })
      );
    } else {
      return of(null);
    }
  }

  private setTokens(res: object): void {
    this.accessToken = res['access_token'];
    this.refreshAccessToken = res['refresh_token'];
    localStorage.setItem('access_token', this.accessToken);
    localStorage.setItem('refresh_token', this.refreshAccessToken);
  }
}
