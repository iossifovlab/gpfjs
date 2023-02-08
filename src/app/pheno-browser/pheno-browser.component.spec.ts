import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PhenoBrowserComponent } from './pheno-browser.component';
import { DatasetsService } from '../datasets/datasets.service';
import { PhenoBrowserService } from './pheno-browser.service';
import { PhenoInstruments, PhenoInstrument, PhenoMeasures, PhenoMeasure } from './pheno-browser';
import { fakeJsonMeasureOneRegression } from './pheno-browser.spec';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GpfTableComponent } from '../table/table.component';
import { GpfTableCellComponent } from '../table/view/cell.component';
import { GpfTableEmptyCellComponent } from '../table/view/empty-cell.component';
import { GpfTableHeaderComponent } from '../table/view/header/header.component';
import { GpfTableHeaderCellComponent } from '../table/view/header/header-cell.component';
import { PhenoBrowserTableComponent } from '../pheno-browser-table/pheno-browser-table.component';
import { GpfTableColumnComponent } from '../table/component/column.component';
import { GpfTableContentHeaderComponent } from '../table/component/header.component';
import { GpfTableContentComponent } from '../table/component/content.component';
import { GpfTableCellContentDirective } from '../table/component/content.directive';
import { GpfTableSubcontentComponent } from '../table/component/subcontent.component';
import { GpfTableSubheaderComponent } from '../table/component/subheader.component';
import { NumberWithExpPipe } from '../utils/number-with-exp.pipe';
import { PValueIntensityPipe } from '../utils/p-value-intensity.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { ResizeService } from '../table/resize.service';
import { By } from '@angular/platform-browser';
import { ConfigService } from 'app/config/config.service';
import { RegressionComparePipe } from 'app/utils/regression-compare.pipe';
import { GetRegressionIdsPipe } from 'app/utils/get-regression-ids.pipe';
import { BackgroundColorPipe } from 'app/utils/background-color.pipe';
import * as saveAs from 'file-saver';

const fakeJsonMeasurei1 = JSON.parse(JSON.stringify(fakeJsonMeasureOneRegression));
fakeJsonMeasurei1.instrument_name = 'i1';
fakeJsonMeasurei1.measure_id = 'i1.test_measure';
fakeJsonMeasurei1.measure_name = 'test_measure';
fakeJsonMeasurei1.regressions[0].measure_id = 'i1.test_measure';

class MockPhenoBrowserService {
  public getInstruments(): Observable<PhenoInstruments> {
    return of(new PhenoInstruments('i1', ['i1', 'i2', 'i3']));
  }

  public getMeasures(): Observable<PhenoMeasure> {
    const measures = PhenoMeasure.fromJson(fakeJsonMeasurei1);
    return of(measures);
  }

  public getMeasuresInfo(): Observable<PhenoMeasures> {
    const measuresInfo = PhenoMeasures.fromJson(
      {base_image_url: 'base', has_descriptions: true, regression_names: {age: 'age'}}
    );
    return of(measuresInfo);
  }

  public getDownloadLink(instrument: PhenoInstrument, datasetId: string): string {
    return `${environment.apiPath}pheno_browser/download`
           + `?dataset_id=${datasetId}&instrument=${instrument}`;
  }

  public downloadMeasures(): Observable<Blob> {
    return of([] as any);
  }
}

class MockDatasetsService {
  public getSelectedDataset = (): object => ({accessRights: true, id: 'testDatasetId'});
  public getDatasetsLoadedObservable = (): Observable<void> => of();
}

class MockActivatedRoute {
  public params = {dataset: 'testDatasetId', get: (): string => ''};
  public parent = {params: of(this.params)};

  public queryParamMap = of(this.params);
}

class MockRouter {
  public createUrlTree(commands: any[], navigationExtras: any) {
    return `${navigationExtras.queryParams.instrument}/${navigationExtras.queryParams.search}`;
  }
}

function setQuery(fixture: ComponentFixture<PhenoBrowserComponent>, instrument: number, search: string) {
  const selectElem = fixture.nativeElement.querySelector('select');
  const searchElem = fixture.nativeElement.querySelector('input');
  const selectedOptionElem = fixture.debugElement.queryAll(By.css('option'))[instrument];
  selectElem.value = selectedOptionElem.nativeElement.value;
  selectElem.dispatchEvent(new Event('change'));
  searchElem.value = search;
  searchElem.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}

describe('PhenoBrowserComponent', () => {
  let component: PhenoBrowserComponent;
  let fixture: ComponentFixture<PhenoBrowserComponent>;
  let router;
  let location: Location;
  const activatedRoute = new MockActivatedRoute();
  const phenoBrowserServiceMock = new MockPhenoBrowserService();
  const datasetServiceMock = new MockDatasetsService();

  let locationSpy;
  const resizeSpy = {
    addResizeEventListener: jest.fn()
  };

  beforeEach(waitForAsync(() => {
    locationSpy = {
      replaceState: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, NgbModule],
      declarations: [GpfTableHeaderComponent, GpfTableHeaderCellComponent,
        GpfTableComponent, GpfTableCellComponent,
        GpfTableEmptyCellComponent, PhenoBrowserTableComponent,
        GpfTableColumnComponent, GpfTableContentComponent,
        GpfTableContentHeaderComponent, GpfTableSubcontentComponent,
        GpfTableSubheaderComponent, NumberWithExpPipe,
        PValueIntensityPipe, GpfTableCellContentDirective, RegressionComparePipe,
        PhenoBrowserComponent, GetRegressionIdsPipe, BackgroundColorPipe],
      providers: [
        PhenoBrowserComponent,
        { provide: DatasetsService, useValue: datasetServiceMock },
        { provide: PhenoBrowserService, useValue: phenoBrowserServiceMock },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useClass: MockRouter },
        { provide: Location, useValue: locationSpy },
        { provide: PValueIntensityPipe, useClass: PValueIntensityPipe },
        { provide: ResizeService, useValue: resizeSpy },
        ConfigService
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture = TestBed.createComponent(PhenoBrowserComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list all instruments', waitForAsync(() => {
    const expectedInstruments = ['All instruments', 'i1', 'i2', 'i3'];
    const selectElemOptions = fixture.debugElement.queryAll(By.css('option'));

    const receivedInstruments = [];
    for (const option of selectElemOptions) {
      receivedInstruments.push(option.nativeElement.textContent);
    }
    expect(receivedInstruments).toEqual(expect.arrayContaining(expectedInstruments));
  }));

  it('should set the selected instrument to all instruments by default', (done) => {
    fixture.whenStable().then(() => {
      component.selectedInstrument$.subscribe(value => {
        expect(value).toEqual(''),
        done();
      });
    });
  });

  it('should set the selected instrument in the component correctly', (done) => {
    setQuery(fixture, 2, '');
    fixture.whenStable().then(() => {
      component.selectedInstrument$.subscribe(value => {
        expect(value).toEqual('i2');
        done();
      });
    });
  });

  it('should pass search terms to the service correctly', waitForAsync(() => {
    jest.spyOn(phenoBrowserServiceMock, 'getMeasures');
    setQuery(fixture, 1, 'q10');
    fixture.whenStable().then(() => {
      expect(phenoBrowserServiceMock.getMeasures).toHaveBeenCalledTimes(2);
      expect(phenoBrowserServiceMock.getMeasures).toHaveBeenCalledWith('testDatasetId', 'i1', '');
      expect(phenoBrowserServiceMock.getMeasures).toHaveBeenCalledWith('testDatasetId', 'i1', 'q10');
    });
  }));

  it('should set the url with the selected instrument and search term', waitForAsync(() => {
    jest.spyOn(router, 'createUrlTree');
    setQuery(fixture, 2, 'q12');
    fixture.whenStable().then(() => {
      expect(router.createUrlTree).toHaveBeenCalledTimes(2);
      expect(router.createUrlTree).toHaveBeenCalledWith(['.'], {
        relativeTo: activatedRoute,
        queryParams: {instrument: 'i2', search: 'q12'}
      });
    });
  }));

  it('should set the selected instrument and search term from the url', waitForAsync(() => {
    setQuery(fixture, 3, 'q20');
    fixture.whenStable().then(() => {
      expect(location.replaceState).toHaveBeenCalledTimes(3);
      expect(location.replaceState).toHaveBeenCalledWith('i3/q20');
    });
  }));

  xit('should fetch and display all fields of a measure', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement.textContent).toEqual(expect.stringMatching('i1'));
      expect(fixture.nativeElement.textContent).toEqual(expect.stringMatching('1.00e-6'));
      expect(fixture.nativeElement.textContent).toEqual(expect.stringMatching('0.2'));
      expect(fixture.nativeElement.textContent).toEqual(expect.stringMatching('test_measure'));
      expect(fixture.nativeElement.textContent).toEqual(expect.stringMatching('ordinal'));
      expect(fixture.nativeElement.textContent).toEqual(expect.stringMatching('a test measure'));
    });
  }));

  xit('should color p values appropriately', waitForAsync(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const lowPValueElement = fixture.debugElement.queryAll(
        (dE) => dE.nativeElement.innerText === '1.00e-6')[0].children[0];
      const highPValueElement = fixture.debugElement.queryAll(
        (dE) => dE.nativeElement.innerText === '0.20')[0].children[0];
      expect(lowPValueElement.nativeElement.style.backgroundColor).toEqual('rgba(255, 0, 0, 0.8)');
      expect(highPValueElement.nativeElement.style.backgroundColor).toEqual('rgba(255, 255, 255, 0.8)');
    });
  }));

  it('should test download', () => {
    const spyOnQueryService = jest.spyOn<any, any>(phenoBrowserServiceMock, 'downloadMeasures');
    const blobSaveSpy = jest.spyOn(saveAs, 'saveAs');
    component.downloadMeasures();
    expect(blobSaveSpy).toHaveBeenCalledWith([], 'measures_testDatasetId.csv');
    expect(blobSaveSpy).toHaveBeenCalledTimes(1);
    expect(spyOnQueryService).toHaveBeenCalledWith('testDatasetId', null,
      [{base_url: undefined, description: 'a test measure', figureDistribution: 'http://localhost:8000basetest.jpg',
        figureDistributionSmall: null, index: 1, instrumentName: 'i1', measureId: 'i1.test_measure',
        measureName: 'test_measure', measureType: 'ordinal',
        regressions:
        {age: {figureRegression: 'http://localhost:8000baseimagepath',
          figureRegressionSmall: 'http://localhost:8000baseimagepathsmall', measureId: 'i1.test_measure',
          pvalueRegressionFemale: 0.2, pvalueRegressionMale: 0.000001, regressionId: 'age'}
        }, valuesDomain: '0,1'}]);
    expect(spyOnQueryService).toHaveBeenCalledTimes(1);
    expect(spyOnQueryService.mock.results).toMatchObject([{type: 'return', value: {}}]);
  });
});
