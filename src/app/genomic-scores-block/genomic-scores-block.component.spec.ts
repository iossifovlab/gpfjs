import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MarkdownModule } from 'ngx-markdown';

// tslint:disable-next-line:import-blacklist
import { Observable, of } from 'rxjs';

import { GenomicScoresBlockComponent } from './genomic-scores-block.component';
import { GenomicScoresBlockService } from './genomic-scores-block.service';
import { GenomicScoresBlockState } from './genomic-scores-block.state';
import { GenomicScores } from './genomic-scores-block';
import { GenomicScoresComponent } from 'app/genomic-scores/genomic-scores.component';
import { GenomicScoreState, GenomicScoresState } from 'app/genomic-scores/genomic-scores-store';
import { PopupComponent } from 'app/popup/popup.component';
import { HistogramComponent } from 'app/histogram/histogram.component';
import { HistogramRangeSelectorLineComponent } from 'app/histogram/histogram-range-selector-line.component';
import { ErrorsAlertComponent } from 'app/errors-alert/errors-alert.component';
import { AddButtonComponent } from 'app/add-button/add-button.component';
import { RemoveButtonComponent } from 'app/remove-button/remove-button.component';
import { NgxsModule } from '@ngxs/store';

const GENOMIC_SCORES_OBJECTS: GenomicScores[] = [GenomicScores.fromJson({
  bars: [1, 2, 3], score: 'GenomicScores', bins: [4, 5, 6], range: [1, 3],
  desc: 'Genomic Scores description', help: 'gs help', xscale: 'log', yscale: 'linear'
})];

class MockGenomicScoresBlockService {

  getGenomicScores(): Observable<GenomicScores[]> {
    return of(GENOMIC_SCORES_OBJECTS);
  }
}

const STATE_RESTORE_OBJECT: any = {
  genomicScores: [{
    metric: 'GenomicScores',
    rangeStart: 2,
    rangeEnd: 2
  }]
};

describe('GenomicScoresBlockComponent', () => {
  let component: GenomicScoresBlockComponent;
  let fixture: ComponentFixture<GenomicScoresBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        GenomicScoresBlockComponent,
        GenomicScoresComponent,
        PopupComponent,
        HistogramComponent,
        HistogramRangeSelectorLineComponent,
        ErrorsAlertComponent,
        AddButtonComponent,
        RemoveButtonComponent,
      ],
      imports: [
        NgbModule,
        FormsModule,
        MarkdownModule,
        NgxsModule.forRoot([GenomicScoresBlockState]),
      ],
      providers: [
        { provide: GenomicScoresBlockService, useClass: MockGenomicScoresBlockService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenomicScoresBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.genomicScoresState = new GenomicScoresState();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the genomic scores', () => {
    component.ngOnInit();
    expect(component.genomicScoresArray).toBe(GENOMIC_SCORES_OBJECTS);
  });

  it('should give image path prefix', () => {
    expect(component.imgPathPrefix).toBe('assets/');
  });

  it('should add and remove filter', () => {
    const genomicScores: GenomicScores = GenomicScores.fromJson({
      bars: [1, 2, 3], score: 'GenomicScores', bins: [4, 5, 6], range: [1, 3],
      desc: 'Genomic Scores description', help: 'gs help', xscale: 'log', yscale: 'linear'
    });
    const genomicScoreState = new GenomicScoreState(genomicScores);

    component.genomicScoresArray = [genomicScores];

    const newGenomicScores: GenomicScores = GenomicScores.fromJson({
      bars: [4, 5, 6], score: 'NewGenomicScores', bins: [7, 8, 9], range: [4, 6],
      desc: 'New Genomic Scores description', help: 'new gs help', xscale: 'linear', yscale: 'log'
    });
    const newGenomicScoreState = new GenomicScoreState(newGenomicScores);

    expect(component.genomicScoresState.genomicScoresState).toEqual([]);
    component.addFilter();
    expect(component.genomicScoresState.genomicScoresState.length).toBe(1);
    expect(component.genomicScoresState.genomicScoresState).toContain(genomicScoreState);
    component.addFilter(newGenomicScoreState);
    expect(component.genomicScoresState.genomicScoresState.length).toBe(2);
    expect(component.genomicScoresState.genomicScoresState).toContain(genomicScoreState);
    expect(component.genomicScoresState.genomicScoresState).toContain(newGenomicScoreState);

    component.removeFilter(newGenomicScoreState);
    expect(component.genomicScoresState.genomicScoresState.length).toBe(1);
    expect(component.genomicScoresState.genomicScoresState).toContain(genomicScoreState);
  });
});
