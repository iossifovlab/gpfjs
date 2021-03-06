import { Component, OnInit, ViewChild, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Observable } from 'rxjs';

import { VariantReportsService } from './variant-reports.service';
import { VariantReport, FamilyCounter, PedigreeCounter, EffectTypeTable,
         DeNovoData, PedigreeTable, PeopleCounter, PeopleSex } from './variant-reports';
import { Dataset } from 'app/datasets/datasets';
import { DatasetsService } from 'app/datasets/datasets.service';

@Component({
  selector: 'gpf-variant-reports',
  templateUrl: './variant-reports.component.html',
  styleUrls: ['./variant-reports.component.css']
})
export class VariantReportsComponent implements OnInit, OnChanges {
  @ViewChild('families_pedigree') familiesPedigree: ElementRef;
  @ViewChild('legend') legend: ElementRef;
  familiesPedigreeTop: number;
  familiesPedigreeBottom: number;
  legendTop: number;

  currentPeopleCounter: PeopleCounter;
  currentPedigreeTable: PedigreeTable;
  currentDenovoReport: EffectTypeTable;

  variantReport$: Observable<VariantReport>;
  pedigreeTables: PedigreeTable[];

  selectedDatasetId: string;
  selectedDataset$: Observable<Dataset>;

  constructor(
    private variantReportsService: VariantReportsService,
    private route: ActivatedRoute,
    private router: Router,
    private datasetsService: DatasetsService,
  ) { }

  ngOnInit() {
    let datasetId$ = this.route.parent.params
      .take(1)
      .map(params => <string>params['dataset']);

    this.route.parent.params.subscribe(
      (params: Params) => {
        this.selectedDatasetId = params['dataset'];
      }
    );

    this.selectedDataset$ = this.datasetsService.getDataset(this.selectedDatasetId);

    this.selectedDataset$.subscribe(
      dataset => {
        if (dataset.accessRights) {
          this.variantReport$ = datasetId$.switchMap(datasetId =>
            this.variantReportsService.getVariantReport(datasetId)).share();

          this.variantReport$.take(1).subscribe(params => {
            this.pedigreeTables = params.familyReport.familiesCounters.map(
              familiesCounters => new PedigreeTable(
                  this.chunkPedigrees(familiesCounters.familyCounter),
                  familiesCounters.phenotypes, familiesCounters.groupName,
                  familiesCounters.legend
                )
              );

            this.currentPeopleCounter = params.familyReport.peopleCounters[0];
            this.currentPedigreeTable = this.pedigreeTables[0];
            if(params.denovoReport !== null) {
              this.currentDenovoReport = params.denovoReport.tables[0];
            }
          });
        }
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    this.datasetsService.setSelectedDatasetById(this.selectedDatasetId);
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('click', ['$event'])
  onWindowScroll(event) {
    if (this.familiesPedigree && this.familiesPedigree.nativeElement) {
      this.familiesPedigreeTop = this.familiesPedigree.nativeElement.getBoundingClientRect().top;
      this.familiesPedigreeBottom = this.familiesPedigree.nativeElement.getBoundingClientRect().bottom;
    }

    if (this.legend && this.legend.nativeElement) {
      this.legendTop = this.legend.nativeElement.getBoundingClientRect().top;
    }
  }

  getPeopleSexValue(peopleSex: string) {
    return PeopleSex[peopleSex];
  }

  orderByColumnOrder(childrenCounters: DeNovoData[], columns: string[], strict = false) {
    let columnsLookup = new Map<string, number>(
      columns.map((value, index): [string, number] => [value, index])
    );

    let filteredChildrenCounters = childrenCounters
      .filter(
        childCounters => columnsLookup.has(childCounters.column));

    if (strict && filteredChildrenCounters.length !== columns.length) {
      return [];
    }

    return filteredChildrenCounters.sort(
      (child1, child2) => {
        let index1 = columnsLookup.get(child1.column);
        let index2 = columnsLookup.get(child2.column);
        return index1 - index2;
      }
    );
  }

  chunkPedigrees(familyCounters: FamilyCounter[], chunkSize = 4) {
    let allPedigrees = familyCounters
      .reduce(
        (acc, familyCounter) =>
          acc.concat(familyCounter.pedigreeCounters),
        [] as PedigreeCounter[]);

    return allPedigrees
      .reduce(
        (acc: PedigreeCounter[][], pedigree, index) => {
          if (acc.length === 0 || acc[acc.length - 1].length === chunkSize) {
            acc.push([pedigree]);
          } else {
            acc[acc.length - 1].push(pedigree);
          }

          if (index === allPedigrees.length - 1) {
            let lastChunk = acc[acc.length - 1];
            let toFill = chunkSize - lastChunk.length;
            for (let i = 0; i <  toFill; i++) {
              lastChunk.push(null);
            }
          }

          return acc;
        },
        []);
  }

  getRows(effectGroups: string[], effectTypes: string[]) {
    if (effectGroups) {
      return effectGroups.concat(effectTypes);
    } else if (effectTypes) {
      return effectTypes;
    }
    return [];
  }

  getEffectTypeOrderByColumOrder(effectTypeName: string, table: EffectTypeTable, phenotypes: string[]) {
    let effectType = table.rows
      .find(et => et.effectType === effectTypeName);

    if (!effectType) {
      return [];
    }
    return this.orderByColumnOrder(effectType.data, phenotypes);
  }

  getDownloadLink() {
    return this.variantReportsService.getDownloadLink();
  }

}
