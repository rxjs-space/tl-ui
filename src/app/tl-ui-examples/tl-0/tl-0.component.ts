import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation } from '../../tl-ui';

@Component({
  selector: 'tl-0',
  templateUrl: './tl-0.component.html',
  styleUrls: ['./tl-0.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class Tl0Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
