import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Partitions, GeneScoresLocalState, GeneScores } from './gene-scores';
import { GeneScoresService } from './gene-scores.service';
import { ReplaySubject, Observable, combineLatest, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfigService } from '../config/config.service';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { ValidateNested } from 'class-validator';
import { environment } from 'environments/environment';
import { ComponentValidator } from 'app/common/component-validator';
import { selectGeneScores, setGeneScore, setGeneScoresHistogramValues } from './gene-scores.state';

@Component({
  encapsulation: ViewEncapsulation.None, // TODO: What is this?
  selector: 'gpf-gene-scores',
  templateUrl: './gene-scores.component.html',
  styleUrls: ['./gene-scores.component.css'],
})
export class GeneScoresComponent extends ComponentValidator implements OnInit {
  private rangeChanges = new ReplaySubject<[string, number, number]>(1);
  private partitions: Observable<Partitions>;

  public geneScoresArray: GeneScores[];
  public rangesCounts: Observable<Array<number>>;
  public downloadUrl: string;

  @ValidateNested() public geneScoresLocalState = new GeneScoresLocalState();

  public imgPathPrefix = environment.imgPathPrefix;

  public constructor(
    protected store: Store,
    private geneScoresService: GeneScoresService,
    private config: ConfigService
  ) {
    super(store, 'geneScores', selectGeneScores);
    this.partitions = this.rangeChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      switchMap(([score, internalRangeStart, internalRangeEnd]) =>
        this.geneScoresService.getPartitions(score, internalRangeStart, internalRangeEnd)
      ),
      catchError(error => {
        console.warn(error);
        return of(null);
      })
    );

    this.rangesCounts = this.partitions.pipe(
      map((partitions) =>
        [partitions.leftCount, partitions.midCount, partitions.rightCount]
      )
    );
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.geneScoresService.getGeneScores().pipe(
      switchMap(geneScores =>
        combineLatest([of(geneScores), this.store.select(selectGeneScores).pipe(take(1))])
      )
    ).subscribe(([geneScores, state]) => {
      this.geneScoresArray = geneScores;

      if (state.score !== null) {
        for (const score of this.geneScoresArray) {
          if (score.score === state.score) {
            this.selectedGeneScores = score;
            this.rangeStart = state.rangeStart;
            this.rangeEnd = state.rangeEnd;
            break;
          }
        }
      } else {
        this.selectedGeneScores = this.geneScoresArray[0];
      }
    });
    if (this.geneScoresLocalState.score !== null && this.rangeStart !== null && this.rangeEnd !== null) {
      this.updateHistogramState();
    }
  }

  private updateLabels(): void {
    this.rangeChanges.next([
      this.geneScoresLocalState.score?.score,
      this.rangeStart,
      this.rangeEnd
    ]);
  }

  private updateHistogramState(): void {
    this.updateLabels();
    this.store.dispatch(setGeneScoresHistogramValues({
      score: this.selectedGeneScores.score,
      rangeStart: this.geneScoresLocalState.rangeStart,
      rangeEnd: this.geneScoresLocalState.rangeEnd,
    }));
  }

  public get selectedGeneScores(): GeneScores {
    return this.geneScoresLocalState.score;
  }

  public set selectedGeneScores(selectedGeneScores: GeneScores) {
    this.geneScoresLocalState.score = selectedGeneScores;
    this.changeDomain(selectedGeneScores);
    this.rangeStart = this.geneScoresLocalState.domainMin;
    this.rangeEnd = this.geneScoresLocalState.domainMax;
    this.updateLabels();
    this.downloadUrl = this.getDownloadUrl();
    this.store.dispatch(setGeneScore({
      score: this.geneScoresLocalState.score.score,
      rangeStart: this.geneScoresLocalState.rangeStart,
      rangeEnd: this.geneScoresLocalState.rangeEnd,
    }));
  }

  public set rangeStart(range: number) {
    this.geneScoresLocalState.rangeStart = range;
    this.updateHistogramState();
  }

  public get rangeStart(): number {
    return this.geneScoresLocalState.rangeStart;
  }

  public set rangeEnd(range: number) {
    this.geneScoresLocalState.rangeEnd = range;
    this.updateHistogramState();
  }

  public get rangeEnd(): number {
    return this.geneScoresLocalState.rangeEnd;
  }

  private getDownloadUrl(): string {
    if (this.selectedGeneScores !== undefined) {
      return `${this.config.baseUrl}gene_scores/download/${this.selectedGeneScores.score}`;
    }
  }

  private changeDomain(scores: GeneScores): void {
    if (scores !== undefined) {
      if (scores.domain !== null) {
        this.geneScoresLocalState.domainMin = scores.domain[0];
        this.geneScoresLocalState.domainMax = scores.domain[1];
      } else {
        this.geneScoresLocalState.domainMin = scores?.bins[0];
        this.geneScoresLocalState.domainMax = scores?.bins[scores.bins.length - 1];
      }
    }
  }
}
