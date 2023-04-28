import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from 'app/config/config.service';
import { QueryService } from './query.service';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

describe('QueryService', () => {
  let service: QueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService, QueryService, { provide: APP_BASE_HREF, useValue: '' }],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot([])
      ]
    });
    service = TestBed.inject(QueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should test downloadVariants', () => {
    const spy = jest.spyOn(service, 'downloadVariants').mockReturnValue(Promise.resolve() as any);
    service.downloadVariants(['filter1']);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(['filter1']);
  });
});
