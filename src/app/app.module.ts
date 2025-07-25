/* eslint-disable @stylistic/max-len */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, provideAppInitializer, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { DatasetsService } from './datasets/datasets.service';
import { ConfigService } from './config/config.service';
import { GenderComponent } from './gender/gender.component';
import { PresentInChildComponent } from './present-in-child/present-in-child.component';
import { presentInChildReducer } from './present-in-child/present-in-child.state';
import { PresentInParentComponent } from './present-in-parent/present-in-parent.component';
import { VariantTypesComponent } from './variant-types/variant-types.component';
import { EffectTypesComponent } from './effect-types/effect-types.component';
import { EffecttypesColumnComponent } from './effect-types/effect-types-column.component';
import { GenotypePreviewTableComponent } from './genotype-preview-table/genotype-preview-table.component';
import { QueryService } from './query/query.service';
import { GpfTableModule } from './table/table.module';
import { DatasetsComponent } from './datasets/datasets.component';
import { PedigreeSelectorComponent } from './pedigree-selector/pedigree-selector.component';
import { GenotypeBlockComponent } from './genotype-block/genotype-block.component';
import { GenesBlockComponent } from './genes-block/genes-block.component';
import { GeneSymbolsComponent } from './gene-symbols/gene-symbols.component';
import { RegionsFilterComponent } from './regions-filter/regions-filter.component';
import { RegionsBlockComponent } from './regions-block/regions-block.component';
import { HistogramModule } from './histogram/histogram.module';
import { GeneScoresComponent } from './gene-scores/gene-scores.component';
import { GeneScoresService } from './gene-scores/gene-scores.service';
import { GeneSetsComponent } from './gene-sets/gene-sets.component';
import { GeneSetsService } from './gene-sets/gene-sets.service';
import { UsersComponent } from './users/users.component';
import { UsersService } from './users/users.service';
import { BoldMatchingPipe } from './utils/bold-matching.pipe';
import { MinValidatorDirective, MaxValidatorDirective } from './utils/min-max.validator';
import { StudyTypesComponent } from './study-types/study-types.component';
import { studyTypesReducer } from './study-types/study-types.state';
import { CookieService} from 'ngx-cookie-service';
import { GenotypeBrowserComponent } from './genotype-browser/genotype-browser.component';
import { EnrichmentToolComponent } from './enrichment-tool/enrichment-tool.component';
import { EnrichmentModelsBlockComponent } from './enrichment-models-block/enrichment-models-block.component';
import { EnrichmentModelsComponent } from './enrichment-models/enrichment-models.component';
import { EnrichmentModelsService } from './enrichment-models/enrichment-models.service';
import { EnrichmentQueryService } from './enrichment-query/enrichment-query.service';
import { EnrichmentTableComponent } from './enrichment-table/enrichment-table.component';
import { EnrichmentTableRowComponent } from './enrichment-table/enrichment-table-row.component';
import { FullscreenLoadingComponent } from './fullscreen-loading/fullscreen-loading.component';
import { FullscreenLoadingService } from './fullscreen-loading/fullscreen-loading.service';
import { EncodeUriComponentPipe } from './utils/encode-uri-component.pipe';
import { Router, RouterModule, Routes, UrlSerializer } from '@angular/router';
import { PersonFiltersSelectorComponent } from './person-filters-selector/person-filters-selector.component';
import { PersonFiltersComponent } from './person-filters/person-filters.component';
import { personFiltersReducer } from './person-filters/person-filters.state';
import { FamilyFiltersBlockComponent } from './family-filters-block/family-filters-block.component';
import { ContinuousFilterComponent } from './continuous-filter/continuous-filter.component';
import { MultiContinuousFilterComponent } from './multi-continuous-filter/multi-continuous-filter.component';
import { CategoricalFilterComponent } from './categorical-filter/categorical-filter.component';
import { MeasuresService } from './measures/measures.service';
import { FamilyIdsComponent } from './family-ids/family-ids.component';
import { NumberWithExpPipe } from './utils/number-with-exp.pipe';
import { PhenoToolComponent } from './pheno-tool/pheno-tool.component';
import { PhenoMeasureSelectorComponent } from './pheno-measure-selector/pheno-measure-selector.component';
import { PhenoToolMeasureComponent } from './pheno-tool-measure/pheno-tool-measure.component';
import { phenoToolMeasureReducer } from './pheno-tool-measure/pheno-tool-measure.state';
import { PhenoToolGenotypeBlockComponent } from './pheno-tool-genotype-block/pheno-tool-genotype-block.component';
import { PhenoToolService } from './pheno-tool/pheno-tool.service';
import { PhenoToolResultsChartComponent } from './pheno-tool-results-chart/pheno-tool-results-chart.component';
import { PhenoToolResultsChartPerEffectComponent } from './pheno-tool-results-chart/pheno-tool-results-chart-per-effect.component';
import { PhenoToolResultsChartPerResultComponent } from './pheno-tool-results-chart/pheno-tool-results-chart-per-result.component';
import { PhenoToolEffectTypesComponent } from './pheno-tool-effect-types/pheno-tool-effect-types.component';
import { PhenoBrowserComponent } from './pheno-browser/pheno-browser.component';
import { PhenoBrowserService } from './pheno-browser/pheno-browser.service';
import { PhenoBrowserModalContentComponent } from './pheno-browser-modal-content/pheno-browser-modal-content.component';
import { PhenoBrowserTableComponent } from './pheno-browser-table/pheno-browser-table.component';
import { PValueIntensityPipe } from './utils/p-value-intensity.pipe';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PeopleCounterRowPipe, VariantReportsComponent } from './variant-reports/variant-reports.component';
import { VariantReportsService } from './variant-reports/variant-reports.service';
import { DatasetDescriptionComponent } from './dataset-description/dataset-description.component';
import { GenomicScoresComponent } from './genomic-scores/genomic-scores.component';
import { GenomicScoresBlockComponent } from './genomic-scores-block/genomic-scores-block.component';
import { genomicScoresReducer } from './genomic-scores-block/genomic-scores-block.state';
import { GenomicScoresBlockService } from './genomic-scores-block/genomic-scores-block.service';
import { MarkdownModule } from 'ngx-markdown';
import { UserManagementComponent } from './user-management/user-management.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { GroupsTableComponent } from './groups-table/groups-table.component';
import { ManagementComponent } from './management/management.component';
import { UsersGroupsService } from './users-groups/users-groups.service';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { DatasetsTableComponent } from './datasets-table/datasets-table.component';
import { GenotypePreviewFieldComponent } from './genotype-preview-field/genotype-preview-field.component';
import { ErrorsAlertComponent } from './errors-alert/errors-alert.component';
import { LoadQueryComponent } from './load-query/load-query.component';
import { PerfectlyDrawablePedigreeComponent } from './perfectly-drawable-pedigree/perfectly-drawable-pedigree.component';
import { PedigreeMockService } from './perfectly-drawable-pedigree/pedigree-mock.service';
import { NonPdpPedigreesComponent } from './non-pdp-pedigrees/non-pdp-pedigrees.component';
import { PerfectlyDrawablePedigreeService } from './perfectly-drawable-pedigree/perfectly-drawable-pedigree.service';
import { StudyFiltersComponent } from './study-filters/study-filters.component';
import { AddButtonComponent } from './add-button/add-button.component';
import { RemoveButtonComponent } from './remove-button/remove-button.component';
import { PopupComponent } from './popup/popup.component';
import { SaveQueryComponent } from './save-query/save-query.component';
import { SavedQueriesTableComponent } from './saved-queries-table/saved-queries-table.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { InheritancetypesComponent } from './inheritancetypes/inheritancetypes.component';
import { inheritanceTypesReducer } from './inheritancetypes/inheritancetypes.state';
import { GeneBrowserComponent } from './gene-browser/gene-browser.component';
import { GlobalErrorHandler } from './global-error-handler/global-error-handler';
import { GlobalErrorDisplayComponent } from './global-error-display/global-error-display.component';
import { CommonReportsRowComponent } from './variant-reports/common-reports-row/common-reports-row.component';
import { CommonReportsPedigreeCellComponent } from './variant-reports/common-reports-pedigree-cell/common-reports-pedigree-cell.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DatasetNodeComponent } from './dataset-node/dataset-node.component';
import { MultipleSelectMenuComponent } from './multiple-select-menu/multiple-select-menu.component';
import { GeneProfilesBlockComponent } from './gene-profiles-block/gene-profiles-block.component';
import { GeneProfileSingleViewComponent } from './gene-profiles-single-view/gene-profiles-single-view.component';
import { PersonFiltersBlockComponent } from './person-filters-block/person-filters-block.component';
import { PersonIdsComponent } from './person-ids/person-ids.component';
import { personIdsReducer } from './person-ids/person-ids.state';
import { SortingButtonsComponent } from './sorting-buttons/sorting-buttons.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { variantTypesReducer } from './variant-types/variant-types.state';
import { effectTypesReducer } from './effect-types/effect-types.state';
import { CheckboxListComponent, DisplayNamePipe } from './checkbox-list/checkbox-list.component';
import { toolPageLinks } from './datasets/datasets';
import { GenePlotComponent } from './gene-plot/gene-plot.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SplitPipe } from './utils/split.pipe';
import { MiddleClickDirective } from './gene-profiles-table/middle-click.directive';
import { GeneProfilesTableComponent } from './gene-profiles-table/gene-profiles-table.component';
import { GeneProfileSingleViewWrapperComponent } from './gene-profiles-single-view-wrapper/gene-profiles-single-view-wrapper.component';
import { TruncatePipe } from './utils/truncate.pipe';
import { UniqueFamilyVariantsFilterComponent } from './unique-family-variants-filter/unique-family-variants-filter.component';
import { AngularMarkdownEditorModule } from 'angular-markdown-editor';
import { PedigreeChartComponent } from './pedigree-chart/pedigree-chart.component';
import { PedigreeChartMemberComponent } from './pedigree-chart/pedigree-chart-member.component';
import { JoinPipe } from './utils/join.pipe';
import { LegendComponent } from './legend/legend.component';
import { PedigreeComponent } from './pedigree/pedigree.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { CustomUrlSerializer } from './custom-url-serializer';
import { ComparePipe } from './utils/compare.pipe';
import { BackgroundColorPipe } from './utils/background-color.pipe';
import { RegressionComparePipe } from './utils/regression-compare.pipe';
import { GetRegressionIdsPipe } from './utils/get-regression-ids.pipe';
import { GetEffectTypeOrderByColumOrderPipe } from './utils/get-effect-type-order-by-column-order.pipe';
import { GetVariantReportRowsPipe } from './utils/get-variant-report-rows.pipe';
import { BackgroundColorEnrichmentPipe } from './utils/background-color-enrichment.pipe';
import { ContrastAdjustPipe } from './utils/contrast-adjust.pipe';
import { ItemAddMenuComponent } from './item-add-menu/item-add-menu.component';
import { ConfirmButtonComponent } from './confirm-button/confirm-button.component';
import * as Sentry from '@sentry/angular';
import { FederationCredentialsComponent } from './federation-credentials/federation-credentials.component';
import { StudyFiltersTreeComponent } from './treelist-checkbox/treelist-checkbox.component';
import { DatasetsTreeService } from './datasets/datasets-tree.service';
import { HelperModalComponent } from './helper-modal/helper-modal.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { FamilyTagsComponent } from './family-tags/family-tags.component';
import { familyTagsReducer } from './family-tags/family-tags.state';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { datasetIdReducer } from './datasets/datasets.state';
import { StoreModule } from '@ngrx/store';
import { errorsReducer } from './common/errors.state';
import { familyIdsReducer } from './family-ids/family-ids.state';
import { expandedDatasetsReducer } from './dataset-node/dataset-node.state';
import { studyFiltersReducer } from './study-filters/study-filters.state';
import { gendersReducer } from './gender/gender.state';
import { enrichmentModelsReducer } from './enrichment-models/enrichment-models.state';
import { geneSetsReducer } from './gene-sets/gene-sets.state';
import { geneScoresReducer } from './gene-scores/gene-scores.state';
import { geneSymbolsReducer } from './gene-symbols/gene-symbols.state';
import { presentInParentReducer } from './present-in-parent/present-in-parent.state';
import { pedigreeSelectorReducer } from './pedigree-selector/pedigree-selector.state';
import { geneProfilesReducer } from './gene-profiles-table/gene-profiles-table.state';
import { regionsFiltersReducer } from './regions-filter/regions-filter.state';
import { uniqueFamilyVariantsFilterReducer } from './unique-family-variants-filter/unique-family-variants-filter.state';
import { CategoricalHistogramModule } from './categorical-histogram/categorical-histogram.module';
import {MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoricalValuesDropdownComponent } from './categorical-values-dropdown/categorical-values-dropdown.component';
import { PersonFilterComponent } from './person-filter/person-filter.component';
import { familyMeasureHistogramsReducer, personMeasureHistogramsReducer } from './person-filters-selector/measure-histogram.state';
import { PhenoMeasureSelectorBetaComponent } from './pheno-measure-selector-beta/pheno-measure-selector-beta.component';
import { RoleSelectorComponent } from './role-selector/role-selector.component';
import { ZygosityFilterComponent } from './zygosity-filters/zygosity-filter.component';
import { zygosityFilterReducer } from './zygosity-filters/zygosity-filter.state';

const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'datasets',
    component: DatasetsComponent,
  },
  {
    path: 'datasets/:dataset',
    component: DatasetsComponent,
    children: [
      {
        path: toolPageLinks.genotypeBrowser,
        component: GenotypeBrowserComponent
      },
      {
        path: toolPageLinks.enrichmentTool,
        component: EnrichmentToolComponent
      },
      {
        path: toolPageLinks.phenotypeTool,
        component: PhenoToolComponent
      },
      {
        path: toolPageLinks.phenotypeBrowser,
        component: PhenoBrowserComponent
      },
      {
        path: toolPageLinks.datasetDescription,
        component: DatasetDescriptionComponent
      },
      {
        path: toolPageLinks.datasetStatistics,
        component: VariantReportsComponent
      },
      {
        path: toolPageLinks.geneBrowser,
        component: GeneBrowserComponent
      },
      {
        path: toolPageLinks.geneBrowser + '/:gene',
        component: GeneBrowserComponent
      }
    ]
  },
  {
    path: 'gene-profiles',
    component: GeneProfilesBlockComponent
  },
  {
    path: 'gene-profiles/:genes',
    component: GeneProfilesBlockComponent
  },
  {
    path: 'autism-gene-profiles/:genes',
    component: GeneProfileSingleViewWrapperComponent
  },
  {
    path: 'management',
    component: ManagementComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UserManagementComponent
      }
    ]
  },
  {
    path: 'load-query/:uuid',
    component: LoadQueryComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    /* This route is used by the backend as a
       redirect URL for logging in via OAuth. */
    path: 'login',
    redirectTo: 'home'
  },
  {
    path: '**',
    redirectTo: 'home'
  },
];


@NgModule({ declarations: [
  AppComponent,
  GenderComponent,
  VariantTypesComponent,
  EffectTypesComponent,
  EffecttypesColumnComponent,
  GenotypePreviewTableComponent,
  DatasetsComponent,
  PedigreeSelectorComponent,
  GenotypeBlockComponent,
  GenesBlockComponent,
  RegionsBlockComponent,
  GeneScoresComponent,
  MinValidatorDirective,
  MaxValidatorDirective,
  GeneSetsComponent,
  BoldMatchingPipe,
  PresentInChildComponent,
  PresentInParentComponent,
  GeneSymbolsComponent,
  RegionsFilterComponent,
  UsersComponent,
  StudyTypesComponent,
  GenotypeBrowserComponent,
  EnrichmentToolComponent,
  EnrichmentModelsComponent,
  EnrichmentTableComponent,
  EnrichmentTableRowComponent,
  FullscreenLoadingComponent,
  EncodeUriComponentPipe,
  EnrichmentModelsBlockComponent,
  PersonFiltersSelectorComponent,
  PersonFiltersComponent,
  FamilyFiltersBlockComponent,
  ContinuousFilterComponent,
  MultiContinuousFilterComponent,
  CategoricalFilterComponent,
  FamilyIdsComponent,
  NumberWithExpPipe,
  PhenoToolComponent,
  PhenoMeasureSelectorComponent,
  PhenoToolMeasureComponent,
  PhenoToolGenotypeBlockComponent,
  PhenoToolResultsChartComponent,
  PhenoToolResultsChartPerEffectComponent,
  PhenoToolResultsChartPerResultComponent,
  PhenoToolEffectTypesComponent,
  PhenoBrowserComponent,
  PhenoBrowserModalContentComponent,
  PhenoBrowserTableComponent,
  PValueIntensityPipe,
  VariantReportsComponent,
  DatasetDescriptionComponent,
  GenomicScoresComponent,
  GenomicScoresBlockComponent,
  UserManagementComponent,
  UsersTableComponent,
  GroupsTableComponent,
  ManagementComponent,
  DatasetsTableComponent,
  GenotypePreviewFieldComponent,
  ErrorsAlertComponent,
  LoadQueryComponent,
  PerfectlyDrawablePedigreeComponent,
  NonPdpPedigreesComponent,
  ConfirmButtonComponent,
  StudyFiltersComponent,
  AddButtonComponent,
  RemoveButtonComponent,
  PopupComponent,
  SaveQueryComponent,
  SavedQueriesTableComponent,
  UserProfileComponent,
  InheritancetypesComponent,
  GeneBrowserComponent,
  GlobalErrorDisplayComponent,
  CommonReportsRowComponent,
  CommonReportsPedigreeCellComponent,
  LoadingSpinnerComponent,
  DatasetNodeComponent,
  MultipleSelectMenuComponent,
  GeneProfilesBlockComponent,
  GeneProfileSingleViewComponent,
  MiddleClickDirective,
  PersonFiltersBlockComponent,
  PersonIdsComponent,
  SortingButtonsComponent,
  GeneProfileSingleViewWrapperComponent,
  CheckboxListComponent,
  DisplayNamePipe,
  GenePlotComponent,
  PeopleCounterRowPipe,
  SplitPipe,
  ContrastAdjustPipe,
  GeneProfilesTableComponent,
  TruncatePipe,
  ComparePipe,
  BackgroundColorPipe,
  BackgroundColorEnrichmentPipe,
  RegressionComparePipe,
  GetRegressionIdsPipe,
  JoinPipe,
  GetEffectTypeOrderByColumOrderPipe,
  GetVariantReportRowsPipe,
  UniqueFamilyVariantsFilterComponent,
  PedigreeChartComponent,
  PedigreeChartMemberComponent,
  LegendComponent,
  PedigreeComponent,
  ItemAddMenuComponent,
  FederationCredentialsComponent,
  StudyFiltersTreeComponent,
  HelperModalComponent,
  HomeComponent,
  AboutComponent,
  MarkdownEditorComponent,
  FamilyTagsComponent,
  CategoricalValuesDropdownComponent,
  PersonFilterComponent,
  PhenoMeasureSelectorBetaComponent,
  RoleSelectorComponent,
  ZygosityFilterComponent
],
bootstrap: [AppComponent], imports: [BrowserModule,
  FormsModule,
  NgbModule,
  GpfTableModule,
  HistogramModule,
  CategoricalHistogramModule,
  RouterModule.forRoot(appRoutes),
  BrowserAnimationsModule,
  MarkdownModule.forRoot(),
  ConfirmationPopoverModule.forRoot({
    confirmButtonType: 'danger'
  }),
  DragDropModule,
  ClipboardModule,
  ScrollingModule,
  AngularMarkdownEditorModule.forRoot(),
  MatAutocompleteModule,
  MatFormFieldModule,
  MatSelectModule,
  MatInputModule,
  MatMenuModule,
  NoopAnimationsModule,
  StoreModule.forRoot({
    errors: errorsReducer,
    familyIds: familyIdsReducer,
    datasetId: datasetIdReducer,
    expandedDatasets: expandedDatasetsReducer,
    familyTags: familyTagsReducer,
    personIds: personIdsReducer,
    personFilters: personFiltersReducer,
    studyFilters: studyFiltersReducer,
    effectTypes: effectTypesReducer,
    genders: gendersReducer,
    variantTypes: variantTypesReducer,
    inheritanceTypes: inheritanceTypesReducer,
    enrichmentModels: enrichmentModelsReducer,
    geneSets: geneSetsReducer,
    geneScores: geneScoresReducer,
    geneSymbols: geneSymbolsReducer,
    presentInChild: presentInChildReducer,
    presentInParent: presentInParentReducer,
    phenoToolMeasure: phenoToolMeasureReducer,
    pedigreeSelector: pedigreeSelectorReducer,
    geneProfiles: geneProfilesReducer,
    regionsFilter: regionsFiltersReducer,
    genomicScores: genomicScoresReducer,
    uniqueFamilyVariantsFilter: uniqueFamilyVariantsFilterReducer,
    studyTypes: studyTypesReducer,
    familyMeasureHistograms: familyMeasureHistogramsReducer,
    personMeasureHistograms: personMeasureHistogramsReducer,
    zygosityFilter: zygosityFilterReducer,
  }),], providers: [
  CookieService,
  ConfigService,
  DatasetsService,
  DatasetsTreeService,
  QueryService,
  GeneScoresService,
  GeneSetsService,
  UsersService,
  EnrichmentModelsService,
  EnrichmentQueryService,
  FullscreenLoadingService,
  MeasuresService,
  PhenoToolService,
  PhenoBrowserService,
  PValueIntensityPipe,
  VariantReportsService,
  GenomicScoresBlockService,
  UsersGroupsService,
  PedigreeMockService,
  PerfectlyDrawablePedigreeService,
  {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  },
  BnNgIdleService,
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
  {
    provide: APP_BASE_HREF,
    useFactory: (s: PlatformLocation): string => s.getBaseHrefFromDOM(),
    deps: [PlatformLocation]
  },
  {
    provide: UrlSerializer,
    useClass: CustomUrlSerializer
  },
  {
    provide: ErrorHandler,
    useValue: Sentry.createErrorHandler({
      showDialog: false,
    }),
  },
  {
    provide: Sentry.TraceService,
    deps: [Router],
  },
  provideAppInitializer(() => {
    inject(Sentry.TraceService);
  }),
  provideHttpClient(withInterceptorsFromDi()),
] })
export class AppModule { }
