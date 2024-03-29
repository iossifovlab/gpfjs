import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { StudyFiltersComponent } from './study-filters.component';
import { NgbNavModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RemoveButtonComponent } from 'app/remove-button/remove-button.component';
import { AddButtonComponent } from 'app/add-button/add-button.component';
import { ErrorsAlertComponent } from 'app/errors-alert/errors-alert.component';
import { FormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { DatasetsComponent } from 'app/datasets/datasets.component';
import { UsersService } from 'app/users/users.service';
import { ConfigService } from 'app/config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { DatasetsService } from 'app/datasets/datasets.service';
import { RouterModule } from '@angular/router';
import { DatasetNode } from 'app/dataset-node/dataset-node';
import { DatasetsTreeService } from 'app/datasets/datasets-tree.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const datasetConfigMock: any = {
  studies: ['test_name1', 'test_name2']
};

class DatasetsComponentMock {
  public datasets = {datasetTrees: [DatasetNode]};
}

describe('StudyFiltersComponent', () => {
  let component: StudyFiltersComponent;
  let fixture: ComponentFixture<StudyFiltersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StudyFiltersComponent,
        RemoveButtonComponent,
        AddButtonComponent,
        ErrorsAlertComponent
      ],
      providers: [
        NgbNavModule, NgbModule, FormsModule,
        {provide: DatasetsComponent, useValue: DatasetsComponentMock},
        UsersService, ConfigService, { provide: APP_BASE_HREF, useValue: '' },
        DatasetsService, DatasetsTreeService
      ],
      imports: [
        NgbNavModule, NgbModule, FormsModule,
        NgxsModule.forRoot([], {developmentMode: true}), HttpClientTestingModule,
        RouterModule.forRoot([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudyFiltersComponent);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component['store'] = {
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
      selectOnce: function() {
        return of({});
      },
      // eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/no-empty-function
      dispatch: function() {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    component.dataset = datasetConfigMock;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
