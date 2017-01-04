/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TlClipboardService } from './tl-clipboard.service';

describe('TlClipboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TlClipboardService]
    });
  });

  it('should ...', inject([TlClipboardService], (service: TlClipboardService) => {
    expect(service).toBeTruthy();
  }));
});
