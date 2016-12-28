import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/take';
import { TlNotificationActionService } from './tl-notification-action.service';
import { TlNotification, TlNotificationType } from './tl-notification.interface';
import { notificationAnimations } from './tl-notification.component.animation';
import { isNullOrUndefined } from '../+shared/util';

@Component({
  selector: 'tl-notification',
  // use <tl-notification [showAnimation]="true"></tl-notification> at root component whose module imported TlUiModule.withProviders()
  template: `
    <div class="tl-notifications">
      <ng-container *ngFor="let notification of notificationsSet">

        <ng-container *ngIf="showAnimation">
          <!--ngIf cancels exit animiation (* => void) somehow, so we use 'close' state and animation callback-->
          <div class="alert alert-dismissible tl-notification"
            [@notificationState]="notification.showing ? null : 'close'" 
            (@notificationState.done)="closeNotification(notification)"
            [ngClass]="setClasses(notification)" role="alert">
            <button type="button" class="close" aria-label="Close" (click)="notification.showing = false">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="row">
              <div class="col-xs-1" *ngIf="notification.showSecLeft">
                <small class="text-muted">{{ notification.secLeft }}</small>
              </div>
              <div class="col-xs-9" [innerHTML]="notification.content"></div>
            </div>
          </div>
        </ng-container>

        <ng-container *ngIf="!showAnimation">
          <div class="alert alert-dismissible tl-notification"
            [ngClass]="setClasses(notification)" role="alert">
            <button type="button" class="close" aria-label="Close" (click)="notification.showing = false; closeNotification(notification);">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="row">
              <div class="col-xs-1" *ngIf="notification.showSecLeft">
                <small class="text-muted">{{ notification.secLeft }}</small>
              </div>
              <div class="col-xs-9" [innerHTML]="notification.content"></div>
            </div>
          </div>
        </ng-container>

      </ng-container>
    </div>
  `,
  styles: [`
    .tl-notifications {
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 999;
    }

    .tl-notification {
      margin-bottom: 0;
      border-radius: 0;
    }
  `],
  animations: notificationAnimations
})
export class TlNotificationComponent implements OnInit, OnDestroy {
  @Input() private showAnimation: boolean = false;
  private notificationsSet: Set<TlNotification> = new Set();
  private subscriptions_: Subscription[] = [];
  constructor(private notificationService: TlNotificationActionService) {} // inject TlNotificationActionService to receive data

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

  closeNotification(notification: TlNotification) {
    if (notification.showing === false) {
      this.notificationsSet.delete(notification);
    }
  }

  setClasses(notification: TlNotification) {
    let classes =  {
      'alert-success': notification.type === TlNotificationType.Success,
      'alert-info': notification.type === TlNotificationType.Info,
      'alert-warning': notification.type === TlNotificationType.Warning,
      'alert-danger': notification.type === TlNotificationType.Danger,
    };
    return classes;
  }

  ngOnInit() {
    const sub_ = this.notificationService.notificationRxx
      .subscribe(n => {
        n.showing = true; // this property is a helper for animation

        let durationInput = n.durationInSec;
        // if durationInput is a valid number, show countdown
        if (!isNullOrUndefined(durationInput) && !isNaN(durationInput)) {
          let durInSec = this.adjustDuration(n.durationInSec);
          // show how many seconds left to close the notification automatically
          n.secLeft = durInSec;
          this.notificationsSet.add(n);
          Observable.interval(1000).take(durInSec) // .take will do the clearInterval
            .subscribe(() => --n.secLeft);
          setTimeout(() => {
            n.showing = false;
            if (!this.showAnimation) { // if showAnimation, will delete in animation callback
              this.notificationsSet.delete(n); // if a is already delete by user, this line will return false, not error;
            }
          }, durInSec * 1000);
        } else {
          this.notificationsSet.add(n);
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions_.forEach(sub => sub.unsubscribe());
  }

}
