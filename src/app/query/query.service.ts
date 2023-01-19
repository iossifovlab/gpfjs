import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// eslint-disable-next-line no-restricted-imports
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { ConfigService } from '../config/config.service';
import { Dataset } from 'app/datasets/datasets';
import { jsonStream, variantFromJSON } from '../utils/streaming';
import { AuthService } from 'app/auth.service';

@Injectable()
export class QueryService {
  private readonly genotypePreviewVariantsUrl = 'genotype_browser/query';
  private readonly geneViewVariants = 'gene_view/query_summary_variants';
  private readonly geneViewVariantsDownload = 'gene_view/download_summary_variants';
  private readonly saveQueryEndpoint = 'query_state/save';
  private readonly loadQueryEndpoint = 'query_state/load';
  private readonly deleteQueryEndpoint = 'query_state/delete';
  private readonly userSaveQueryEndpoint = 'user_queries/save';
  private readonly userCollectQueriesEndpoint = 'user_queries/collect';

  private readonly headers = new HttpHeaders({'Content-Type': 'application/json'});

  public constructor(
    private location: Location,
    private router: Router,
    private http: HttpClient,
    private config: ConfigService,
    private auth: AuthService,
  ) { }

  public downloadVariants(filter: object): Observable<HttpResponse<Blob>> {
    return this.http.post(
      `${environment.apiPath}${this.genotypePreviewVariantsUrl}`,
      filter,
      {observe: 'response', headers: this.headers, responseType: 'blob'}
    );
  }

  public downloadVariantsSummary(filter: object): Observable<HttpResponse<Blob>> {
    return this.http.post(
      `${environment.apiPath}${this.geneViewVariantsDownload}`,
      filter,
      {observe: 'response', headers: this.headers, responseType: 'blob'}
    );
  }

  public async streamVariants(dataset: Dataset, filter: object): Promise<ReadableStream> {
    const stream = await jsonStream(
      `${environment.apiPath}${this.genotypePreviewVariantsUrl}`,
      filter,
      this.auth.getAccessToken()
    );
    return stream.pipeThrough(variantFromJSON(dataset.genotypeBrowserConfig.columnIds));
  }

  public async streamSummaryVariants(filter: object): Promise<ReadableStream> {
    return jsonStream(`${environment.apiPath}${this.geneViewVariants}`, filter, this.auth.getAccessToken());
  }

  public saveQuery(queryData: {}, page: string): Observable<object> {
    const options = { headers: this.headers };

    queryData = {...queryData};
    delete queryData['errorsState'];

    const data = {
      data: queryData,
      page: page
    };

    return this.http
      .post(this.config.baseUrl + this.saveQueryEndpoint, data, options)
      .pipe(map(response => response));
  }

  public loadQuery(uuid: string): Observable<object> {
    const options = { headers: this.headers, withCredentials: true };

    return this.http
      .post(this.config.baseUrl + this.loadQueryEndpoint, { uuid: uuid }, options)
      .pipe(map(response => response));
  }

  public deleteQuery(uuid: string): Observable<object> {
    const options = { headers: this.headers, withCredentials: true };

    return this.http
      .post(this.config.baseUrl + this.deleteQueryEndpoint, { uuid: uuid }, options)
      .pipe(map(response => response));
  }

  public getLoadUrl(uuid: string): string {
    let pathname = this.router.createUrlTree(['load-query', uuid]).toString();
    pathname = this.location.prepareExternalUrl(pathname);

    return window.location.origin + pathname;
  }

  public getLoadUrlFromResponse(response: {}): string {
    return this.getLoadUrl(response['uuid']);
  }

  public saveUserQuery(uuid: string, query_name: string, query_description: string): Observable<object> {
    const options = { headers: this.headers, withCredentials: true };

    const data = {
      query_uuid: uuid,
      name: query_name,
      description: query_description
    };

    return this.http
      .post(this.config.baseUrl + this.userSaveQueryEndpoint, data, options)
      .pipe(map(response => response));
  }

  public collectUserSavedQueries(): Observable<object> {
    const options = { withCredentials: true };
    return this.http
      .get(this.config.baseUrl + this.userCollectQueriesEndpoint, options)
      .pipe(map(response => response));
  }
}
