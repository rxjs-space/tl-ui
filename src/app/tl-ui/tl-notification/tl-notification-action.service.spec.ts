/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TlNotificationActionService } from './tl-notification-action.service';
import { Subject } from 'rxjs/Subject';

describe('TlNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TlNotificationActionService]
    });
  });

  it('should ...', inject([TlNotificationActionService], (service: TlNotificationActionService) => {
    expect(service).toBeTruthy();
    expect( service.notificationRxx instanceof Subject).toBeTruthy();
  }));
});
