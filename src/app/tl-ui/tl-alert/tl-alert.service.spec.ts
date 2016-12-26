/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TlAlertService } from './tl-alert.service';

describe('TlAlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TlAlertService]
    });
  });

  it('should ...', inject([TlAlertService], (service: TlAlertService) => {
    expect(service).toBeTruthy();
  }));
});
