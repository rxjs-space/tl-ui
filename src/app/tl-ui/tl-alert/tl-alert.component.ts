import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { TlAlertActionService } from './tl-alert-action.service';
import { TlAlert, TlAlertType } from './tl-alert.interface';
import { alertAnimations } from './tl-alert.component.animation';
import { isNullOrUndefined } from '../+shared/util';

@Component({
  selector: 'tl-alert',
  // use <tl-alert [showAnimation]="true"></tl-alert> at root component whose module imported TlUiModule.withProviders()
  template: `
    <div class="tl-alerts">
      <ng-container *ngFor="let alert of alertsSet">

        <ng-container *ngIf="showAnimation">
          <!--ngIf cancels exit animiation (* => void) somehow, so we use 'close' state and animation callback-->
          <div class="alert alert-dismissible tl-alert"
            [@alertState]="alert.config.showing ? null : 'close'" 
            (@alertState.done)="closeAlert(alert)"
            [ngClass]="setClasses(alert)" role="alert">
            <button type="button" class="close" aria-label="Close" (click)="alert.config.showing = false">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="row">
              <div class="col-xs-1" *ngIf="alert.config.showSecLeft">
                <small class="text-muted">{{ alert.config.secLeft }}</small>
              </div>
              <div class="col-xs-9" [innerHTML]="alert.content"></div>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="!showAnimation">
          <div class="alert alert-dismissible tl-alert"
            [ngClass]="setClasses(alert)" role="alert">
            <button type="button" class="close" aria-label="Close" (click)="alert.config.showing = false; closeAlert(alert);">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="row">
              <div class="col-xs-1" *ngIf="alert.config.showSecLeft">
                <small class="text-muted">{{ alert.config.secLeft }}</small>
              </div>
              <div class="col-xs-9" [innerHTML]="alert.content"></div>
            </div>
          </div>
        </ng-container>

      </ng-container>
    </div>
  `,
  styles: [`
    .tl-alerts {
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 999;
    }

    .tl-alert {
      margin-bottom: 0;
      border-radius: 0;
    }
  `],
  animations: alertAnimations
})
export class TlAlertComponent implements OnInit, OnDestroy {
  @Input() private showAnimation: boolean = false;
  private alertsSet: Set<TlAlert> = new Set();
  private subscriptions_: Subscription[] = [];
  constructor(private alertService: TlAlertActionService) {} // inject TlAlertService to receive data

  adjustDuration(durationInput) {  // duration can be 3~10
    let duration;
    switch (true) {
      case durationInput > 10:
        duration = 10; break;
      case durationInput < 3:
        duration = 3; break;
      default:
        duration = Math.round(durationInput);
    }
    return duration;
  }

  closeAlert(alert: TlAlert) {
    if (alert.config.showing === false) {
      this.alertsSet.delete(alert);
    }
  }

  setClasses(alert: TlAlert) {
    let classes =  {
      'alert-success': alert.config.type === TlAlertType.Success,
      'alert-info': alert.config.type === TlAlertType.Info,
      'alert-warning': alert.config.type === TlAlertType.Warning,
      'alert-danger': alert.config.type === TlAlertType.Danger,
    };
    return classes;
  }

  ngOnInit() {
    const sub_ = this.alertService.alertRxx
      .subscribe(a => {
        a.config.showing = true; // a helper for animation

        let durationInput = a.config.durationInSec;
        // if durationInput is a valid number, show countdown
        if (!isNullOrUndefined(durationInput) && !isNaN(durationInput)) {
          let durInSec = this.adjustDuration(a.config.durationInSec);
          // show how many seconds left to close the alert automatically
          a.config.secLeft = durInSec;
          this.alertsSet.add(a);
          Observable.interval(1000).take(durInSec) // .take will do the clearInterval
            .subscribe(() => --a.config.secLeft);
          setTimeout(() => {
            a.config.showing = false;
            if (!this.showAnimation) { // if showAnimation, will delete in animation callback
              this.alertsSet.delete(a); // if a is already delete by user, this line will return false, not error;
            }
          }, durInSec * 1000);
        } else {
          this.alertsSet.add(a);
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions_.forEach(sub => sub.unsubscribe());
  }

}
