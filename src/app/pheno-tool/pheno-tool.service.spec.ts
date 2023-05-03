import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from 'app/config/config.service';
import { of } from 'rxjs';
import { PhenoToolService } from './pheno-tool.service';
import { APP_BASE_HREF } from '@angular/common';

describe('PhenoToolService', () => {
  let service: PhenoToolService;

  beforeEach(() => {
    const configMock = { baseUrl: 'testUrl/' };
    TestBed.configureTestingModule({
      providers: [
        { provide: ConfigService, useValue: configMock },
        { provide: APP_BASE_HREF, useValue: '' },
        HttpClientTestingModule, PhenoToolService
      ],
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(PhenoToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get pheno tool results', () => {
    const httpGetSpy = jest.spyOn(HttpClient.prototype, 'post');
    httpGetSpy.mockReturnValue(of('fakeResponse'));
    service.getPhenoToolResults('filter' as any);

    expect(httpGetSpy.mock.calls).toEqual(
      [
        [
          'testUrl/pheno_tool',
          'filter',
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        ]
      ]
    );
  });

  it('should download pheno tool results', async() => {
    service.downloadPhenoToolResults = jest.fn().mockResolvedValue({});

    const spy2 = jest.spyOn(service, 'downloadPhenoToolResults');
    await service.downloadPhenoToolResults(['filter1']).then(() => {
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledWith(['filter1']);
    });
  });
});
