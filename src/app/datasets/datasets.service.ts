import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';

import { Dataset, DatasetHierarchy } from '../datasets/datasets';
import { ConfigService } from '../config/config.service';
import { map, take } from 'rxjs/operators';
import { DatasetPermissions } from 'app/datasets-table/datasets-table';

@Injectable()
export class DatasetsService {
  private readonly datasetUrl = 'datasets';
  private readonly datasetPedigreeUrl = 'datasets/pedigree';
  private readonly visibleDatasetsUrl = 'datasets/visible';
  private readonly descriptionUrl = 'datasets/description';

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private datasets$ = new ReplaySubject<Array<Dataset>>(1);
  public datasetsLoading = false;

  public constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.reloadAllDatasets();
  }

  public getDatasets(): Observable<Dataset[]> {
    const options = { withCredentials: true };
    this.datasetsLoading = true;

    return this.http.get(this.config.baseUrl + this.datasetUrl, options).pipe(
      map((res: {data: Array<object>}) => {
        const datasets = Dataset.fromJsonArray(res.data);
        this.datasets$.next(datasets);
        this.datasetsLoading = false;
        return datasets;
      })
    );
  }

  public getDataset(datasetId: string): Observable<Dataset> {
    if (!datasetId) {
      return of();
    }
    const url = `${this.datasetUrl}/${datasetId}`;
    const options = { headers: this.headers, withCredentials: true };

    return this.http.get(this.config.baseUrl + url, options).pipe(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      map((response: object) => Dataset.fromDataset(response['data']))
    );
  }

  public getManagementDatasets(page: number, searchTerm: string): Observable<DatasetPermissions[]> {
    let url = `${this.config.baseUrl}${this.datasetUrl}/permissions?page=${page}`;
    if (searchTerm) {
      const searchParams = new HttpParams().set('search', searchTerm);
      url += `&${searchParams.toString()}`;
    }

    const options = { withCredentials: true };

    return this.http.get(url, options).pipe(
      map((response) => {
        if (response === null) {
          return [] as DatasetPermissions[];
        }
        return (response as object[]).map(dataset => DatasetPermissions.fromJson(dataset));
      })
    );
  }

  public getManagementDataset(datasetId: string): Observable<DatasetPermissions> {
    const url = `${this.config.baseUrl}${this.datasetUrl}/permissions/${datasetId}`;

    return this.http.get(url).pipe(
      map((response: object) => DatasetPermissions.fromJson(response))
    );
  }

  public getDatasetsObservable(): Observable<Dataset[]> {
    return this.datasets$.asObservable();
  }

  private reloadAllDatasets(): void {
    this.getDatasets().pipe(take(1)).subscribe(() => null);
  }

  public getDatasetPedigreeColumnDetails(datasetId: string, column: string): Observable<object> {
    const options = { headers: this.headers, withCredentials: true };
    return this.http.get(`${this.config.baseUrl}${this.datasetPedigreeUrl}/${datasetId}/${column}`, options);
  }

  public writeDatasetDescription(datasetId: string, description: string): Observable<object> {
    const options = { headers: this.headers, withCredentials: true };
    return this.http.post(
      `${this.config.baseUrl}${this.datasetUrl}/description/${datasetId}`,
      {description: description},
      options
    );
  }

  public getVisibleDatasets(): Observable<string[]> {
    const options = { headers: this.headers, withCredentials: true };
    return this.http.get<string[]>(`${this.config.baseUrl}${this.visibleDatasetsUrl}`, options);
  }

  public getDatasetDescription(datasetId: string): Observable<string> {
    const options = { headers: this.headers, withCredentials: true };
    return this.http.get<{description: string}>(
      `${this.config.baseUrl}${this.descriptionUrl}/${datasetId}`, options
    ).pipe(
      take(1),
      map((res: {description: string}) => res.description)
    );
  }

  public getSingleDatasetHierarchy(datasetId: string): Observable<DatasetHierarchy> {
    return this.http.get(`${this.config.baseUrl}datasets/hierarchy/${datasetId}`).pipe(
      map((json: {data: object}) => DatasetHierarchy.fromJson(json.data))
    );
  }
}
