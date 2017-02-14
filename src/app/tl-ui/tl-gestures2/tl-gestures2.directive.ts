import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
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
  constructor() {}

  ngOnInit() {
    const mouseRxFac = (eventType: 'mouseup' | 'mousemove') => {
      return Observable.fromEvent(rootElement, eventType)
        .map((e: Event) => ({event: e, time: Date.now()}));
    }

    // const mouseupRx: Observable<EventWithTime> = Observable.fromEvent(rootElement, 'mouseup')
    //   .map((e: Event) => ({event: e, time: Date.now()}));
    // const mousemoveRx: Observable<EventWithTime> = Observable.fromEvent(rootElement, 'mousemove')
    //   .map((e: Event) => ({event: e, time: Date.now()}));

    const touchEventFilterFac = (identifier: number) => {
      return (event: EventWithTime) => {
        // console.log('after end', identifier);
        return (event.event as TouchEvent).changedTouches.item(0).identifier === identifier;
      }
    };

    const touchRxFac = (eventType: 'touchend' | 'touchmove', identifier: number) => {
      return Observable.fromEvent(rootElement, eventType)
        .filter((event: TouchEvent) => {
          return event.changedTouches.item(0).identifier === identifier;
        })
        .map((e: Event) => ({event: e, time: Date.now()}));
    };

    // const touchendRxFac = (identifier: number) => {
    //   return Observable.fromEvent(rootElement, 'touchend')
    //     .filter((event: TouchEvent) => {
    //       return event.changedTouches.item(0).identifier === identifier;
    //     })
    //     .map((e: Event) => ({event: e, time: Date.now()}));
    // };

    // const touchmoveRxFac = (identifier: number) => {
    //   return Observable.fromEvent(rootElement, 'touchmove')
    //     .filter((event: TouchEvent) => {
    //       return event.changedTouches.item(0).identifier === identifier;
    //     })
    //     .map((e: Event) => ({event: e, time: Date.now()}));
    // };


    const touchendRx: Observable<EventWithTime> = Observable.fromEvent(rootElement, 'touchend')
      .map((e: Event) => ({event: e, time: Date.now()}));
    const touchmoveRx: Observable<EventWithTime> = Observable.fromEvent(rootElement, 'touchmove')
      .map((e: Event) => ({event: e, time: Date.now()}));

    const pressRx: Observable<EventWithTime> = Observable.interval(500).take(1)
      .map(() => ({event: {type: 'press'}, time: Date.now()}));




    const endEventRxFac = (startEvent: EventWithTime) => {
      switch (startEvent.event.type) {
        case 'mousedown':
          // only take the mouseEvent when the left button was clicked
          if ((startEvent.event as MouseEvent).button === 0) {
            return mouseRxFac('mousemove')
              .merge(pressRx)
              .takeUntil(mouseRxFac('mouseup'))
              .merge(mouseRxFac('mouseup').take(1));
          } else {
            return Observable.never();
          }
        case 'touchstart':
          const identifier = (startEvent.event as TouchEvent).changedTouches.item(0).identifier;
          // console.log('after start', identifier);
          return touchRxFac('touchmove', identifier)
            .merge(pressRx)
            .takeUntil(touchRxFac('touchend', identifier))
            .merge(touchRxFac('touchend', identifier).take(1));
      }
    }

    const eventComboProjection = (startEvent: EventWithTime, endEvent: EventWithTime) => {
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

    const eventCombo_ = this.startEventRxx
      .mergeMap(startEvent => {
        startEvent.event.preventDefault();
        return endEventRxFac(startEvent);
      }, eventComboProjection)
      .subscribe(events => console.log(events));
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  startProcessing(startEvent: Event) {
    this.startEventRxx.next({
      event: startEvent,
      time: Date.now()
    });
  }

  // @HostListener('touchmove', ['$event'])
  // @HostListener('mousemove', ['$event'])
  // monitorMove(event: Event) {
  //   console.log(event);
  // }

}
