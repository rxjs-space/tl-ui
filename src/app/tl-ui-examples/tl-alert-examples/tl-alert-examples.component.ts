import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation, TlAlertService } from '../../tl-ui';
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
    this.alertSerivce.alertRxx.next({content: 'tablet', config: {type: 'success'}});
  }

}
