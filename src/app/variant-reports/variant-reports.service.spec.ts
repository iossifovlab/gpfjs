import { TestBed, inject } from '@angular/core/testing';

import { VariantReportsService } from './variant-reports.service';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from 'app/config/config.service';
import { Observable, of } from 'rxjs';
import { DatasetsService } from 'app/datasets/datasets.service';

class MockDatasetsService {
  getSelectedDatasetId(): string {
    return "test_dataset"
  }
  getSelectedDataset(): Observable<any> {
    return of({accessRights: true})
  }
  getDataset(): Observable<any> {
    return of({accessRights: true})
  }
}

describe('VariantReportsService', () => {
  beforeEach(() => {
    const configMock = { 'baseUrl': 'testUrl/' };
    const datasetsMock = new MockDatasetsService();
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [VariantReportsService,
        { provide: ConfigService, useValue: configMock },
        { provide: DatasetsService, useValue: datasetsMock },
      ]
    });
  });

  it('should ...', inject([VariantReportsService], (service: VariantReportsService) => {
    expect(service).toBeTruthy();
  }));
});
