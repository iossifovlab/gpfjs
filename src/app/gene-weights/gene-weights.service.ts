import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';

import { GeneWeights, Partitions } from './gene-weights';
import { ConfigService } from '../config/config.service';

@Injectable()
export class GeneWeightsService {
  private readonly geneWeightsUrl = 'gene_weights';
  private readonly geneWeightsPartitionsUrl = 'gene_weights/partitions';

  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  getGeneWeights(geneWeightIds?: string): Observable<GeneWeights[]> {
    let url = this.config.baseUrl + this.geneWeightsUrl;

    if (geneWeightIds) {
      const searchParams = new HttpParams().set('ids', geneWeightIds);
      url += `?${searchParams.toString()}`;
    }

    return this.http.get(url).map((res: any) => {
      return GeneWeights.fromJsonArray(res);
    });
  }

  getPartitions(weight: string, min: number, max: number): Observable<Partitions> {
    const headers = { 'Content-Type': 'application/json' };
    const options = { headers: headers };

    return this.http
      .post(this.config.baseUrl + this.geneWeightsPartitionsUrl, {weight: weight, min: min, max: max}, options)
      .map((res: any) => {
        return Partitions.fromJson(res);
      });
  }
}
