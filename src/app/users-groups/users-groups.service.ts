import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UserGroup } from './users-groups';
import { Dataset } from '../datasets/datasets';
import { ConfigService } from '../config/config.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'app/users/users';

@Injectable()
export class UsersGroupsService {
  private readonly groupsUrl = 'groups';
  private readonly groupGrantPermissionUrl = 'groups/grant-permission';
  private readonly groupRevokePermissionUrl = 'groups/revoke-permission';

  public constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  public getAllGroups(): Observable<UserGroup[]> {
    const options = { withCredentials: true };

    return this.http.get(this.config.baseUrl + this.groupsUrl, options)
      .pipe(map((response: any) => UserGroup.fromJsonArray(response)));
  }

  public getGroups(page: number, searchTerm: string): Observable<UserGroup[]> {
    let url = `${this.config.baseUrl}${this.groupsUrl}?page=${page}`;
    if (searchTerm) {
      const searchParams = new HttpParams().set('search', searchTerm);
      url += `&${searchParams.toString()}`;
    }

    return this.http.get<UserGroup[]>(url).pipe(
      map((response) => {
        if (response === null) {
          return [] as UserGroup[];
        }
        return response.map(user => {
          const usr = UserGroup.fromJson(user);
          // Finding and fixing duplicate dataset names
          usr.datasets.forEach((d, index) => {
            if (usr.datasets.indexOf(d) !== index) {
              d.datasetName += `(${d.datasetId})`;
            }
          });
          return usr;
        });
      })
    );
  }

  public getGroup(group: string): Observable<UserGroup> {
    const options = { withCredentials: true };

    return this.http.get(`${this.config.baseUrl}${this.groupsUrl}/${group}`, options)
      .pipe(map(response => UserGroup.fromJson(response)));
  }

  public grantPermissionToDataset(groupName: string, datasetId: string): Observable<object> {
    const options = { withCredentials: true };

    return this.http.post(this.config.baseUrl + this.groupGrantPermissionUrl, {
      groupName: groupName,
      datasetId: datasetId
    }, options);
  }

  public revokePermissionToDataset(groupName: string, datasetId: string): Observable<Dataset> {
    const options = { withCredentials: true };
    return this.http.post<Dataset>(this.config.baseUrl + this.groupRevokePermissionUrl, {
      groupName: groupName,
      datasetId: datasetId
    }, options);
  }

  public addUser(userEmail: string, groupName: string): Observable<null> {
    const url = `${this.config.baseUrl}`
      + `${this.groupsUrl}/add-user`;
    const options = { withCredentials: true };

    return this.http.post<null>(
      url,
      {
        userEmail: userEmail,
        groupName: groupName
      },
      options);
  }

  public removeUser(userEmail: string, groupName: string): Observable<null> {
    const url = `${this.config.baseUrl}`
      + `${this.groupsUrl}/remove-user`;
    const options = { withCredentials: true };

    return this.http.post<null>(
      url,
      {
        userEmail: userEmail,
        groupName: groupName
      },
      options);
  }
}
