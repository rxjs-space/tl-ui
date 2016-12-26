import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import { TlAlertService } from './tl-alert.service';
import { TlAlert, TlAlertConfigType } from './tl-alert.interface';

@Component({
  selector: 'tl-alert',
  templateUrl: './tl-alert.component.html',
  styleUrls: ['./tl-alert.component.scss'],
})
export class TlAlertComponent implements OnInit, OnDestroy {
  alertsSet: Set<TlAlert> = new Set();
  subscriptions_: Subscription[] = [];
  constructor(private alertService: TlAlertService) {}

  durationInSec(durationInput) {  // duration can be 3~10
    let duration;
    switch (true) {
      case durationInput && durationInput > 10 * 1000:
        duration = 10 * 1000; break;
      case durationInput && durationInput < 3 * 1000:
        duration = 3 * 1000; break;
      case !durationInput:
        duration = 5 * 1000; break;
      default:
        duration = durationInput;
    }
    return Math.round(duration / 1000);
  }

  setClasses(alert: TlAlert) {
    let classes =  {
      'alert-success': alert.config.type === TlAlertConfigType.Success,
      'alert-info': alert.config.type === TlAlertConfigType.Info,
      'alert-warning': alert.config.type === TlAlertConfigType.Warning,
      'alert-danger': alert.config.type === TlAlertConfigType.Danger,
    };
    return classes;
  }

  ngOnInit() {
    const sub_ = this.alertService.alertRxx
      .do(a => {
        let durInSec = this.durationInSec(a.config.duration);
        // show how many seconds left to close the alert automatically
        a.config.secLeft = durInSec;
        this.alertsSet.add(a);
        setInterval(() => {
          --a.config.secLeft;
        }, 1000);
        // close the alert automatically
        setTimeout(() => {
          this.alertsSet.delete(a); // if a is already delete by user, this line will return false, not error;
        }, durInSec * 1000);
      })
      .subscribe();
  }

  ngOnDestroy() {
    this.subscriptions_.forEach(sub => sub.unsubscribe());
  }

}
