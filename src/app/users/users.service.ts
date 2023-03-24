
import { throwError as observableThrowError, Observable, Subject, ReplaySubject, of, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from './users';
import { LocationStrategy } from '@angular/common';
import { Store } from '@ngxs/store';
import { StateResetAll } from 'ngxs-reset-plugin';
import { catchError, map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class UsersService {
  private readonly logoutUrl = 'users/logout';
  private readonly userInfoUrl = 'users/get_user_info';
  private readonly resetPasswordUrl = 'users/forgotten_password';
  private readonly usersUrl = 'users';

  private userInfo$ = new ReplaySubject<{}>(1);
  private lastUserInfo = null;

  public usersStreamingFinishedSubject = new Subject();

  public constructor(
    private http: HttpClient,
    private config: ConfigService,
    private cookieService: CookieService,
    private store: Store,
    private locationStrategy: LocationStrategy,
    private authService: AuthService,
  ) {
    this.authService.tokenExchangeSubject.subscribe(() => {
      // Refresh user data when a token arrives
      this.getUserInfo().pipe(take(1)).subscribe(() => {});
    });
  }

  public logout(): Observable<object> {
    const csrfToken = this.cookieService.get('csrftoken');
    const headers = { 'X-CSRFToken': csrfToken };
    const options = { headers: headers, withCredentials: true };

    return this.authService.revokeAccessToken().pipe(
      take(1),
      switchMap(() => { return this.http.post(this.config.baseUrl + this.logoutUrl, {}, options) }),
      tap(() => {
        this.store.dispatch(new StateResetAll());
        window.location.href = this.locationStrategy.getBaseHref();
      })
    );
  }

  public cachedUserInfo() {
    return this.lastUserInfo;
  }

  public getUserInfoObservable(): Observable<any> {
    return this.userInfo$.asObservable();
  }

  public getUserInfo(): Observable<any> {
    const options = { withCredentials: true };

    return this.http.get(this.config.baseUrl + this.userInfoUrl, options).pipe(
      map(res => res),
      tap(userInfo => {
        this.userInfo$.next(userInfo);
        this.lastUserInfo = userInfo;
      })
    );
  }

  public resetPassword(email: string): void {
    const csrfToken = this.cookieService.get('csrftoken');
    const headers = { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json'};

    // Using plain js fetch, because the API end-point does not return JSON
    fetch(
      this.config.baseUrl + this.resetPasswordUrl,
      { body: JSON.stringify({ email: email }), headers: headers, credentials: 'include', method: 'POST'}
    );
  }

  public getAllUsers(): Observable<User[]> {
    const options = { withCredentials: true };

    return this.http.get(this.config.baseUrl + this.usersUrl, options).pipe(
      map(response => User.fromJsonArray(response))
    );
  }

  public getUser(id: number): Observable<User> {
    const options = { withCredentials: true };
    const url = `${this.config.baseUrl}${this.usersUrl}/${id}`;

    return this.http.get(url, options).pipe(
      map(response => User.fromJson(response))
    );
  }

  public updateUser(user: User): Observable<object> {
    const dto = {
      id: user.id,
      name: user.name,
      groups: user.groups,
      hasPassword: user.hasPassword,
    };
    if (!user.id) {
      return observableThrowError('Unknown id...');
    }
    const csrfToken = this.cookieService.get('csrftoken');
    const headers = { 'X-CSRFToken': csrfToken };
    const options = { headers: headers, withCredentials: true };
    const url = `${this.config.baseUrl}${this.usersUrl}/${user.id}`;

    return this.http.put(url, dto, options);
  }

  public createUser(user: User): Observable<User> {
    if (user.id) {
      return observableThrowError('Create should not have user id');
    }

    // if (!this.isEmailValid(user.email)) {
    //   return observableThrowError(new Error(
    //     'Invalid email address entered. Please use a valid email address.'
    //   ));
    // }

    // if (!this.isNameValid(user.name)) {
    //   return observableThrowError(new Error(
    //     'Name field cannot be empty.'
    //   ));
    // }

    const csrfToken = this.cookieService.get('csrftoken');
    const headers = { 'X-CSRFToken': csrfToken };
    const options = { headers: headers, withCredentials: true };

    return this.http.post(this.config.baseUrl + this.usersUrl, user, options).pipe(
      map(response => User.fromJson(response)),
      catchError(error => {
        return observableThrowError(new Error(error.error.email));
      })
    );
  }

  public deleteUser(user: User): Observable<object> {
    if (!user.id) {
      return observableThrowError('No user id');
    }
    const url = `${this.config.baseUrl}${this.usersUrl}/${user.id}`;
    const options = { withCredentials: true };

    return this.http.delete(url, options);
  }

  public removeUserGroup(user: User, group: string): Observable<object> {
    const clone = user.clone();
    clone.groups = clone.groups.filter(grp => grp !== group);
    return this.updateUser(clone);
  }

  public getUsers(page: number, searchTerm: string): Observable<User[]> {
    let url = `${this.config.baseUrl}${this.usersUrl}?page=${page}`;
    if (searchTerm) {
      const searchParams = new HttpParams().set('search', searchTerm);
      url += `&${searchParams.toString()}`;
    }

    return this.http.get<User[]>(url).pipe(
      map((response) => {
        if (response === null) {
          return [] as User[];
        }
        return response.map(user => {
          const usr = User.fromJson(user);
          // Finding and fixing duplicate dataset names
          usr.allowedDatasets.forEach((d, index) => {
            if (usr.allowedDatasets.indexOf(d) !== index) {
              d.datasetName += `(${d.datasetId})`;
            }
          });
          return usr;
        });
      })
    );
  }
}
