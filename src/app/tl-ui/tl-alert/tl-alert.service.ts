import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { TlAlert } from './tl-alert.interface';

@Injectable()
export class TlAlertService {
  alertRxx: Subject<TlAlert> = new Subject();
  constructor() { }
}
