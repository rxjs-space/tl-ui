/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TlMediaQueryService } from './tl-media-query.service';

describe('TlMediaQueryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TlMediaQueryService]
    });
  });

  it('should ...', inject([TlMediaQueryService], (service: TlMediaQueryService) => {
    expect(service).toBeTruthy();
  }));
});
