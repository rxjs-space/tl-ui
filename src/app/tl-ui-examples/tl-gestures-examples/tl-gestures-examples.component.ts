import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation } from '../../tl-ui';

@Component({
  selector: 'tl-gestures-examples',
  templateUrl: './tl-gestures-examples.component.html',
  styleUrls: ['./tl-gestures-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlGesturesExamplesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onTouchstart(event) {
    console.log(event);
  }
  onTouchend(event) {
    console.log(event);
  }

  onTap(event) {
    console.log(event);
  }

  onPan(event) {
    console.log(event);
  }

  onDblTap(event) {
    console.log(event);
  }

}
