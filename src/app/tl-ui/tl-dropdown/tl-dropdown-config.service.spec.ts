/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TlDropdownConfigService } from './tl-dropdown-config.service';

describe('TlDropdownConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TlDropdownConfigService]
    });
  });

  it('should ...', inject([TlDropdownConfigService], (service: TlDropdownConfigService) => {
    expect(service).toBeTruthy();
  }));
});
