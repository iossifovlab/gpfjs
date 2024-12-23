import { TestBed } from '@angular/core/testing';
import { ConfigService } from 'app/config/config.service';
import { lastValueFrom, of } from 'rxjs';
import { GeneProfilesService } from './gene-profiles.service';
import {
  GeneProfilesSingleViewConfig,
  GeneProfilesGene
} from 'app/gene-profiles-single-view/gene-profiles-single-view';
import { take } from 'rxjs/operators';
import { provideHttpClient } from '@angular/common/http';

describe('GeneProfilesService', () => {
  let service: GeneProfilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService, provideHttpClient()],
      imports: []
    });
    service = TestBed.inject(GeneProfilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get config', async() => {
    const getConfigSpy = jest.spyOn(service['http'], 'get');
    getConfigSpy.mockReturnValue(of({ mockConfigProperty: 'mockConfigValue' }));

    const resultConfig = service.getConfig();

    expect(getConfigSpy).toHaveBeenCalledWith(service['config'].baseUrl + service['configUrl']);
    const res = await lastValueFrom(resultConfig.pipe(take(1)));
    expect(res['mockConfigProperty']).toBe('mockConfigValue');
    expect(res).toBeInstanceOf(GeneProfilesSingleViewConfig);
  });

  it('should get invalid config response', async() => {
    const getConfigSpy = jest.spyOn(service['http'], 'get');
    getConfigSpy.mockReturnValue(of({ }));

    const resultConfig = service.getConfig();

    expect(getConfigSpy).toHaveBeenCalledWith(service['config'].baseUrl + service['configUrl']);
    const res = await lastValueFrom(resultConfig.pipe(take(1)));
    expect(res).toBeUndefined();
  });

  it('should get single gene', async() => {
    const getGeneSpy = jest.spyOn(service['http'], 'get');
    getGeneSpy.mockReturnValue(of({ mockGeneProperty: 'mockGeneValue' }));

    const resultGene = service.getGene('geneMock1');

    expect(getGeneSpy).toHaveBeenCalledWith(service['config'].baseUrl + service['genesUrl'] + 'geneMock1');
    const res = await lastValueFrom(resultGene.pipe(take(1)));
    expect(res['mockGeneProperty']).toBe('mockGeneValue');
    expect(res).toBeInstanceOf(GeneProfilesGene);
  });
});
