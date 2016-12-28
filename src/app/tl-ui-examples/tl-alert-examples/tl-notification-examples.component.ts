import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation, TlNotificationActionService, TlNotificationType } from '../../tl-ui';
@Component({
  selector: 'tl-notification-examples',
  templateUrl: './tl-notification-examples.component.html',
  styleUrls: ['./tl-notification-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlNotificationExamplesComponent implements OnInit {
  constructor(private notificationSerivce: TlNotificationActionService) { }

  ngOnInit() {
  }

  sendNotification() {
    let randomType = Math.floor(Math.random() * 4);
    let contents = [
      `<strong>Success</strong>`,
      `Info`,
      `Warning`,
      `Danger`
    ];
    this.notificationSerivce.notificationRxx
      .next({
        content: contents[randomType],
        type: randomType,
        durationInSec: Math.random() * 10,
        showSecLeft: Boolean(Math.round(Math.random())) // randomly true, false
      });
  }

  sendNotificationInfinite() {
    let randomType = Math.floor(Math.random() * 4);
    let contents = [
      `<strong>Success</strong>`,
      `Info`,
      `Warning`,
      `Danger`
    ];
    this.notificationSerivce.notificationRxx
      .next({
        content: contents[randomType],
        type: randomType
      });
  }

}
