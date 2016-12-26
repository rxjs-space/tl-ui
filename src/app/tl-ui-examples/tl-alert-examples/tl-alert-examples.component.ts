import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation, TlAlertService, TlAlertConfigType } from '../../tl-ui';
@Component({
  selector: 'tl-alert-examples',
  templateUrl: './tl-alert-examples.component.html',
  styleUrls: ['./tl-alert-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlAlertExamplesComponent implements OnInit {

  constructor(private alertSerivce: TlAlertService) { }

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
          duration: Math.random() * 1000 * 10,
          showSecLeft: true
        }
      });
  }

}
