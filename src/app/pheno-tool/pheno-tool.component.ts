import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Dataset } from '../datasets/datasets';
import { FullscreenLoadingService } from '../fullscreen-loading/fullscreen-loading.service';
import { PhenoToolService } from './pheno-tool.service';
import { PhenoToolResults } from './pheno-tool-results';
import { ConfigService } from '../config/config.service';
import { combineLatest, Subscription, switchMap, take } from 'rxjs';
import { selectPhenoToolMeasure } from 'app/pheno-tool-measure/pheno-tool-measure.state';
import { Store } from '@ngrx/store';
import {
  PHENO_TOOL_CNV, PHENO_TOOL_INITIAL_VALUES, PHENO_TOOL_LGDS, PHENO_TOOL_OTHERS
} from 'app/pheno-tool-effect-types/pheno-tool-effect-types';
import { selectDatasetId } from 'app/datasets/datasets.state';
import { DatasetsService } from 'app/datasets/datasets.service';
import { selectGeneScores } from 'app/gene-scores/gene-scores.state';
import { selectGeneSets } from 'app/gene-sets/gene-sets.state';
import { selectGeneSymbols } from 'app/gene-symbols/gene-symbols.state';
import {
  PresentInParent,
  selectPresentInParent,
  setPresentInParent
} from 'app/present-in-parent/present-in-parent.state';
import { selectEffectTypes, setEffectTypes } from 'app/effect-types/effect-types.state';
import { selectErrors } from 'app/common/errors.state';
import { selectFamilyTags } from 'app/family-tags/family-tags.state';
import { selectFamilyIds } from 'app/family-ids/family-ids.state';
import { selectPersonFilters } from 'app/person-filters/person-filters.state';
import {
  selectFamilyMeasureHistograms,
  selectPersonMeasureHistograms
} from 'app/person-filters-selector/measure-histogram.state';
import { selectGenomicScores } from 'app/genomic-scores-block/genomic-scores-block.state';

@Component({
  selector: 'gpf-pheno-tool',
  templateUrl: './pheno-tool.component.html',
  styleUrls: ['./pheno-tool.component.css'],
  standalone: false
})
export class PhenoToolComponent implements OnInit, OnDestroy {
  public selectedDataset: Dataset;
  public variantTypesSet: Set<string>;

  public phenoToolResults: PhenoToolResults;
  public phenoToolState: object;

  public disableQueryButtons = false;

  private phenoToolSubscription: Subscription = null;

  public constructor(
    private loadingService: FullscreenLoadingService,
    private phenoToolService: PhenoToolService,
    public readonly configService: ConfigService,
    private store: Store,
    private datasetsService: DatasetsService
  ) { }


  @HostListener('keydown', ['$event'])
  public onKeyDown($event: KeyboardEvent): void {
    if ($event.ctrlKey && $event.code === 'Enter') {
      this.submitQuery();
    }
  }

  public ngOnInit(): void {
    this.store.select(selectDatasetId).pipe(
      take(1),
      switchMap(datasetId => combineLatest([
        this.datasetsService.getDataset(datasetId),
        this.store.select(selectPresentInParent),
        this.store.select(selectEffectTypes),
      ]).pipe(take(1)))
    ).subscribe(([
      dataset,
      presentInParentState,
      effectTypesState
    ]) => {
      if (!dataset) {
        return;
      }
      this.selectedDataset = dataset;
      this.variantTypesSet = new Set(this.selectedDataset.genotypeBrowserConfig.variantTypes);

      this.setPresentInParentDefaultState(presentInParentState);
      this.setEffecTypesDefaultState(effectTypesState);
    });

    this.createPhenoToolState();

    this.loadingService.interruptEvent.subscribe(() => {
      if (this.phenoToolSubscription !== null) {
        this.phenoToolSubscription.unsubscribe();
        this.phenoToolSubscription = null;
      }
      this.loadingService.setLoadingStop();
      this.phenoToolResults = null;
    });

    this.store.select(selectErrors).subscribe(errorsState => {
      setTimeout(() => {
        this.disableQueryButtons = errorsState.length > 0;
      });
    });
  }

  public ngOnDestroy(): void {
    this.loadingService.setLoadingStop();
  }

  public setPresentInParentDefaultState(presentInParentState: PresentInParent): void {
    if (!presentInParentState.presentInParent.length) {
      let selectedPresentInParentValues = ['mother only', 'father only', 'mother and father', 'neither'];
      let selectedRarityType = 'ultraRare';
      const rarityIntervalStart = 0;
      const rarityIntervalEnd = 1;
      if (this.selectedDataset.hasDenovo) {
        selectedPresentInParentValues = ['neither'];
        selectedRarityType = '';
      }
      this.store.dispatch(setPresentInParent({
        presentInParent: {
          presentInParent: selectedPresentInParentValues,
          rarity: {
            rarityType: selectedRarityType,
            rarityIntervalStart: rarityIntervalStart,
            rarityIntervalEnd: rarityIntervalEnd,
          }
        }
      }));
    }
  }

  public setEffecTypesDefaultState(effectTypesState: string[]): void {
    if (!effectTypesState.length) {
      this.store.dispatch(
        setEffectTypes({effectTypes: [...PHENO_TOOL_INITIAL_VALUES.values()]})
      );
    }
  }

  public createPhenoToolState(): void {
    combineLatest([
      this.store.select(selectGeneSymbols),
      this.store.select(selectGeneSets),
      this.store.select(selectGeneScores),
      this.store.select(selectPhenoToolMeasure),
      this.store.select(selectEffectTypes),
      this.store.select(selectPresentInParent),
      this.store.select(selectFamilyTags),
      this.store.select(selectFamilyIds),
      this.store.select(selectPersonFilters),
      this.store.select(selectFamilyMeasureHistograms),
      this.store.select(selectPersonMeasureHistograms),
      this.store.select(selectGenomicScores),
    ]).subscribe(([
      geneSymbolsState,
      geneSetsState,
      geneScoresState,
      phenoToolMeasureState,
      effectTypesState,
      presentInParentState,
      familyTagsState,
      familyIdsState,
      personFiltersState,
      familyMeasureHistogramsState,
      personMeasureHistogramsState,
      genomicScoresState,
    ]) => {
      const presentInParent = {
        presentInParent: presentInParentState.presentInParent,
        rarity: {}
      };

      if (presentInParentState.rarity.rarityType === 'ultraRare') {
        presentInParent['rarity']['ultraRare'] = true;
      } else {
        presentInParent['rarity']['ultraRare'] = false;
      }

      if (
        presentInParentState.rarity.rarityType === 'rare'
        || presentInParentState.rarity.rarityType === 'interval'
      ) {
        presentInParent['rarity']['minFreq'] = presentInParentState.rarity.rarityIntervalStart;
        presentInParent['rarity']['maxFreq'] = presentInParentState.rarity.rarityIntervalEnd;
      }

      this.phenoToolState = {
        ...geneSymbolsState.length && {geneSymbols: geneSymbolsState},
        ...geneSetsState.geneSet && { geneSet: {
          geneSet: geneSetsState.geneSet.name,
          geneSetsCollection: geneSetsState.geneSetsCollection.name,
          geneSetsTypes: geneSetsState.geneSetsTypes
        }},
        ...geneScoresState.score && {geneScores: geneScoresState},
        ...phenoToolMeasureState,
        effectTypes: effectTypesState,
        presentInParent: presentInParent,
        ...!familyTagsState?.tagIntersection && {tagIntersection: familyTagsState.tagIntersection},
        ...familyTagsState.selectedFamilyTags?.length && {selectedFamilyTags: familyTagsState.selectedFamilyTags},
        ...familyTagsState.deselectedFamilyTags?.length
            && {deselectedFamilyTags: familyTagsState.deselectedFamilyTags},
        ...familyIdsState?.length && {familyIds: familyIdsState},
        ...personFiltersState?.familyFilters?.length && {familyFilters: personFiltersState.familyFilters},
        ...familyMeasureHistogramsState?.length && { familyPhenoFilters: familyMeasureHistogramsState.map(s => ({
          source: s.measure,
          isFamily: true,
          histogramType: s.histogramType,
          min: s.rangeStart,
          max: s.rangeEnd,
          values: s.values,
          roles: s.roles
        }))},
        ...personMeasureHistogramsState?.length && { personFiltersBeta: personMeasureHistogramsState.map(s => ({
          source: s.measure,
          isFamily: false,
          histogramType: s.histogramType,
          min: s.rangeStart,
          max: s.rangeEnd,
          values: s.values,
          roles: s.roles
        }))},
        ...{genomicScores: genomicScoresState},
      };

      this.phenoToolResults = null;
    });
  }

  public submitQuery(): void {
    this.phenoToolResults = null;
    this.loadingService.setLoadingStart();
    this.phenoToolSubscription = this.phenoToolService.getPhenoToolResults(
      {datasetId: this.selectedDataset.id, ...this.phenoToolState}
    ).subscribe((phenoToolResults) => {
      this.phenoToolResults = phenoToolResults;
      const columnSortOrder = [
        ...PHENO_TOOL_LGDS, ...PHENO_TOOL_OTHERS, ...PHENO_TOOL_CNV
      ].map(effect => effect.toLowerCase());
      this.phenoToolResults.results.sort((a, b) =>
        columnSortOrder.indexOf(a.effect.toLowerCase()) - columnSortOrder.indexOf(b.effect.toLowerCase())
      );

      this.loadingService.setLoadingStop();
    }, () => {
      this.loadingService.setLoadingStop();
    }, () => {
      this.loadingService.setLoadingStop();
    });
  }

  public onDownload(event: Event): void {
    if (event.target instanceof HTMLFormElement) {
      const queryData = event.target.queryData as HTMLInputElement;
      queryData.value = JSON.stringify({...this.phenoToolState, datasetId: this.selectedDataset.id});
      event.target.submit();
    }
  }
}
