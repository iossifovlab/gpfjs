import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenotypeBrowserComponent } from './genotype-browser.component';
import { QueryService } from 'app/query/query.service';
import { ConfigService } from 'app/config/config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { FullscreenLoadingService } from 'app/fullscreen-loading/fullscreen-loading.service';
import { DatasetsService } from 'app/datasets/datasets.service';
import { UsersService } from 'app/users/users.service';
import { GenesBlockComponent } from 'app/genes-block/genes-block.component';
import { RegionsBlockComponent } from 'app/regions-block/regions-block.component';
import { GenotypeBlockComponent } from 'app/genotype-block/genotype-block.component';
import { GenomicScoresBlockComponent } from 'app/genomic-scores-block/genomic-scores-block.component';
import { GenomicScoresBlockService } from 'app/genomic-scores-block/genomic-scores-block.service';
import {
  UniqueFamilyVariantsFilterComponent
} from 'app/unique-family-variants-filter/unique-family-variants-filter.component';
import { SaveQueryComponent } from 'app/save-query/save-query.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectTypesComponent } from 'app/effect-types/effect-types.component';
import { GenderComponent } from 'app/gender/gender.component';
import { VariantTypesComponent } from 'app/variant-types/variant-types.component';
import { PresentInChildComponent } from 'app/present-in-child/present-in-child.component';
import { PresentInParentComponent } from 'app/present-in-parent/present-in-parent.component';
import { ErrorsAlertComponent } from 'app/errors-alert/errors-alert.component';
import { CheckboxListComponent, DisplayNamePipe } from 'app/checkbox-list/checkbox-list.component';
import { EffecttypesColumnComponent } from 'app/effect-types/effect-types-column.component';
import { FamilyFiltersBlockComponent } from 'app/family-filters-block/family-filters-block.component';
import { PersonFiltersBlockComponent } from 'app/person-filters-block/person-filters-block.component';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


const genotypeBrowserConfigMock = {
  personFilters: [],
  familyFilters: [],
  inheritanceTypeFilter: {},
  selectedVariantTypes: {}
};


class MockDatasetsService {
  public getSelectedDataset(): object {
    return { id: 'testDataset', genotypeBrowserConfig: genotypeBrowserConfigMock };
  }
}
class MockQueryService {
  public downloadVariants(): Observable<HttpResponse<Blob>> {
    return of([] as any) as Observable<HttpResponse<Blob>>;
  }
}

describe('GenotypeBrowserComponent', () => {
  let component: GenotypeBrowserComponent;
  let fixture: ComponentFixture<GenotypeBrowserComponent>;
  const queryService = new MockQueryService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GenotypeBrowserComponent,
        GenotypeBlockComponent,
        GenomicScoresBlockComponent,
        SaveQueryComponent,
        PresentInChildComponent,
        PresentInParentComponent,
        ErrorsAlertComponent,
        CheckboxListComponent,
        EffecttypesColumnComponent,
        FamilyFiltersBlockComponent,
        PersonFiltersBlockComponent,
        DisplayNamePipe
      ],
      providers: [
        {provide: QueryService, useValue: queryService},
        ConfigService,
        FullscreenLoadingService,
        UsersService,
        GenomicScoresBlockService,
        { provide: DatasetsService, useValue: new MockDatasetsService() },
        UniqueFamilyVariantsFilterComponent,
        EffectTypesComponent,
        GenderComponent,
        VariantTypesComponent,
        GenesBlockComponent,
        RegionsBlockComponent,
        { provide: APP_BASE_HREF, useValue: '' }
      ],
      imports: [
        HttpClientTestingModule, RouterTestingModule, NgbNavModule, FormsModule,
        NgxsModule.forRoot([], {developmentMode: true}),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(GenotypeBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  xit('should test download', () => {
    // TODO
  });
});
