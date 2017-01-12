import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { TlGesturesService } from './tl-gestures.service';
import { gestures } from './tl-gestures';
@Directive({
  selector: '[tlGestures]'
})
export class TlGesturesDirective implements OnInit {
  @Output() tlSwipeLeft = new EventEmitter();
  @Output() tlTap = new EventEmitter();
  constructor(private gestures: TlGesturesService) { }
  @HostListener('touchstart', ['$event']) touchStart(startEvent) {
    console.log('startedBy', startEvent.type);
    this.gestures.startBy(startEvent);
  }
  ngOnInit() {
    this.gestures.gestureEventRxx.subscribe(gestureEvent => {
      switch (gestureEvent.customEvent.type) {
        case gestures.swipeleft:
          this.tlSwipeLeft.emit(gestureEvent);
          break;
        case gestures.tap:
          this.tlTap.emit(gestureEvent);
          break;

      }
    });
  }

}
