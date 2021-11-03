/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GenotypeBlockComponent } from './genotype-block.component';
import { GenderComponent } from '../gender/gender.component';
import { VariantTypesComponent } from '../variant-types/variant-types.component';
import { EffectTypesComponent } from '../effect-types/effect-types.component';
import { PedigreeSelectorComponent } from '../pedigree-selector/pedigree-selector.component';
import { DatasetsService } from 'app/datasets/datasets.service';
import { UsersService } from 'app/users/users.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from 'app/config/config.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorsAlertComponent } from 'app/errors-alert/errors-alert.component';
import { EffecttypesColumnComponent } from 'app/effect-types/effect-types-column.component';
import { NgxsModule } from '@ngxs/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EffecttypesState } from 'app/effect-types/effect-types.state';
import { GenderState } from 'app/gender/gender.state';
import { VarianttypesState } from 'app/variant-types/variant-types.state';

describe('GenotypeBlockComponent', () => {
  let component: GenotypeBlockComponent;
  let fixture: ComponentFixture<GenotypeBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        GenderComponent,
        VariantTypesComponent,
        EffectTypesComponent,
        GenotypeBlockComponent,
        PedigreeSelectorComponent,
        ErrorsAlertComponent,
        EffectTypesComponent,
        EffecttypesColumnComponent
      ],
      providers: [
        DatasetsService,
        UsersService,
        ConfigService,
      ],
      imports: [
        NgbModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NgxsModule.forRoot([EffecttypesState, GenderState, VarianttypesState])
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenotypeBlockComponent);
    component = fixture.componentInstance;
    component.dataset = {'genotypeBrowserConfig': {
      'inheritanceTypeFilter': new Set(),
      'variantTypes': new Set(),
      'selectedVariantTypes': new Set(),
    } as any} as any;
    fixture.detectChanges();
  });

  it('should create', () =>   {
    expect(component).toBeTruthy();
  });
});
