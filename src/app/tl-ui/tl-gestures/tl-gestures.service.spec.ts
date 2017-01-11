/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TlGesturesService } from './tl-gestures.service';

describe('TlGesturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TlGesturesService]
    });
  });

  it('should ...', inject([TlGesturesService], (service: TlGesturesService) => {
    expect(service).toBeTruthy();
  }));
});
