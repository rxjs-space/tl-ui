import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { rootElement } from './tl-gestures2';

export interface EventWithTime {
  event: Event;
  time: number;
}

@Directive({
  selector: '[tlGestures2]'
})
export class TlGestures2Directive implements OnInit {
  private startEventRxx: Subject<EventWithTime> = new Subject();
  @Output() tlTap = new EventEmitter();
  constructor() {}

  ngOnInit() {
    const listenOnTap = !!this.tlTap.observers.length;
    console.log(listenOnTap);
    const mouseRxFac = (eventType: 'mouseup' | 'mousemove'): Observable<EventWithTime> => {
      return Observable.fromEvent(rootElement, eventType)
        .map((e: Event) => ({event: e, time: Date.now()}));
    };

    const touchRxFac = (eventType: 'touchend' | 'touchmove', identifier: number): Observable<EventWithTime> => {
      return Observable.fromEvent(rootElement, eventType)
        .filter((event: TouchEvent) => {
          return event.changedTouches.item(0).identifier === identifier;
        })
        .map((e: Event) => ({event: e, time: Date.now()}));
    };

    const pressRx: Observable<EventWithTime> = Observable.interval(500).take(1)
      .map(() => ({event: {type: 'press'}, time: Date.now()}));

    const endEventRxFac = (startEvent: EventWithTime): Observable<EventWithTime> => {
      switch (startEvent.event.type) {
        case 'mousedown':
          return mouseRxFac('mousemove')
            .merge(pressRx)
            .takeUntil(mouseRxFac('mouseup').take(1))
            .merge(mouseRxFac('mouseup').take(1));
        case 'touchstart':
          const identifier = (startEvent.event as TouchEvent).changedTouches.item(0).identifier;
          // console.log('after start', identifier);
          return touchRxFac('touchmove', identifier)
            .merge(pressRx)
            .takeUntil(touchRxFac('touchend', identifier).take(1))
            .merge(touchRxFac('touchend', identifier).take(1));
      }
    };

    const eventsComboProjection = (startEvent: EventWithTime, endEvent: EventWithTime) => {
      endEvent.event && endEvent.event.preventDefault && endEvent.event.preventDefault();
      const pointerType = startEvent.event.type.replace(/(down)|(start)/, '');
      const timeDiff = endEvent.time - startEvent.time;
      let distDiffX, distDiffY;
      // switch (startEvent.type) {
      //   case 'mousedown':
      //     distDiffX = (endEvent as MouseEvent).clientX - (startEvent as MouseEvent).clientX;
      //     break;
      //   case 'touchstart':
      //     const identifier = (startEvent as TouchEvent).
      //     distDiffX = (endEvent as TouchEvent).
      // }

      return {
        startEvent,
        endEvent,
        pointerType,
        timeDiff,
        // distDiff
      };
    }

    const eventsCombo_ = this.startEventRxx
      .mergeMap(startEvent => {
        return endEventRxFac(startEvent);
      }, (startEvent, endEvent) => ({startEvent, endEvent}))
      .subscribe(eventsCombo => console.log(eventsCombo));
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  startProcessing(event: Event) {
    event.preventDefault();
    // take all the touchstart and only the mousedown where the left button was down
    // for touchstart: event.button is undefined, which is evaluated as false
    // for mousedown: event.button is 0, which is evaluated as false
    if (!(event as MouseEvent).button) {
      this.startEventRxx.next({
        event,
        time: Date.now()
      });
    }
  }

  // @HostListener('touchmove', ['$event'])
  // @HostListener('mousemove', ['$event'])
  // monitorMove(event: Event) {
  //   console.log(event);
  // }

}
