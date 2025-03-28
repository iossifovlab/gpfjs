import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'app/config/config.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { GeneScoresComponent } from './gene-scores.component';
import { GeneScoresService } from './gene-scores.service';
import { geneScoresReducer, setGeneScoreCategorical, setGeneScoreContinuous } from './gene-scores.state';
import { Store, StoreModule } from '@ngrx/store';
import { GenomicScore } from 'app/genomic-scores-block/genomic-scores-block';
import { NumberHistogram, CategoricalHistogramView, CategoricalHistogram } from 'app/utils/histogram-types';


class MockGeneScoresService {
  public provide = true;
  public getGeneScores(): Observable<GenomicScore[]> {
    if (this.provide) {
      return of([
        new GenomicScore(
          'desc1',
          'help1',
          'score1',
          new NumberHistogram([1, 2], [4, 5], 'larger1', 'smaller1', 7, 8, true, true),
        ),
        new GenomicScore(
          'desc2',
          'help2',
          'score2',
          new NumberHistogram([11, 12], [14, 15], 'larger2', 'smaller2', 17, 88, true, true),
        )
      ]);
    } else {
      return of([] as GenomicScore[]);
    }
  }
}
describe('GeneScoresComponent', () => {
  let component: GeneScoresComponent;
  let fixture: ComponentFixture<GeneScoresComponent>;
  let mockGeneScoresService: MockGeneScoresService;
  let store: Store;

  beforeEach(() => {
    mockGeneScoresService = new MockGeneScoresService();

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({geneScores: geneScoresReducer}), NgbNavModule
      ],
      declarations: [GeneScoresComponent],
      providers: [
        {provide: GeneScoresService, useValue: mockGeneScoresService},
        ConfigService,
        provideHttpClientTesting()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(GeneScoresComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should test setting gene scores', () => {
    fixture.detectChanges();
    expect(component.selectedGeneScore.score).toBe('score1');
  });

  it('should test empty gene scores', () => {
    mockGeneScoresService.provide = false;
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('div > div.form-block > div.card > ul > li > span'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('div > div#gene-scores-panel'))).not.toBeTruthy();
  });

  it('should load default score', () => {
    component.ngOnInit();
    expect(component.selectedGeneScore.score).toBe('score1');
  });

  it('should continuous histogram load from state', () => {
    jest.spyOn(store, 'select').mockReturnValue(of({
      histogramType: 'continuous',
      score: 'score2',
      rangeStart: 10,
      rangeEnd: 20,
      values: null,
      categoricalView: null,
    }));

    component.ngOnInit();

    expect(component.selectedGeneScore.score).toBe('score2');
    expect(component.rangeStart).toBe(10);
    expect(component.rangeEnd).toBe(20);
  });

  it('should categorical histogram load from state', () => {
    jest.spyOn(store, 'select').mockReturnValue(of({
      histogramType: 'categorical',
      score: 'score1',
      rangeStart: 10,
      rangeEnd: 20,
      values: ['name2', 'name5'],
      categoricalView: 'click selector',
    }));

    component.ngOnInit();

    expect(component.selectedGeneScore.score).toBe('score1');
    expect(component.categoricalValues).toStrictEqual(['name2', 'name5']);
    expect(component.selectedCategoricalHistogramView).toBe('click selector');
  });

  it('should toggle categorical histogram values and save to state', () => {
    const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
    component.geneScoresLocalState.score = new GenomicScore('desc', 'help', 'score1', null);

    const values = ['name5', 'name2'];
    component.categoricalValues = ['name1', 'name2', 'name3'];
    component.toggleCategoricalValues(values);
    expect(dispatchSpy).toHaveBeenCalledWith(setGeneScoreCategorical({
      score: 'score1',
      values: ['name1', 'name3', 'name5'],
      categoricalView: 'range selector',
    }));
  });

  it('should switch categorical histogram view', () => {
    const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
    component.geneScoresLocalState.score = new GenomicScore('desc', 'help', 'score1', null);
    component.selectedCategoricalHistogramView = 'range selector';
    component.categoricalValues = ['name1', 'name2', 'name3'];

    component.switchCategoricalHistogramView('click selector' as CategoricalHistogramView);

    expect(component.selectedCategoricalHistogramView).toBe('click selector');
    expect(component.categoricalValues).toStrictEqual([]);

    expect(dispatchSpy).toHaveBeenCalledWith(setGeneScoreCategorical({
      score: 'score1',
      values: [],
      categoricalView: 'click selector',
    }));
  });

  it('should reset categorical histogram view if the view is not switched', () => {
    const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
    component.selectedCategoricalHistogramView = 'click selector';
    component.categoricalValues = ['name1', 'name2', 'name3'];

    component.switchCategoricalHistogramView('click selector' as CategoricalHistogramView);

    expect(component.selectedCategoricalHistogramView).toBe('click selector');
    expect(component.categoricalValues).toStrictEqual(['name1', 'name2', 'name3']);

    expect(dispatchSpy).not.toHaveBeenCalledWith();
  });

  it('should set default categorical histogram view', () => {
    const scoreWithValuesOrder = new GenomicScore('desc', 'help', 'score1', new CategoricalHistogram(
      [
        {name: 'name1', value: 10},
        {name: 'name2', value: 20},
        {name: 'name3', value: 30},
      ],
      ['name3', 'name1', 'name2'],
      'large value descriptions',
      'small value descriptions',
      true,
      0
    ));
    component.selectedCategoricalHistogramView = 'range selector';
    component.selectedGeneScore = scoreWithValuesOrder;
    expect(component.selectedCategoricalHistogramView).toBe('range selector');

    const scoreWithoutValuesOrder = new GenomicScore('desc', 'help', 'score1', new CategoricalHistogram(
      [
        {name: 'name1', value: 10},
        {name: 'name2', value: 20},
        {name: 'name3', value: 30},
      ],
      null,
      'large value descriptions',
      'small value descriptions',
      true,
      0
    ));
    component.selectedGeneScore = scoreWithoutValuesOrder;
    expect(component.selectedCategoricalHistogramView).toBe('click selector');
  });

  it('should set default ranges for continuous histogram as domain', () => {
    const score = new GenomicScore(
      'desc',
      'help',
      'score1',
      new NumberHistogram([1, 2], [4, 5], 'larger1', 'smaller1', null, null, true, true),
    );

    component.selectedGeneScore = score;
    expect(component.geneScoresLocalState.domainMin).toBe(4);
    expect(component.geneScoresLocalState.domainMax).toBe(5);
  });

  it('should set domain using number histogram min and max ranges', () => {
    const score = new GenomicScore(
      'desc',
      'help',
      'score1',
      new NumberHistogram([1, 2], [4, 5], 'larger1', 'smaller1', 2, 500, true, true),
    );

    component.selectedGeneScore = score;
    expect(component.geneScoresLocalState.domainMin).toBe(2);
    expect(component.geneScoresLocalState.domainMax).toBe(500);
  });

  it('should set and get range start', () => {
    const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
    const score = new GenomicScore(
      'desc',
      'help',
      'score1',
      new NumberHistogram([1, 2], [4, 5], 'larger1', 'smaller1', 2, 500, true, true),
    );

    component.geneScoresLocalState.score = score;
    component.geneScoresLocalState.rangeStart = 0;
    component.geneScoresLocalState.rangeEnd = 10;
    component.rangeStart = 3;

    expect(component.geneScoresLocalState.rangeStart).toBe(3);

    expect(dispatchSpy).toHaveBeenCalledWith(setGeneScoreContinuous({
      score: 'score1',
      rangeStart: 3,
      rangeEnd: 10,
    }));
    expect(component.rangeStart).toBe(3);
  });

  it('should set and get range end', () => {
    const dispatchSpy = jest.spyOn(component['store'], 'dispatch');
    const score = new GenomicScore(
      'desc',
      'help',
      'score1',
      new NumberHistogram([1, 2], [4, 5], 'larger1', 'smaller1', 2, 500, true, true),
    );

    component.geneScoresLocalState.score = score;
    component.geneScoresLocalState.rangeStart = 0;
    component.geneScoresLocalState.rangeEnd = 10;
    component.rangeEnd = 3;

    expect(component.geneScoresLocalState.rangeEnd).toBe(3);

    expect(dispatchSpy).toHaveBeenCalledWith(setGeneScoreContinuous({
      score: 'score1',
      rangeStart: 0,
      rangeEnd: 3,
    }));
    expect(component.rangeEnd).toBe(3);
  });
});

