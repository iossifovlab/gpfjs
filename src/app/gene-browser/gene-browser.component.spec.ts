import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfigService } from 'app/config/config.service';
import { DatasetsService } from 'app/datasets/datasets.service';
import { FullscreenLoadingService } from 'app/fullscreen-loading/fullscreen-loading.service';
import { DomainRange } from 'app/gene-view/gene';
import { QueryService } from 'app/query/query.service';
import { UsersService } from 'app/users/users.service';
import { of } from 'rxjs/internal/observable/of';
import { GeneBrowserComponent } from './gene-browser.component';
import { GeneSymbolsState } from 'app/gene-symbols/gene-symbols.state';
import { NgxsModule } from '@ngxs/store';

class MockActivatedRoute {
  params = {dataset: 'testDatasetId', get: () => ''};
  parent = {params: of(this.params)};
  queryParamMap = of(this.params);
  snapshot = {params: {gene: 'mockGeneSymbol'}};
}

describe('GeneBrowserComponent', () => {
  let component: GeneBrowserComponent;
  let fixture: ComponentFixture<GeneBrowserComponent>;

  const activatedRoute = new MockActivatedRoute();
  let testState: object;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneBrowserComponent],
      providers: [
        DatasetsService,
        UsersService,
        ConfigService,
        FullscreenLoadingService,
        QueryService,
        {provide: ActivatedRoute, useValue: activatedRoute},
      ],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxsModule.forRoot([GeneSymbolsState])]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneBrowserComponent);
    component = fixture.componentInstance;
    spyOn((<any>component).datasetsService, 'getSelectedDataset').and.returnValue(
      of({'genotypeBrowserConfig': {'columnIds': ['bla']}})
    );
    fixture.detectChanges();
  });

  beforeEach(() => {
    testState = {
      showDenovo : true,
      showTransmitted : true,
      selectedEffectTypes: ['lgds', 'missense', 'synonymous', 'other'],
      affectedStatus: ['Affected and unaffected'],
      genomicScores: 'testGenomicScores',
      geneSymbols: ['testSymbol'],
      peopleGroup: 'testPeopleGroup',
      datasetId: 'testDatasetId',
      zoomState: {yMin: 0, yMax: 10},
      regions: [1, 10],
      summaryVariantIds: [5, 10, 15],
      selectedVariantTypes: ['sub', 'ins', 'del', 'cnv+', 'cnv-'],
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update shown table preview variants array', () => {
    component.familyLoadingFinished = true;
    const stateGetterSpy = spyOnProperty(component, 'state').and.returnValue(testState);
    const getGenotypePreviewVariantsByFilterSpy = spyOn(component.queryService, 'getGenotypePreviewVariantsByFilter')
      .and.callFake((requestParams, previewInfo) => {
        expect(requestParams).toEqual({
          effectTypes: [ 'lgds', 'missense', 'synonymous', 'noStart', 'noEnd', 'no-frame-shift', 'CDS', 'CNV+', 'CNV-'],
          genomicScores: [{ metric: 'testMetric', rangeStart: 1, rangeEnd: 11 }],
          inheritanceTypeFilter: [ 'denovo', 'mendelian', 'omission', 'missing' ],
          affectedStatus: [ 'Affected and unaffected', 'Affected only', 'Unaffected only' ],
          geneSymbols: [ 'testSymbol' ],
          datasetId: 'testDatasetId',
          regions: [ 1, 10 ],
          maxVariantsCount: 1,
          summaryVariantIds: [5, 10, 15],
          variantType: ['sub', 'ins', 'del', 'cnv+', 'cnv-'],
          uniqueFamilyVariants: false
        });
        return 'testPreviewVariantsArray' as any;
      });
    // accesing private property - bad, needs to be refactored
    (component as any).geneBrowserConfig = {frequencyColumn: 'testMetric'};
    component.maxFamilyVariants = 1;

    component.updateShownTablePreviewVariantsArray(new DomainRange(1, 11));
    expect(getGenotypePreviewVariantsByFilterSpy).toHaveBeenCalled();
    expect(stateGetterSpy).toHaveBeenCalled();
    expect(component.genotypePreviewVariantsArray).toEqual('testPreviewVariantsArray' as any);
    expect(component.familyLoadingFinished).toBeFalse();
  });

  it('should transform family variants query parameters', () => {
    testState['affectedStatus'] = ['Affected only'];
    expect(component.transformFamilyVariantsQueryParameters(testState)).toEqual({
      effectTypes: ['lgds', 'missense', 'synonymous', 'noStart', 'noEnd', 'no-frame-shift', 'CDS', 'CNV+', 'CNV-'],
      genomicScores: 'testGenomicScores',
      inheritanceTypeFilter: ['denovo', 'mendelian', 'omission', 'missing'],
      affectedStatus: ['Affected only'],
      geneSymbols: ['testSymbol'],
      datasetId: 'testDatasetId',
      regions: [1, 10],
      variantType: ['sub', 'ins', 'del', 'cnv+', 'cnv-']
    });

    testState['affectedStatus'] = ['Affected and unaffected'];
    expect(component.transformFamilyVariantsQueryParameters(testState).affectedStatus)
      .toEqual(['Affected and unaffected', 'Affected only', 'Unaffected only']);

    testState['showDenovo'] = false;
    expect(component.transformFamilyVariantsQueryParameters(testState).inheritanceTypeFilter)
      .toEqual(['mendelian', 'omission', 'missing']);

    testState['showDenovo'] = true;
    testState['showTransmitted'] = false;
    expect(component.transformFamilyVariantsQueryParameters(testState).inheritanceTypeFilter)
      .toEqual(['denovo']);

    component['enableCodingOnly'] = false;
    expect(component.transformFamilyVariantsQueryParameters(testState).effectTypes).toEqual([
      'lgds', 'missense', 'synonymous', 'noStart', 'noEnd', 'no-frame-shift', 'non-coding', 'intron',
      'intergenic', '3\'UTR', '3\'UTR-intron', '5\'UTR', '5\'UTR-intron', 'CDS', 'CNV+', 'CNV-'
    ]);

    testState['selectedEffectTypes'] = ['missense', 'synonymous'];
    expect(component.transformFamilyVariantsQueryParameters(testState).effectTypes)
      .toEqual(['missense', 'synonymous']);
  });

  it('should submit gene request', async () => {
    component.enableCodingOnly = true;
    // accesing private property - bad, needs to be refactored
    (component as any).geneService = {
      getGene(gene) { return of('testGene'); },
    };
    spyOn(component.queryService, 'getGeneViewVariants').and.callFake((requestParams) => {
      expect(requestParams['datasetId']).toEqual('testDatasetId');
      expect(requestParams['geneSymbols']).toEqual(['testSymbol']);
      expect(requestParams['maxVariantsCount']).toEqual(10000);
      expect(requestParams['inheritanceTypeFilter']).toEqual([ 'denovo', 'mendelian', 'omission', 'missing' ]);
      if (component.enableCodingOnly) {
        expect(requestParams['effectTypes']).toEqual([ 'lgds', 'nonsense', 'frame-shift', 'splice-site', 'no-frame-shift-newStop',
            'missense', 'synonymous', 'noStart', 'noEnd', 'no-frame-shift', 'CDS', 'CNV+', 'CNV-']);
      } else {
        expect(requestParams['effectTypes']).toEqual(undefined);
      }
      return 'testSummaryVariantsArray' as any;
    });

    // we need 'svgElement' in order for waitForGeneViewComponent() to work
    component.geneViewComponent = {
      enableIntronCondensing() {}, disableIntronCondensing() {}, svgElement: true
    } as any;
    const enableIntronCondensingSpy = spyOn(component.geneViewComponent, 'enableIntronCondensing');
    const disableIntronCondensingSpy = spyOn(component.geneViewComponent, 'disableIntronCondensing');

    component.submitGeneRequest(['testSymbol']);
    expect(component.hideResults).toBeFalse();
    expect(component.geneSymbol).toBe('testSymbol');
    expect(component.selectedGene).toBe('testGene' as any);
    expect(component.genotypePreviewVariantsArray).toBe(null);
    expect(component.summaryVariantsArray).toBe('testSummaryVariantsArray' as any);
    await component.waitForGeneViewComponent();
    expect(enableIntronCondensingSpy).toHaveBeenCalled();
    expect(disableIntronCondensingSpy).not.toHaveBeenCalled();

    component.enableCodingOnly = false;
    component.submitGeneRequest();
    await component.waitForGeneViewComponent();
    expect(disableIntronCondensingSpy).toHaveBeenCalled();
  });

  it('should get family variant counts', () => {
    component.genotypePreviewVariantsArray = undefined;
    expect(component.getFamilyVariantCounts()).toBe('');

    component.maxFamilyVariants = 12;
    component.genotypePreviewVariantsArray = { getVariantsCount(maxFamilyVariants) {}} as any;
    const getVariantsCountSpy = spyOn(component.genotypePreviewVariantsArray, 'getVariantsCount').and.callFake((variants) => {
      expect(variants).toBe(12);
      return 'variants';
    });
    expect(component.getFamilyVariantCounts()).toBe('variants');
    expect(getVariantsCountSpy).toHaveBeenCalled();
  });

  it('should set on submit event query data to the requested parameters', () => {
    // accesing private property - bad, needs to be refactored
    (component as any).geneBrowserConfig = {frequencyColumn: 'testMetric'};
    const stateGetterSpy = spyOnProperty(component, 'state').and.returnValue(testState);
    const event = {
      target: {queryData: {value: ''}, submit() {}, attributes: {id: {nodeValue: 'bla'}}}
    };
    const submitSpy = spyOn(event.target, 'submit').and.callFake(() => {
      expect(event.target.queryData.value).toEqual('{' +
        '"effectTypes":["lgds","missense","synonymous","noStart","noEnd","no-frame-shift","CDS","CNV+","CNV-"],' +
        '"genomicScores":[{"metric":"testMetric","rangeStart":null,"rangeEnd":10}],' +
        '"inheritanceTypeFilter":["denovo","mendelian","omission","missing"],' +
        '"affectedStatus":["Affected and unaffected","Affected only","Unaffected only"],' +
        '"variantType":["sub","ins","del","cnv+","cnv-"],' +
        '"geneSymbols":["testSymbol"],"datasetId":"testDatasetId",' +
        '"regions":[1,10],"summaryVariantIds":[5,10,15],' +
        '"download":true}');
    });

    component.onSubmit(event);
    expect(stateGetterSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalled();
  });
});
