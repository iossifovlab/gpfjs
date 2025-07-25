import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QueryService } from '../query/query.service';
import { UsersService } from '../users/users.service';
import { UserInfo } from 'app/users/users';

export class UserSavedQuery {
  public constructor(
    public name: string,
    public description: string,
    public page: string,
    public uuid: string,
    public url: string
  ) {}
}

@Component({
  selector: 'gpf-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  standalone: false
})
export class UserProfileComponent implements OnInit {
  public genotypeQueries: Array<UserSavedQuery>;
  public phenotoolQueries: Array<UserSavedQuery>;
  public enrichmentQueries: Array<UserSavedQuery>;
  public showTemplate = false;

  public constructor(
    private router: Router,
    private queryService: QueryService,
    private usersService: UsersService,
  ) {}

  public ngOnInit(): void {
    const userInfo = this.usersService.cachedUserInfo();
    this.loadUserProfile(userInfo);
  }

  private loadUserProfile(userInfo: UserInfo): void {
    if (userInfo.loggedIn) {
      this.showTemplate = true;
      this.updateQueries();
    } else {
      this.router.navigate(['/']);
    }
  }

  public updateQueries(): void {
    this.queryService.collectUserSavedQueries().subscribe((response: {queries: object[]}) => {
      const queries = response['queries'].map((query: object) => {
        if (
          typeof query['name'] === 'string'
          && typeof query['description'] === 'string'
          && typeof query['page'] === 'string'
          && typeof query['query_uuid'] === 'string'
        ) {
          return new UserSavedQuery(
            query['name'],
            query['description'],
            query['page'],
            query['query_uuid'],
            this.queryService.getLoadUrl(query['query_uuid'])
          );
        }
        return undefined;
      }
      );

      this.genotypeQueries = queries.filter(query => query.page === 'genotype');
      this.phenotoolQueries = queries.filter(query => query.page === 'phenotool');
      this.enrichmentQueries = queries.filter(query => query.page === 'enrichment');
    });
  }
}
