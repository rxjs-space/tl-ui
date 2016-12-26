/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TlAlertActionService } from './tl-alert-action.service';

describe('TlAlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TlAlertActionService]
    });
  });

  it('should ...', inject([TlAlertActionService], (service: TlAlertActionService) => {
    expect(service).toBeTruthy();
  }));
});
