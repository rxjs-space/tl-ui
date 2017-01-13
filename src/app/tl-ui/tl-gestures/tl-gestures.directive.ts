import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { TlGesturesService } from './tl-gestures.service';
import { TlGestureEventTypes, TlGestureEvent } from './tl-gestures';
import { Subject } from 'rxjs/Subject';

@Directive({
  selector: '[tlGestures]'
})
export class TlGesturesDirective implements OnInit {
  gestureEventRxx: Subject<TlGestureEvent> = new Subject();
  @Output() tlSwipeLeft = new EventEmitter();
  @Output() tlSwipeRight = new EventEmitter();
  @Output() tlTap = new EventEmitter();
  constructor(private gestures: TlGesturesService) { }
  @HostListener('touchstart', ['$event']) touchStart(startEvent) {
    // console.log('startedBy', startEvent.type);
    this.gestures.startBy(this.gestureEventRxx, startEvent);
  }
  ngOnInit() {
    this.gestureEventRxx.subscribe(gestureEvent => {
      switch (gestureEvent.type) {
        case TlGestureEventTypes.swiperight:
          this.tlSwipeRight.emit(gestureEvent);
          break;
        case TlGestureEventTypes.swipeleft:
          this.tlSwipeLeft.emit(gestureEvent);
          break;
        case TlGestureEventTypes.tap:
          this.tlTap.emit(gestureEvent);
          break;
      }
    });
  }

}
