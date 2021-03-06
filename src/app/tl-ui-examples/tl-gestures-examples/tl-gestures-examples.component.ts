import { Component, OnInit } from '@angular/core';
import { TlDropdownModel, TlSlideInOutAnimation, tlGestureEventTypes } from '../../tl-ui';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'tl-gestures-examples',
  templateUrl: './tl-gestures-examples.component.html',
  styleUrls: ['./tl-gestures-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlGesturesExamplesComponent implements OnInit {
  tlGestureEventTypes: string[];
  colorDropdownModel: TlDropdownModel = {
    toggler: {name: 'color', classes: ['btn', 'btn-outline-primary']},
    items: [{name: 'turquoise'}, {name: 'indigo'}],
    itemSelectedRxx: new BehaviorSubject(null),
    itemPropertyToShowOnButtonWhenSelected: 'name',
    styleDisplay: 'inline-block'
  };
  constructor() { }

  ngOnInit() {
    this.tlGestureEventTypes = Object.keys(tlGestureEventTypes);
    this.colorDropdownModel.itemSelectedRxx.next({name: 'turquoise'});
  }

  onTouchstart(event) {
    console.log(event);
  }
  onTouchend(event) {
    console.log(event);
  }

  onTlEvent(event) {
    console.log(event);
  }




}
