import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetsComponent } from './datasets.component';
import { UsersService } from 'app/users/users.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigService } from 'app/config/config.service';
import { APP_BASE_HREF } from '@angular/common';
import { DatasetsService } from './datasets.service';
import { of } from 'rxjs/internal/observable/of';
import {
  Column, Dataset, GeneBrowser, GenotypeBrowser,
  PersonFilter, PersonSet, PersonSetCollection, PersonSetCollections
} from './datasets';
import { UserGroup } from 'app/users-groups/users-groups';
import { Observable } from 'rxjs/internal/Observable';
import { DatasetNode } from 'app/dataset-node/dataset-node';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { expandedDatasetsReducer } from 'app/dataset-node/dataset-node.state';

class MockDatasetService {
  public getDatasetsObservable(): Observable<Dataset[]> {
    return of([mockDataset1]);
  }
  public getVisibleDatasets(): string[] {
    return ['id1'];
  }

  public getDatasetsLoadedObservable(): Observable<object[]> {
    return of([mockDataset1]);
  }
}

const mockDataset1 = new Dataset(
  'id1', 'name1', [], true,
  ['study1'], ['studyName1'], ['studyType1'], 'phenotypeData1',
  false, true, true, false, {enabled: true},
  new GenotypeBrowser(
    false, true, false, false, true, false, true, false, false,
    [
      new Column('name1', 'source1', 'format1')
    ],
    [
      new PersonFilter('personFilter1', 'string1', 'source1', 'sourceType1', 'filterType1', 'role1')
    ],
    [
      new PersonFilter('familyFilter3', 'string3', 'source3', 'sourceType3', 'filterType3', 'role3')
    ],
    ['inheritance', 'string1'],
    ['selectedInheritance', 'string2'],
    ['variant', 'string3'],
    ['selectedVariant', 'string1'],
    5,
    false,
    false
  ),
  new PersonSetCollections(
    [
      new PersonSetCollection(
        'id1', 'name1', [new PersonSet('id1', 'name1', 'color1')]
      ),
      new PersonSetCollection(
        'id2', 'name2', [new PersonSet('id2', 'name2', 'color2')]
      )
    ]
  ),
  [
    new UserGroup(3, 'name1', ['user1', 'user2'], [{datasetName: 'dataset2', datasetId: 'dataset3'}]),
    new UserGroup(5, 'name2', ['user12', 'user5'], [{datasetName: 'dataset1', datasetId: 'dataset2'}])
  ],
  new GeneBrowser(true, 'frequencyCol1', 'frequencyName1', 'effectCol1', 'locationCol1', 5, 6, true),
  false,
  true,
  true,
  true
);

describe('DatasetComponent', () => {
  let component: DatasetsComponent;
  let fixture: ComponentFixture<DatasetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({expandedDatasets: expandedDatasetsReducer}),
        RouterTestingModule
      ],
      providers: [
        UsersService, ConfigService,
        { provide: DatasetsService, useValue: new MockDatasetService() },
        { provide: APP_BASE_HREF, useValue: '' },
        provideHttpClientTesting()
      ],
      declarations: [DatasetsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should test dataset visibility', () => {
    component.datasetTrees = new Array<DatasetNode>(new DatasetNode(mockDataset1, []));
    component.visibleDatasets = ['id1'];
    component.ngOnInit();
    expect(component.datasetTrees).toStrictEqual([new DatasetNode(mockDataset1, [mockDataset1])]);
    expect(component.visibleDatasets).toBe('id1');

    Object.defineProperty(mockDataset1, 'id', { value: 'id2' });
    component.ngOnInit();
    expect(component.datasetTrees).toStrictEqual([]);
    expect(component.visibleDatasets).toBe('id1');
  });

  it.todo('check for selectedDataset');
});
