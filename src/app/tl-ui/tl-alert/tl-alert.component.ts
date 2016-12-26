import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TlAlertService } from './tl-alert.service';
import { TlAlert } from './tl-alert.interface';

@Component({
  selector: 'tl-alert',
  templateUrl: './tl-alert.component.html',
  styleUrls: ['./tl-alert.component.scss']
})
export class TlAlertComponent implements OnInit, OnDestroy {
  alerts: TlAlert[] = [];
  subscriptions_: Subscription[];
  constructor(private alertService: TlAlertService) {}

  setClasses(alert: TlAlert) {
    let classes =  {
      'alert-success': alert.config.type === 'success',
      'alert-info': alert.config.type === 'info',
      'alert-warning': alert.config.type === 'warning',
      'alert-danger': alert.config.type === 'danger',
    };
    return classes;
  }

  ngOnInit() {
    const sub_ = this.alertService.alertRxx
      .subscribe(a => this.alerts.push(a));
  }

  ngOnDestroy() {
    this.subscriptions_.forEach(sub => sub.unsubscribe());
  }

}
