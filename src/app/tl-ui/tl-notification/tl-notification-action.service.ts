import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TlNotification } from './tl-notification.interface';

@Injectable()
export class TlNotificationActionService {
  notificationRxx: Subject<TlNotification> = new Subject();
  constructor() { }
}
