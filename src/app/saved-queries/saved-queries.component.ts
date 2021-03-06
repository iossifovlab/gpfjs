import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { QueryService } from '../query/query.service';
import { UsersService } from '../users/users.service';

export class UserSavedQuery {
  constructor(
    public name: string,
    public description: string,
    public page: string,
    public uuid: string,
    public url: string
  ) {}
}

@Component({
  selector: 'gpf-saved-queries',
  templateUrl: './saved-queries.component.html',
  styleUrls: ['./saved-queries.component.css']
})
export class SavedQueriesComponent implements OnInit {

  private subscription;

  genotypeQueries: Array<UserSavedQuery>;
  phenotoolQueries: Array<UserSavedQuery>;
  enrichmentQueries: Array<UserSavedQuery>;

  constructor(
    private router: Router,
    private queryService: QueryService,
    private usersService: UsersService,
  ) {}

  ngOnInit() {
    this.subscription = this.usersService.getUserInfoObservable()
      .subscribe(userInfo => this.checkUserInfo(userInfo));
    this.updateQueries();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  checkUserInfo(value) {
    if (!value.loggedIn) {
      this.router.navigate(['/']);
    }
  }

  updateQueries() {
    this.queryService.collectUserSavedQueries().subscribe(response => {
      const queries = response['queries'].map(query => {
        return new UserSavedQuery(
          query.name,
          query.description,
          query.page,
          query.query_uuid,
          this.queryService.getLoadUrl(query.query_uuid)
        );
      });

      this.genotypeQueries = queries.filter(query => query.page === 'genotype');
      this.phenotoolQueries = queries.filter(query => query.page === 'phenotool');
      this.enrichmentQueries = queries.filter(query => query.page === 'enrichment');
    });
  }
}
