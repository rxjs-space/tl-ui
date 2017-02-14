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

export const tlGestureEventTypes = {
  tlTap: 'tlTap',
  tlDblTap: 'tlDblTap'
}

export interface EventIT {
  event: Event;
  identifier: number;
  time: number;
}

export interface StartNonStartCombo {
  startEvent: EventIT;
  nonStartEvent: EventIT;
}

// export interface SMPECombo {
//   identifier: number;
//   startEvent: EventWithTime;
//   moveEvents: {
//     prev: EventWithTime;
//     curr: EventWithTime;
//   };
//   pressEvent: EventWithTime;
//   endEvent: EventWithTime;
// }

export class SMPECombo {
  constructor(
    public identifier: number,
    public startEvent: EventIT,
    public moveEventPrev: EventIT = null,
    public moveEventCurr: EventIT = null,
    public pressEvent: EventIT = null,
    public endEvent: EventIT = null
  ) {}
}

export interface SMPEComboPrevCurr {
  prev: SMPECombo;
  curr: SMPECombo;
}

export type Identifier = number;

export interface SMPEData {
  smpeCombosMap: Map<Identifier, SMPEComboPrevCurr>;
  latestIdentifier: Identifier;
}

@Directive({
  selector: '[tlGestures2]'
})
export class TlGestures2Directive implements OnInit {
  private startEventRxx: Subject<EventIT> = new Subject();
  @Output() tlTap = new EventEmitter();
  @Output() tlDblTap = new EventEmitter();
  @Output() tlPan = new EventEmitter();
  constructor() {}

  ngOnInit() {
    const listenOn = (gestureEvent) => {
      return !!this[gestureEvent].observers.length;
    };

    const mouseRxFac = (eventType: 'mouseup' | 'mousemove'): Observable<EventIT> => {
      return Observable.fromEvent(rootElement, eventType)
        .map((e: Event) => ({event: e, identifier: -1, time: Date.now()}));
    };

    const touchRxFac = (eventType: 'touchend' | 'touchmove', identifier: number): Observable<EventIT> => {
      return Observable.fromEvent(rootElement, eventType)
        .filter((event: TouchEvent) => {
          return event.changedTouches.item(0).identifier === identifier;
        })
        .map((e: Event) => ({event: e, identifier, time: Date.now()}));
    };

    const pressRxFac = (identifier: number): Observable<EventIT> => {
      return Observable.interval(500).take(1)
        .map(() => ({event: {type: 'press'}, identifier, time: Date.now()}))
    };

    const nonStartEventRxFac = (startEvent: EventIT): Observable<EventIT> => {
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


    const startNonStartEventsComboRx: Observable<StartNonStartCombo> = this.startEventRxx
      .mergeMap(startEvent => {
        return nonStartEventRxFac(startEvent);
      }, (startEvent, nonStartEvent) => ({startEvent, nonStartEvent}));

    const smpeOnMoveFac = (smpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
      const currMoveEvent = curr.nonStartEvent;
      // if smpeComboPrevCurr is undefined (not found), \
      // or, if smpeComboPrevCurr.curr has endEvent (found but ended) \
      // construct a new smpeCombo from scratch
      if (!smpeComboPrevCurr || smpeComboPrevCurr.curr.endEvent) {
        return new SMPECombo(
          curr.startEvent.identifier,
          curr.startEvent,
          null,
          currMoveEvent,
          null,
          null
        );
      } else {
        return new SMPECombo(
          smpeComboPrevCurr.curr.identifier,
          smpeComboPrevCurr.curr.startEvent,
          smpeComboPrevCurr.curr.moveEventCurr, // use last moveEventCurr as the new moveEventPrev
          currMoveEvent,
          smpeComboPrevCurr.curr.pressEvent,
          smpeComboPrevCurr.curr.endEvent
        );
      }
    };

    const smpeOnEndFac = (smpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
      const currEndEvent = curr.nonStartEvent;
      if (!smpeComboPrevCurr || smpeComboPrevCurr.curr.endEvent) {
        return new SMPECombo(
          curr.startEvent.identifier,
          curr.startEvent,
          null,
          null,
          null,
          currEndEvent
        );
      } else {
        return new SMPECombo(
          smpeComboPrevCurr.curr.identifier,
          smpeComboPrevCurr.curr.startEvent,
          smpeComboPrevCurr.curr.moveEventPrev,
          smpeComboPrevCurr.curr.moveEventCurr,
          smpeComboPrevCurr.curr.pressEvent,
          currEndEvent
        );
      }
    };

    const smpeOnPressFac = (smpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
      const currPressEvent = curr.nonStartEvent;
      if (!smpeComboPrevCurr || smpeComboPrevCurr.curr.endEvent) {
        return new SMPECombo(
          curr.startEvent.identifier,
          curr.startEvent,
          null,
          null,
          currPressEvent
        );
      } else {
        return new SMPECombo(
          smpeComboPrevCurr.curr.identifier,
          smpeComboPrevCurr.curr.startEvent,
          smpeComboPrevCurr.curr.moveEventPrev,
          smpeComboPrevCurr.curr.moveEventCurr,
          currPressEvent,
          smpeComboPrevCurr.curr.endEvent
        );
      }
    };

    const newSmpeComboCurrFac = (smpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
      switch (curr.nonStartEvent.event.type) {
        case 'mousemove':
        case 'touchmove':
          return smpeOnMoveFac(smpeComboPrevCurr, curr);
        case 'mouseup':
        case 'touchend':
          return smpeOnEndFac(smpeComboPrevCurr, curr);
        case 'press':
          return smpeOnPressFac(smpeComboPrevCurr, curr);
        // default:
        // what about touchcancel
      }
    }

    const smpeDataRx = startNonStartEventsComboRx
      .scan((acc: SMPEData, curr: StartNonStartCombo) => {
        const currIdentifier = curr.startEvent.identifier;
        const oldSmpeComboPrevCurr: SMPEComboPrevCurr = acc.smpeCombosMap.get(currIdentifier);
        const newSmpeComboPrevCurr = {
          prev: acc.smpeCombosMap.get(currIdentifier) && acc.smpeCombosMap.get(currIdentifier).curr,
          curr:  newSmpeComboCurrFac(oldSmpeComboPrevCurr, curr)
        };
        acc.smpeCombosMap.set(currIdentifier, newSmpeComboPrevCurr);
        acc.latestIdentifier = currIdentifier;
        return acc;
      }, {smpeCombosMap: (<Map<Identifier, SMPEComboPrevCurr>>(new Map())), latestIdentifier: null})

    const emitTlTap = (smpeData: SMPEData) => {
      const type = tlGestureEventTypes.tlTap;
      if (listenOn(type)) {
        const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
        if (currSmpeCombo.endEvent) {
          const endEvent = currSmpeCombo.endEvent;
          const startEvent = currSmpeCombo.startEvent;
          if (endEvent.event.target === startEvent.event.target) {
            this[type].emit({type: type, time: endEvent.time});
          }
        }
      }
    };

    // const tlDblTapFac = (smpeData: SMPEData) => {
    //   if (listenOnFac('tlDblTap')) {
    //     const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
    //     if (currSmpeCombo.endEvent) {
    //       const endEvent = currSmpeCombo.endEvent;
    //       const startEvent = currSmpeCombo.startEvent;
    //       if (endEvent.event.target === startEvent.event.target) {
    //         this.tlTap.emit({type: 'tap', time: endEvent.time});
    //       }
    //     }
    //   }
    // };

    const tlGesturesEventRx = smpeDataRx
      .do(emitTlTap);

    const tlGesturesEvent_ = tlGesturesEventRx
      .subscribe(outcome => console.log(outcome));
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  startProcessing(event: Event) {
    event.preventDefault();
    // take 'all the touchstart' and 'only the mousedown where the left button was down'
    // for touchstart: event.button is undefined, which is evaluated as false
    // for mousedown on left button: event.button is 0, which is evaluated as false
    if (!(event as MouseEvent).button) {
      // use -1 as the identifier for mouse
      const identifier = event.type.search(/mouse/) > -1 ? -1 : (event as TouchEvent).changedTouches.item(0).identifier;
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
