import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatasetsService } from '../datasets/datasets.service';
import { Dataset } from '../datasets/datasets';
import { FullscreenLoadingService } from '../fullscreen-loading/fullscreen-loading.service';
import { PhenoToolService } from './pheno-tool.service';
import { PhenoToolResults } from './pheno-tool-results';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { GenesBlockComponent } from 'app/genes-block/genes-block.component';
import { PhenoToolGenotypeBlockComponent } from 'app/pheno-tool-genotype-block/pheno-tool-genotype-block.component';
import { FamilyFiltersBlockComponent } from 'app/family-filters-block/family-filters-block.component';
import { PhenoToolMeasureState } from 'app/pheno-tool-measure/pheno-tool-measure.state';
import { Select, Selector } from '@ngxs/store';
import { ErrorsState, ErrorsModel } from 'app/common/errors.state';
import { downloadBlobResponse } from 'app/utils/blob-download';

@Component({
  selector: 'gpf-pheno-tool',
  templateUrl: './pheno-tool.component.html',
  styleUrls: ['./pheno-tool.component.css'],
})
export class PhenoToolComponent implements OnInit, OnDestroy {
  @Select(PhenoToolComponent.phenoToolStateSelector) public state$: Observable<object[]>;
  @Select(ErrorsState) public errorsState$: Observable<ErrorsModel>;

  public selectedDataset: Dataset;

  public phenoToolResults: PhenoToolResults;
  public phenoToolState: object;

  public disableQueryButtons = false;
  public downloadInProgress = false;

  private cancelRequest: boolean;

  public constructor(
    private datasetsService: DatasetsService,
    private loadingService: FullscreenLoadingService,
    private phenoToolService: PhenoToolService,
    public readonly configService: ConfigService,
  ) { }

  @Selector([
    GenesBlockComponent.genesBlockState,
    PhenoToolMeasureState,
    PhenoToolGenotypeBlockComponent.phenoToolGenotypeBlockQueryState,
    FamilyFiltersBlockComponent.familyFiltersBlockState,
  ])
  public static phenoToolStateSelector(
    genesBlockState: object, measureState: object, genotypeState: object, familyFiltersState: object
  ): object {
    return {
      ...genesBlockState,
      ...measureState,
      ...genotypeState,
      ...familyFiltersState,
    };
  }

  public ngOnInit(): void {
    this.selectedDataset = this.datasetsService.getSelectedDataset();

    this.state$.subscribe(state => {
      this.phenoToolState = state;
      this.phenoToolResults = null;
    });

    this.errorsState$.subscribe(state => {
      setTimeout(() => {
        this.disableQueryButtons = state.componentErrors.size > 0;
      });
    });
  }

  public ngOnDestroy(): void {
    this.loadingService.setLoadingStop();
  }

  public submitQuery(): void {
    this.loadingService.setLoadingStart();
    this.phenoToolResults = null;
    this.cancelRequest = false;
    this.loadingService.loadingStateChange.subscribe(val => {
      if (val === 'break') {
        this.cancelRequest = true;
      }
    });
    this.phenoToolService.getPhenoToolResults(
      {datasetId: this.selectedDataset.id, ...this.phenoToolState}
    ).subscribe((phenoToolResults) => {
      this.phenoToolResults = this.cancelRequest === false ? phenoToolResults : null;
      this.loadingService.setLoadingStop();
    }, () => {
      this.loadingService.setLoadingStop();
    }, () => {
      this.loadingService.setLoadingStop();
    });
  }

  public onDownload(): void {
    this.downloadInProgress = true;

    const args = {
      ...this.phenoToolState,
      datasetId: this.selectedDataset.id
    };

    this.phenoToolService.downloadPhenoToolResults(args).pipe(take(1)).subscribe((response) => {
      this.downloadInProgress = false;
      downloadBlobResponse(response, 'pheno_report.csv');
    }, (err) => {
      this.downloadInProgress = false;
    });
  }
}
