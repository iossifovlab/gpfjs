import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GeneWeights, Partitions, GeneWeightsLocalState } from './gene-weights';
import { GeneWeightsService } from './gene-weights.service';
// tslint:disable-next-line:import-blacklist
import { ReplaySubject ,  Observable, combineLatest, of } from 'rxjs';

import { Store } from '@ngxs/store';
import { ConfigService } from '../config/config.service';

import { SetGeneWeight, SetHistogramValues, GeneWeightsState } from './gene-weights.state';
import { switchMap } from 'rxjs/operators';
import { StatefulComponent } from 'app/common/stateful-component';
import { ValidateNested } from 'class-validator';

@Component({
  encapsulation: ViewEncapsulation.None, // TODO: What is this?
  selector: 'gpf-gene-weights',
  templateUrl: './gene-weights.component.html',
})
export class GeneWeightsComponent extends StatefulComponent implements OnInit {
  private rangeChanges = new ReplaySubject<[string, number, number]>(1);
  private partitions: Observable<Partitions>;

  geneWeightsArray: GeneWeights[];
  rangesCounts: Observable<Array<number>>;

  @ValidateNested()
  geneWeightsLocalState = new GeneWeightsLocalState();

  constructor(
    protected store: Store,
    private geneWeightsService: GeneWeightsService,
    private config: ConfigService,
  ) {
    super(store, GeneWeightsState, 'geneWeights');
    this.partitions = this.rangeChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(([weight, internalRangeStart, internalRangeEnd]) => {
        return this.geneWeightsService.getPartitions(weight, internalRangeStart, internalRangeEnd);
      })
      .catch(error => {
        console.warn(error);
        return Observable.of(null);
      });

    this.rangesCounts = this.partitions.map((partitions) => {
       return [partitions.leftCount, partitions.midCount, partitions.rightCount];
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.geneWeightsService.getGeneWeights().pipe(
      switchMap(geneWeights => {
        return combineLatest(
          of(geneWeights),
          this.store.selectOnce(state => state.geneWeightsState)
        );
      })
    ).subscribe(([geneWeights, state]) => {
      this.geneWeightsArray = geneWeights;
      // restore state
      if (state.geneWeight !== null) {
        for (const geneWeight of this.geneWeightsArray) {
          if (geneWeight.weight === state.geneWeight.weight) {
            this.selectedGeneWeights = geneWeight;
            this.rangeStart = state.rangeStart;
            this.rangeEnd = state.rangeEnd;
            break;
          }
        }
      } else {
        this.selectedGeneWeights = this.geneWeightsArray[0];
      }
    });
}

  private updateLabels() {
    this.rangeChanges.next([
      this.geneWeightsLocalState.weight.weight,
      this.rangeStart,
      this.rangeEnd
    ]);
  }

  updateHistogramState() {
    this.updateLabels();
    this.store.dispatch(new SetHistogramValues(
      this.geneWeightsLocalState.rangeStart,
      this.geneWeightsLocalState.rangeEnd,
    ));
  }

  get selectedGeneWeights() {
    return this.geneWeightsLocalState.weight;
  }

  set selectedGeneWeights(selectedGeneWeights: GeneWeights) {
    this.geneWeightsLocalState.weight = selectedGeneWeights;
    this.rangeStart = null;
    this.rangeEnd = null;
    this.changeDomain(selectedGeneWeights);
    this.updateLabels();
    this.store.dispatch(new SetGeneWeight(this.geneWeightsLocalState.weight));
  }

  set rangeStart(range: number) {
    this.geneWeightsLocalState.rangeStart = range;
    this.updateHistogramState();
  }

  get rangeStart() {
    return this.geneWeightsLocalState.rangeStart;
  }

  set rangeEnd(range: number) {
    this.geneWeightsLocalState.rangeEnd = range;
    this.updateHistogramState();
  }

  get rangeEnd() {
    return this.geneWeightsLocalState.rangeEnd;
  }

  getDownloadLink(): string {
    return `${this.config.baseUrl}gene_weights/download/${this.selectedGeneWeights.weight}`;
  }

  changeDomain(weights: GeneWeights) {
    if (weights.domain !== null) {
      this.geneWeightsLocalState.domainMin = weights.domain[0];
      this.geneWeightsLocalState.domainMax = weights.domain[1];
    } else {
      this.geneWeightsLocalState.domainMin = weights.bins[0];
      this.geneWeightsLocalState.domainMax = weights.bins[weights.bins.length - 1];
    }
  }
}
