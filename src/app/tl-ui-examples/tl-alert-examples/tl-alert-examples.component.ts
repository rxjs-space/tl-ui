import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation, TlAlertActionService, TlAlertType } from '../../tl-ui';
@Component({
  selector: 'tl-alert-examples',
  templateUrl: './tl-alert-examples.component.html',
  styleUrls: ['./tl-alert-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlAlertExamplesComponent implements OnInit {

  constructor(private alertSerivce: TlAlertActionService) { }

  ngOnInit() {
  }

  sendAlert() {
    let randomType = Math.floor(Math.random() * 4);
    let contents = [
      `<strong>Success</strong>`,
      `Info`,
      `Warning`,
      `Danger`
    ];
    this.alertSerivce.alertRxx
      .next({
        content: contents[randomType],
        config: {
          type: randomType,
          durationInSec: Math.random() * 10,
          showSecLeft: Boolean(Math.round(Math.random())) // randomly true, false
        }
      });
  }

  sendAlertInfinite() {
    let randomType = Math.floor(Math.random() * 4);
    let contents = [
      `<strong>Success</strong>`,
      `Info`,
      `Warning`,
      `Danger`
    ];
    this.alertSerivce.alertRxx
      .next({
        content: contents[randomType],
        config: {
          type: randomType
        }
      });
  }

}
