import { Component, OnInit, Input, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DatasetsService } from '../datasets/datasets.service';

import { PhenoBrowserService } from './pheno-browser.service';
import { PhenoInstruments, PhenoInstrument, PhenoMeasures } from './pheno-browser';
import { Dataset } from 'app/datasets/datasets';

@Component({
  selector: 'gpf-pheno-browser',
  templateUrl: './pheno-browser.component.html',
  styleUrls: ['./pheno-browser.component.css'],
})
export class PhenoBrowserComponent implements OnInit {

  selectedInstrument$: BehaviorSubject<PhenoInstrument> = new BehaviorSubject<PhenoInstrument>(undefined);
  measuresToShow$: Observable<PhenoMeasures>;

  instruments: Observable<PhenoInstruments>;
  downloadLink$: Observable<string>;

  selectedDatasetId: string;
  selectedDataset$: Observable<Dataset>;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private phenoBrowserService: PhenoBrowserService,
    private datasetsService: DatasetsService,
  ) { }

  ngOnInit() {
    let dataset$ = this.route.parent.params
      .take(1)
      .map(params => params['dataset']);
    this.route.parent.params.subscribe(
    (params: Params) => { 
            this.selectedDatasetId = params['dataset']
        }
    )
  
    this.selectedDataset$ = this.datasetsService.getSelectedDataset();

    this.selectedDataset$.subscribe(
        dataset => {
            if (dataset.accessRights) {
                this.initInstruments(dataset$);
                this.initMeasuresToShow(dataset$);
                this.initDownloadLink(dataset$);        
            }
        }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    this.datasetsService.setSelectedDatasetById(this.selectedDatasetId);
  }

  initMeasuresToShow(dataset$) {
    this.measuresToShow$ = Observable
      .combineLatest([this.selectedInstrument$, dataset$])
      .switchMap(([newSelection, datasetId]) => {
        return this.phenoBrowserService.getMeasures(datasetId, newSelection)
      }).share();
  }

  initInstruments(datasetId$: Observable<string>): void {
    this.instruments = datasetId$.switchMap(datasetId =>
      this.phenoBrowserService.getInstruments(datasetId)).share();

    this.instruments.take(1).subscribe((phenoInstruments) => {
      this.emitInstrument(phenoInstruments.default);
    });
  }

  emitInstrument(instrument: PhenoInstrument) {
    this.selectedInstrument$.next(instrument);
  }

  initDownloadLink(dataset$) {
    this.downloadLink$ = Observable
      .combineLatest([this.selectedInstrument$, dataset$])
      .map(([instrument, datasetId]) =>
        this.phenoBrowserService.getDownloadLink(instrument, datasetId)
      );
  }
}
