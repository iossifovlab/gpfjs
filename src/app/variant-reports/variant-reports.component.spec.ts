import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantReportsComponent } from './variant-reports.component';
import { PedigreeChartModule } from '../pedigree-chart/pedigree-chart.module'
import { FormsModule } from '@angular/forms';
import { VariantReportsService } from './variant-reports.service';
import { Observable, of } from 'rxjs';
import { VariantReport } from './variant-reports';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetsService } from 'app/datasets/datasets.service';
import { PerfectlyDrawablePedigreeService } from 'app/perfectly-drawable-pedigree/perfectly-drawable-pedigree.service';
import { ResizeService } from 'app/table/resize.service';

class MockDatasetsService {
  getSelectedDataset(): Observable<any> {
    return of({accessRights: true})
  }
  getDataset(): Observable<any> {
    return of({accessRights: true})
  }
}

class ResizeServiceMock {
  addResizeEventListener(): null{
    return null
  }
  removeResizeEventListener(): null{
    return null
  }
}

class MockActivatedRoute {
  private datasetId: string;

  public params: object;
  public parent: object;
  public queryParamMap: Observable<object>;

  constructor(datasetId: string = 'test_dataset') {
    this.datasetId = datasetId;
    this.params = {dataset: this.datasetId, get: () => { return '' }};
    this.parent = {params: of(this.params)};
    this.queryParamMap = of(this.params);
  }
}

class VariantReportsServiceMock {
  private variantsUrl = 'common_reports/studies/';
  private downloadUrl = 'common_reports/families_data/';
  private datasetId: string;

  constructor(datasetId: string = 'test_dataset') {
    this.datasetId = datasetId
  }

  getVariantReport(datasetId: string): Observable<any> {
    const variantReport = {
      id: this.datasetId,
      studyName: this.datasetId,
      studyDescription: '',
      familyReport: {
        familiesCounters: [
          {
            familyCounter: [
              {
                pedigreeCounters: [
                  null
                ]
              }
            ],
            groupName: 'test',
            phenotypes: ['unaffected', 'affected'],
            legend: {
              legendItems: [
                {
                  id: 'affected',
                  name: 'affected',
                  color: '#e35252'
                },
                {
                  id: 'unaffected',
                  name: 'unaffected',
                  color: '#ffffff'
                },
                {
                  id: 'unspecified',
                  name: 'unspecified',
                  color: '#aaaaaa'
                },
                {
                  id: 'missing-person',
                  name: 'missing-person',
                  color: '#e0e0e0'
                },
              ]
            }
          }
        ],
        peopleCounters: [
          {
            groupCounters: [
              {
                column: 'prb',
                childrenCounters: [
                  {
                    row: 'people_male',
                    column: 'prb',
                    children: 5
                  },
                  {
                    row: 'people_female',
                    column: 'prb',
                    children: 0
                  },
                  {
                    row: 'people_total',
                    column: 'prb',
                    children: 5
                  },
                ]
              },
              {
                column: 'mom',
                childrenCounters: [
                  {
                    row: 'people_male',
                    column: 'mom',
                    children: 5
                  },
                  {
                    row: 'people_female',
                    column: 'mom',
                    children: 0
                  },
                  {
                    row: 'people_total',
                    column: 'mom',
                    children: 5
                  },
                ]
              },
              {
                column: 'sib',
                childrenCounters: [
                  {
                    row: 'people_male',
                    column: 'sib',
                    children: 5
                  },
                  {
                    row: 'people_female',
                    column: 'sib',
                    children: 0
                  },
                  {
                    row: 'people_total',
                    column: 'sib',
                    children: 5
                  },
                ]
              },
              {
                column: 'dad',
                childrenCounters: [
                  {
                    row: 'people_male',
                    column: 'dad',
                    children: 5
                  },
                  {
                    row: 'people_female',
                    column: 'dad',
                    children: 0
                  },
                  {
                    row: 'people_total',
                    column: 'dad',
                    children: 5
                  },
                ]
              },
            ],
            groupName: 'Role',
            rows: ['people_male', 'people_female', 'people_total'],
            columns: ['prb', 'mom', 'sib', 'dad'],
            getChildrenCounter: function() {return 0}
          }
        ],
        familiesTotal: 1
      },
      denovoReport: null
    };

    if(datasetId === 'Denovo') {
      variantReport.denovoReport = {
        tables: [
          {
            rows: [
              {
                effectType: 'nonsynonymous',
                data: [
                  {
                    column: 'prb',
                    numberOfObservedEvents: 2,
                    numberOfChildrenWithEvent: 2,
                    observedRatePerChild: 0.4,
                    percentOfChildrenWithEvents: 0.4
                  }
                ]
              },
              {
                effectType: 'Missense',
                data: [
                  {
                    column: 'prb',
                    numberOfObservedEvents: 2,
                    numberOfChildrenWithEvent: 2,
                    observedRatePerChild: 0.4,
                    percentOfChildrenWithEvents: 0.4
                  }
                ]
              },
              {
                effectType: 'Synonymous',
                data: [
                  {
                    column: 'prb',
                    numberOfObservedEvents: 3,
                    numberOfChildrenWithEvent: 2,
                    observedRatePerChild: 0.6,
                    percentOfChildrenWithEvents: 0.4
                  }
                ]
              },
            ],
            groupName: 'Role',
            columns: ['prb'],
            effectGroups: ['nonsynonymous'],
            effectTypes: ['Missense', 'Synonymous'],
          }
        ]
      }
    }
    return of(variantReport);
  }

  getDownloadLink(): string {
    return '';
  }
}

describe('VariantReportsComponent', () => {
  let component: VariantReportsComponent;
  let fixture: ComponentFixture<VariantReportsComponent>;

  beforeEach(() => {
    const variantReportsServiceMock = new VariantReportsServiceMock();
    const activatedRouteMock = new MockActivatedRoute();
    const datasetsServiceMock = new MockDatasetsService();
    TestBed.configureTestingModule({
      declarations: [ VariantReportsComponent ],
      imports: [ PedigreeChartModule, FormsModule ],
      providers: [
        { provide: VariantReportsService, useValue: variantReportsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: {} },
        { provide: DatasetsService, useValue: datasetsServiceMock },
        { provide: PerfectlyDrawablePedigreeService },
        { provide: ResizeService, useClass: ResizeServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantReportsComponent);
    component = fixture.componentInstance;

    //Stubbing the function to reduce mock test data
    component['chunkPedigrees'] = function(a, b) { return null; };

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not have denovo', () => {
    expect(component).toBeTruthy();
    expect(component.currentDenovoReport).toBeUndefined();
  })
});

describe('VariantReportsComponent Denovo', () => {
  let component: VariantReportsComponent;
  let fixture: ComponentFixture<VariantReportsComponent>;

  beforeEach(() => {
    const variantReportsServiceMock = new VariantReportsServiceMock('Denovo');
    const activatedRouteMock = new MockActivatedRoute('Denovo');
    const datasetsServiceMock = new MockDatasetsService();
    TestBed.configureTestingModule({
      declarations: [ VariantReportsComponent ],
      imports: [ PedigreeChartModule, FormsModule ],
      providers: [
        { provide: VariantReportsService, useValue: variantReportsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: {} },
        { provide: DatasetsService, useValue: datasetsServiceMock },
        { provide: PerfectlyDrawablePedigreeService },
        { provide: ResizeService, useClass: ResizeServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariantReportsComponent);
    component = fixture.componentInstance;

    //Stubbing the function to reduce mock test data
    component['chunkPedigrees'] = function(a, b) { return null; };

    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have denovo', () => {
    expect(component).toBeTruthy();
    expect(component.currentDenovoReport).toBeDefined();
  })
});
