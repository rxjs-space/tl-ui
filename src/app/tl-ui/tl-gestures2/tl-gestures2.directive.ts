import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/filter';
import { rootElement } from './tl-gestures2';

export interface EventWithTime {
  event: Event;
  identifier: number;
  time: number;
}

export interface SMPECombo {
  identifier: number;
  startEvent: EventWithTime;
  moveEvents: {
    prev: EventWithTime;
    curr: EventWithTime;
  };
  pressEvent: EventWithTime;
  endEvent: EventWithTime;
}

export type Identifier = number;

export interface SMPEData {
  smpeCombosMap: Map<Identifier, {prev: SMPECombo, curr: SMPECombo}>;
  identifiers: {prev: Identifier; curr: Identifier};
}

@Directive({
  selector: '[tlGestures2]'
})
export class TlGestures2Directive implements OnInit {
  private startEventRxx: Subject<EventWithTime> = new Subject();
  @Output() tlTap = new EventEmitter();
  @Output() tlPan = new EventEmitter();
  constructor() {}

  ngOnInit() {
    const listenOnTap = !!this.tlTap.observers.length;
    const listenOnPan = !!this.tlPan.observers.length;

    const mouseRxFac = (eventType: 'mouseup' | 'mousemove'): Observable<EventWithTime> => {
      return Observable.fromEvent(rootElement, eventType)
        .map((e: Event) => ({event: e, identifier: -1, time: Date.now()}));
    };

    const touchRxFac = (eventType: 'touchend' | 'touchmove', identifier: number): Observable<EventWithTime> => {
      return Observable.fromEvent(rootElement, eventType)
        .filter((event: TouchEvent) => {
          return event.changedTouches.item(0).identifier === identifier;
        })
        .map((e: Event) => ({event: e, identifier, time: Date.now()}));
    };

    const pressRxFac = (identifier: number): Observable<EventWithTime> => {
      return Observable.interval(500).take(1)
        .map(() => ({event: {type: 'press'}, identifier, time: Date.now()}))
    };

    const nonStartEventRxFac = (startEvent: EventWithTime): Observable<EventWithTime> => {
      switch (startEvent.event.type) {
        case 'mousedown':
          return mouseRxFac('mousemove')
            .merge(pressRxFac(-1))
            .takeUntil(mouseRxFac('mouseup').take(1))
            .merge(mouseRxFac('mouseup').take(1));
        case 'touchstart':
          const identifier = (startEvent.event as TouchEvent).changedTouches.item(0).identifier;
          // console.log('after start', identifier);
          return touchRxFac('touchmove', identifier)
            .merge(pressRxFac(identifier))
            .takeUntil(touchRxFac('touchend', identifier).take(1))
            .merge(touchRxFac('touchend', identifier).take(1));
      }
    };


    const eventsCombo_ = this.startEventRxx
      .mergeMap(startEvent => {
        return nonStartEventRxFac(startEvent);
      }, (startEvent, nonStartEvent) => ({startEvent, nonStartEvent}))
      .scan((acc: SMPEData, curr) => {
        // if moveEvent, put it into moveEvents array
        // if pressEvent, put it into pressEvent property
        // if endEvent, put it into endEvent property
        const currIdentifier = curr.startEvent.identifier;
        const smpeCombosByIdentifier: {prev: SMPECombo; curr: SMPECombo} = acc.smpeCombosMap.get(currIdentifier);
        let smpeCombo: SMPECombo;
        switch (curr.nonStartEvent.event.type) {
          case 'mousemove':
          case 'touchmove':
            const currMoveEvent = curr.nonStartEvent;
            // if no smpeCombo with the same identifier in the map, \
            // or, if the smpeCombo with the same identifier has endEvent \
            // construct a new smpeCombo from scratch
            if (!smpeCombosByIdentifier || smpeCombosByIdentifier.curr.endEvent) {
              smpeCombo = {
                identifier: curr.startEvent.identifier,
                startEvent: curr.startEvent,
                moveEvents: {prev: null, curr: currMoveEvent},
                pressEvent: null,
                endEvent: null
              };
            } else {
              smpeCombo = Object.assign((<SMPECombo>{}), smpeCombosByIdentifier.curr, {
                moveEvents: {prev: smpeCombosByIdentifier.curr.moveEvents.curr, curr: currMoveEvent}
              });
            }
          break;

          case 'mouseup':
          case 'touchend':
            const currEndEvent = curr.nonStartEvent;
            if (!smpeCombosByIdentifier || smpeCombosByIdentifier.curr.endEvent) {
              smpeCombo = {
                identifier: curr.startEvent.identifier,
                startEvent: curr.startEvent,
                moveEvents: null,
                pressEvent: null,
                endEvent: currEndEvent
              };
            } else {
              smpeCombo = Object.assign((<SMPECombo>{}), smpeCombosByIdentifier.curr, {
                endEvent: currEndEvent
              });
            }
          break;

          case 'press':
            const currPressEvent = curr.nonStartEvent;
            if (!smpeCombosByIdentifier || smpeCombosByIdentifier.curr.endEvent) {
              smpeCombo = {
                identifier: curr.startEvent.identifier,
                startEvent: curr.startEvent,
                moveEvents: null,
                pressEvent: currPressEvent,
                endEvent: null
              };
            } else {
              smpeCombo = Object.assign((<SMPECombo>{}), smpeCombosByIdentifier.curr, {
                pressEvent: currPressEvent
              });
            }
          break;
        }

        const temp = {
          prev: acc.smpeCombosMap.get(currIdentifier) && acc.smpeCombosMap.get(currIdentifier).curr,
          curr: smpeCombo
        };
        acc.smpeCombosMap.set(currIdentifier, temp);
        acc.identifiers.prev = acc.identifiers.curr;
        acc.identifiers.curr = currIdentifier;
        return acc;
      }, {smpeCombosMap: (<Map<Identifier, {prev: SMPECombo; curr: SMPECombo}>>(new Map())), identifiers: {prev: null, curr: null}})
      .do(smpeData => {
        const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.identifiers.curr).curr;
        if (currSmpeCombo.endEvent) {
          const endEvent = currSmpeCombo.endEvent.event;
          const startEvent = currSmpeCombo.startEvent.event;
          let event, distDiffX, distDiffY, timeDiff;
          timeDiff = currSmpeCombo.endEvent.time - currSmpeCombo.startEvent.time;
          switch (endEvent.type) {
            case 'mouseup':
              distDiffX = (endEvent as MouseEvent).clientX - (startEvent as MouseEvent).clientX;
              distDiffY = (endEvent as MouseEvent).clientY - (startEvent as MouseEvent).clientY;
              break;
            case 'touchend':
              distDiffX = (endEvent as TouchEvent).changedTouches.item(0).clientX - (startEvent as TouchEvent).changedTouches.item(0).clientX;
              distDiffY = (endEvent as TouchEvent).changedTouches.item(0).clientY - (startEvent as TouchEvent).changedTouches.item(0).clientY;
          }
          if (timeDiff < 100 && (distDiffX * distDiffX + distDiffY * distDiffY < 101)) {
            this.tlTap.emit({
              type: 'tap', distDiffX, distDiffY, timeDiff
            });
          }

        }
      })
      .subscribe(outcome => console.log(outcome));
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  startProcessing(event: Event) {
    event.preventDefault();
    // take all the touchstart and only the mousedown where the left button was down
    // for touchstart: event.button is undefined, which is evaluated as false
    // for mousedown: event.button is 0, which is evaluated as false
    if (!(event as MouseEvent).button) {
      const identifier = event.type.search(/mouse/) > -1 ? -1 : (event as TouchEvent).changedTouches.item(0).identifier;
      // -1 stands for mouse
      this.startEventRxx.next({
        event,
        identifier,
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
