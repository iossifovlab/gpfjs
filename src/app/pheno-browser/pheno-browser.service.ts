import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// eslint-disable-next-line no-restricted-imports
import { Observable, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

const oboe = require('oboe');

import { PhenoInstruments, PhenoInstrument, PhenoMeasures, PhenoMeasure } from './pheno-browser';
import { ConfigService } from '../config/config.service';
import { map } from 'rxjs/operators';

@Injectable()
export class PhenoBrowserService {
  private readonly instrumentsUrl = 'pheno_browser/instruments';
  private readonly measuresUrl = 'pheno_browser/measures';
  private readonly measuresInfoUrl = 'pheno_browser/measures_info';
  private readonly downloadUrl = 'pheno_browser/download';
  private readonly measureDescription = 'pheno_browser/measure_description';

  private oboeInstance = null;
  private connectionEstablished = false;
  public measuresStreamingFinishedSubject = new Subject();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private config: ConfigService
  ) {}

  getMeasureDescription(datasetId: string, measureId: string) {
    const headers = this.getHeaders();
    const searchParams = new HttpParams().set('dataset_id', datasetId).set('measure_id', measureId);
    const options = { headers: headers, withCredentials: true,  params: searchParams };
    return this.http.get(this.config.baseUrl + this.measureDescription, options).pipe(map(res => res));
  }

  private getHeaders() {
    const csrfToken = this.cookieService.get('csrftoken');
    const headers = { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' };

    return headers;
  }

  getInstruments(datasetId: string): Observable<PhenoInstruments> {
    const headers = this.getHeaders();
    const searchParams = new HttpParams().set('dataset_id', datasetId);
    const options = {headers: headers, withCredentials: true, params: searchParams};

    return this.http
      .get(this.config.baseUrl + this.instrumentsUrl, options)
      .pipe(map(response => response as PhenoInstruments));
  }

  getMeasures(datasetId: string, instrument: PhenoInstrument, search: string): Observable<PhenoMeasure> {
    const headers = this.getHeaders();
    const searchParams = new HttpParams().set('dataset_id', datasetId).set('instrument', instrument).set('search', search);
    const measuresSubject: Subject<PhenoMeasure> = new Subject();

    this.oboeInstance = oboe({
      url: `${this.config.baseUrl}${this.measuresUrl}?${searchParams.toString()}`,
      method: 'GET',
      headers: headers,
      withCredentials: true,
    }).start(data => {
      this.connectionEstablished = true;
      this.measuresStreamingFinishedSubject.next(false);
    }).node('!.*', data => {
      measuresSubject.next(data);
    }).done(data => {
      this.measuresStreamingFinishedSubject.next(true);
    }).fail(error => {
      this.connectionEstablished = false;
      this.measuresStreamingFinishedSubject.next(true);
      console.warn('oboejs encountered a fail event while streaming');
    });

    return measuresSubject.pipe(map(data => {
        return PhenoMeasure.fromJson(data['measure']);
    }));
  }

  getMeasuresInfo(datasetId: string): Observable<PhenoMeasures> {
    const headers = this.getHeaders();
    const searchParams = new HttpParams().set('dataset_id', datasetId);
    const options = {headers: headers, withCredentials: true, params: searchParams};

    return this.http
      .get(this.config.baseUrl + this.measuresInfoUrl, options)
      .pipe(map(response => PhenoMeasures.fromJson(response)));

  }

  getDownloadLink(instrument: PhenoInstrument, datasetId: string) {
    return `${this.config.baseUrl}${this.downloadUrl}`
           + `?dataset_id=${datasetId}&instrument=${instrument}`;
  }
}
