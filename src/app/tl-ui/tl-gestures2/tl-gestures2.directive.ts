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
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/filter';
import { rootElement, tlGestureEventTypes, EventIT, Identifier,
  StartNonStartCombo, SMPECombo, SMPEComboPrevCurr, SMPEData, TlGestureEvent
} from './tl-gestures2';
import { smpeOnStartFac, smpeOnEndFac, smpeOnMoveFac, smpeOnPossiblePressFac } from './tl-gestures2-on';
import {  } from './tl-gestures2-emit';
/*
  flow:
    startEvent -> StartNonStartCombo -> SMPECombo -> SMPEComboPrevCurr -> SMPEData

*/

@Directive({
  selector: '[tlGestures2]'
})
export class TlGestures2Directive implements OnInit {
  private startEventRxx: Subject<EventIT> = new Subject();
  @Output() tlTap: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlDblTap: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPan: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPinch: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPress: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlRotate: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlSwipe: EventEmitter<TlGestureEvent> = new EventEmitter();
  private _options = {
    pressInterval: 500,
    shortTapStartEndInterval: 100,
    dblTapsInterval: 100,
    swipeThreshold: 20
  }
  constructor() {}

  ngOnInit() {

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

    const possiblePressRxFac = (identifier: number): Observable<EventIT> => {
      return Observable.interval(this._options.pressInterval).take(1)
        .map(() => ({event: {type: 'possiblePress'}, identifier, time: Date.now()}))
    };

    const nonStartEventRxFac = (startEvent: EventIT): Observable<EventIT> => {
      switch (startEvent.event.type) {
        case 'mousedown':
          return mouseRxFac('mousemove')
            .merge(possiblePressRxFac(-1))
            .takeUntil(mouseRxFac('mouseup').take(1))
            .merge(mouseRxFac('mouseup').take(1))
            .startWith(null);
        case 'touchstart':
          const identifier = (startEvent.event as TouchEvent).changedTouches.item(0).identifier;
          // console.log('after start', identifier);
          return touchRxFac('touchmove', identifier)
            .merge(possiblePressRxFac(identifier))
            .takeUntil(touchRxFac('touchend', identifier).take(1))
            .merge(touchRxFac('touchend', identifier).take(1))
            .startWith(null);
      }
    };


    const startNonStartEventsComboRx: Observable<StartNonStartCombo> = this.startEventRxx
      .mergeMap(startEvent => {
        console.log('go');
        return nonStartEventRxFac(startEvent);
      }, (startEvent, nonStartEvent) => ({startEvent, nonStartEvent}));

    const newSmpeComboCurrFac = (oldSmpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
      if (curr.nonStartEvent) {
        switch (curr.nonStartEvent.event.type) {
          case 'mousemove':
          case 'touchmove':
            return smpeOnMoveFac(oldSmpeComboPrevCurr, curr);
          case 'mouseup':
          case 'touchend':
            return smpeOnEndFac(oldSmpeComboPrevCurr, curr);
          case 'possiblePress':
            return smpeOnPossiblePressFac(oldSmpeComboPrevCurr, curr);
          // default:
          // what about touchcancel
        }
      } else { // if curr.nonStartEvent === null
        return smpeOnStartFac(oldSmpeComboPrevCurr, curr);
      }

    }

    const newActiveIdentifiersFac = (smpeData: SMPEData) => {
      const smpeCombosMapSize = smpeData.smpeCombosMap.size;
      const mouseCombosExist = !!smpeData.smpeCombosMap.get(-1);
      const smpeCombosMapSizeWithoutMouse = mouseCombosExist ? smpeCombosMapSize - 1 : smpeCombosMapSize;
      let firstActiveIdentifier = smpeData.firstActiveIdentifier, secondActiveIdentifier = smpeData.secondActiveIdentifier;
      switch (true) {
        case smpeCombosMapSizeWithoutMouse === 0:
          break;
        case smpeCombosMapSizeWithoutMouse === 1:
          if (!!smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr.endEvent) {
            firstActiveIdentifier = null;
          } else {
            firstActiveIdentifier = smpeData.latestIdentifier;
          }
          break;
        case smpeCombosMapSizeWithoutMouse === 2:
          !!smpeData.smpeCombosMap.get(firstActiveIdentifier).curr.endEvent ?
            firstActiveIdentifier = smpeData.latestIdentifier : 0
          break;
      }
      return {
        firstActiveIdentifier: null,
        secondActiveIdentifier: null
      }
    }

    const getLastShortTap = (smpeData: SMPEData) => {
      const lastSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
      const lastSmpeComboEnded = !!lastSmpeCombo.endEvent;
      if (lastSmpeComboEnded) {
        const sameTarget = lastSmpeCombo.endEvent.event.target === lastSmpeCombo.startEvent.event.target;
        const shortDuration = lastSmpeCombo.duration <= this._options.shortTapStartEndInterval;
        if (sameTarget && shortDuration) {
          return ({
            identifier: lastSmpeCombo.identifier, 
            target: lastSmpeCombo.startEvent.event.target,
            time: lastSmpeCombo.endEvent.time,
            type: 'shortTap', 
          });
        }
      }
      return smpeData.lastShortTap;
    }

    const smpeDataRx = startNonStartEventsComboRx
      .scan((acc: SMPEData, curr: StartNonStartCombo) => {
        const currIdentifier = curr.startEvent.identifier;
        const oldSmpeComboPrevCurr: SMPEComboPrevCurr = acc.smpeCombosMap.get(currIdentifier);
        const newSmpeComboPrevCurr: SMPEComboPrevCurr = {
          prev: oldSmpeComboPrevCurr && oldSmpeComboPrevCurr.curr,
          curr: newSmpeComboCurrFac(oldSmpeComboPrevCurr, curr)
        };
        acc.smpeCombosMap.set(currIdentifier, newSmpeComboPrevCurr);
        acc.latestIdentifier = currIdentifier;
        const newActiveIdentifiers = newActiveIdentifiersFac(acc);
        acc.firstActiveIdentifier = newActiveIdentifiers.firstActiveIdentifier;
        acc.secondActiveIdentifier = newActiveIdentifiers.secondActiveIdentifier;
        acc.lastShortTap = getLastShortTap(acc);
        return acc;
      }, {
        smpeCombosMap: (<Map<Identifier, SMPEComboPrevCurr>>(new Map())),
        latestIdentifier: null,
        firstActiveIdentifier: null,
        secondActiveIdentifier: null,
        lastShortTap: null
      });

 const listenOn = (gestureEvent) => {
  return !!this[gestureEvent].observers.length;
};

 const emitTlTap = (smpeData: SMPEData) => {
  // if SMPEComboPrevCurr.curr.endEvent.event.target === SMPEComboPrevCurr.curr.startEvent.event.target \
  // emit tlTap
  console.log(this);
  const type = tlGestureEventTypes.tlTap;
  if (listenOn(type)) {
    console.log('gogo');
    const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
    if (currSmpeCombo.endEvent) {
      const {endEvent, startEvent} = currSmpeCombo;
      if (endEvent.event.target === startEvent.event.target) {
        this[type].emit({
          identifier: currSmpeCombo.identifier, 
          target: endEvent.event.target,
          time: endEvent.time,
          type
        });
      }
    }
  }
};


    const tlGesturesEventRx = smpeDataRx
      .do(emitTlTap)
      // .do(emitTlDblTap)
      // .do(emitTlPress)
      // .do(emitTlPan)
      // .do(emitTlSwipe)
      // .do(emitTlPinch)
      // .do(emitTlRotate)

    const tlGesturesEvent_ = tlGesturesEventRx
      .subscribe(outcome => console.log(outcome), err => console.log(err), () => console.log('completed'));
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
