import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { GeneSetsCollection, GeneSet, GeneSetJson, GeneSetType } from './gene-sets';
import { ConfigService } from '../config/config.service';
import { map } from 'rxjs/operators';

@Injectable()
export class GeneSetsService {
  private readonly geneSetsCollectionsUrl = 'gene_sets/gene_sets_collections';
  private readonly geneSetsSearchUrl = 'gene_sets/gene_sets';

  public constructor(
    private http: HttpClient,
    private config: ConfigService,
  ) {}

  public getGeneSetsCollections(): Observable<GeneSetsCollection[]> {
    const newCollection = new GeneSetsCollection('autism', 'Autism Gene Sets', []);
    const types: GeneSetType[] = [];
    const studyD1 = new GeneSetType('study_d1', 'Study d1', 'phenotype', 'Phenotype', [
      {
        id: 'autism',
        name: 'autism',
        values: [
          'affected'
        ],
        color: '#ff2121'
      },
      {
        id: 'unaffected',
        name: 'unaffected',
        values: [
          'unaffected'
        ],
        color: '#ffffff'
      }
    ], null);

    const studyD2 = new GeneSetType('study_d2', 'Study d2', 'phenotype', 'Phenotype', [
      {
        id: 'autism',
        name: 'autism',
        values: [
          'affected'
        ],
        color: '#ff2121'
      },
      {
        id: 'unaffected',
        name: 'unaffected',
        values: [
          'unaffected'
        ],
        color: '#ffffff'
      },
      {
        id: 'bipolar',
        name: 'bipolar',
        values: [
          'bipolar'
        ],
        color: '#006401'
      },
      {
        id: 'schizophrenia',
        name: 'schizophrenia',
        values: [
          'schizophrenia'
        ],
        color: '#00ff00'
      }
    ], null);

    const singleStudy1 = new GeneSetType('single_study_1', 'Single study 1', 'phenotype', 'Phenotype', [
      {
        id: 'early_onset_parkinson',
        name: 'early onset parkinson',
        values: [
          'early_onset_parkinson'
        ],
        color: '#3d8679'
      },
      {
        id: 'epilepsy',
        name: 'epilepsy',
        values: [
          'epilepsy'
        ],
        color: '#ffe502'
      }
    ], null);

    const studyD3 = new GeneSetType('study_d3', 'Study d3', 'phenotype', 'Phenotype', [
      {
        id: 'autism',
        name: 'autism',
        values: [
          'affected'
        ],
        color: '#ff2121'
      },
      {
        id: 'unaffected',
        name: 'unaffected',
        values: [
          'unaffected'
        ],
        color: '#ffffff'
      }
    ], null);

    const studyD4 = new GeneSetType('study_d4', 'Study d4', 'phenotype', 'Phenotype', [
      {
        "id": "pdd_nos_atypical_autism",
        "name": "PDD-NOS atypical autism",
        "values": [
            "pdd-nos-atypical-autism"
        ],
        "color": "#0200a2"
      }
    ], null);

    const datasetInner = new GeneSetType('dataset_inner', 'Dataset inner', 'phenotype', 'Phenotype', [{
      id: 'autism',
      name: 'autism',
      values: [
        'affected'
      ],
      color: '#ff2121'
    },
    {
      id: 'unaffected',
      name: 'unaffected',
      values: [
        'unaffected'
      ],
      color: '#ffffff'
    }], [studyD3]);

    const datasetParallel = new GeneSetType('dataset_parallel', 'Dataset parallel', 'phenotype', 'Phenotype', [
    {
      "id": "pdd_nos_atypical_autism",
      "name": "PDD-NOS atypical autism",
      "values": [
          "pdd-nos-atypical-autism"
      ],
      "color": "#0200a2"
    }], [studyD4]);


    const dataset = new GeneSetType('dataset', 'Dataset', 'phenotype', 'Phenotype', [{
      id: 'autism',
      name: 'autism',
      values: [
        'affected'
      ],
      color: '#ff2121'
    },
    {
      id: 'unaffected',
      name: 'unaffected',
      values: [
        'unaffected'
      ],
      color: '#ffffff'
    },
    {
      id: 'bipolar',
      name: 'bipolar',
      values: [
        'bipolar'
      ],
      color: '#006401'
    },
    {
      id: 'schizophrenia',
      name: 'schizophrenia',
      values: [
        'schizophrenia'
      ],
      color: '#00ff00'
    }
  ], [studyD1, studyD2, datasetInner]);

    types.push(dataset, singleStudy1, datasetParallel);
    const newCollection2 = new GeneSetsCollection('denovo', 'Denovo', types);

    const result: GeneSetsCollection[] = [];
    result.push(newCollection, newCollection2);
    return of(result);

    // to check if fromJson will work after refactor
    // return of(mockResponse as GeneSetCollectionJson[]).pipe(map(res => GeneSetsCollection.fromJsonArray(res)));
  }

  // public getGeneSetsCollections(): Observable<GeneSetsCollection[]> {
  //   // eslint-disable-next-line @typescript-eslint/naming-convention
  //   const headers = { 'Content-Type': 'application/json' };
  //   const options = { headers: headers, withCredentials: true };

  //   return this.http
  //     .get<GeneSetCollectionJson[]>(this.config.baseUrl + this.geneSetsCollectionsUrl, options)
  //     .pipe(map(res => GeneSetsCollection.fromJsonArray(res)));
  // }

  public getGeneSets(
    selectedGeneSetsCollection: string,
    searchTerm: string,
    geneSetsTypes: object
  ): Observable<GeneSet[]> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const headers = { 'Content-Type': 'application/json' };
    const options = { headers: headers, withCredentials: true };

    return this.http
      .post<GeneSetJson[]>(this.config.baseUrl + this.geneSetsSearchUrl, {
        geneSetsCollection: selectedGeneSetsCollection,
        filter: searchTerm,
        geneSetsTypes: geneSetsTypes,
        limit: 100
      }, options)
      .pipe(map(res => GeneSet.fromJsonArray(res)));
  }

  public getGeneSetDownloadLink(geneSet: GeneSet): string {
    return `${this.config.baseUrl}${geneSet.download}`;
  }
}
