import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { EventIT, TlGestureEvent } from './tl-gestures3';

@Directive({
  selector: '[tlGestures3]'
})
export class TlGestures3Directive implements OnInit {

  private startEventRxx: Subject<EventIT> = new Subject();
  @Output() tlTap: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlDbltap: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPan: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPinch: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPress: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlRotate: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlSwipe: EventEmitter<TlGestureEvent> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    console.log('3');
  }

}
