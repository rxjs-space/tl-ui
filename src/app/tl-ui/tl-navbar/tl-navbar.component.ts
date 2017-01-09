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
  breakPointName: string; // need this and next for setting element class like 'navbar-toggleable-sm'
  breakPointLevelDownName: string;
  show: Boolean = false;
  @Input() model: any;
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


