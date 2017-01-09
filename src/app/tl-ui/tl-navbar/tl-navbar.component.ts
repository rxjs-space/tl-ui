import { Component, Input, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { TlMediaQueryWidthBreakPoints, TlMediaQueryWidthBreakPointsNames } from '../tl-media-query';

@Component({
  selector: 'tl-navbar',
  templateUrl: './tl-navbar.component.html',
  styleUrls: ['./tl-navbar.component.scss']
})
export class TlNavbarComponent implements OnInit {
  @Input() navbarTogglableAt = TlMediaQueryWidthBreakPoints.sm;
  breakPointName: string;
  breakPointLevelDownName: string;
  mqMinRx: Observable<number>;
  show: Boolean = false;
  model = {
    brand: 'TL-UI',
    routes: [
      { name: 'Home', rl: '/', rla: 'active', rlao: {exact: true} },
      { name: 'Components', rl: '/components', rla: 'active', children: [
        { name: 'Accordion', rl: '/components/accordion', rla: 'active'},
        { name: 'Clipboard', rl: '/components/clipboard', rla: 'active'}
      ] }
    ]
  };
  constructor() { }

  ngOnInit() {
    this.breakPointName = TlMediaQueryWidthBreakPointsNames[this.navbarTogglableAt];
    this.breakPointLevelDownName = TlMediaQueryWidthBreakPointsNames[this.navbarTogglableAt - 1];
  }

  clickOnToggle(event) {
    event.stopPropagation();
    this.show = !this.show;
  }

  @HostListener('document:click') onHostClick() {
    if (this.show) {
      this.show = false;
    }
  }



}


