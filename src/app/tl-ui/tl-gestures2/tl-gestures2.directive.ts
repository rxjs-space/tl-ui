import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import { tlGestureEventTypes, EventIT, Identifier,
  StartNonStartCombo, SMPECombo, SMPEComboPrevCurr, SMPEData, TlGestureEvent
} from './tl-gestures2';
import { newSmpeComboCurr, newActiveTouchIdentifiers, 
    newFirstTwoActiveTouchesDistance, composeShortTraps } from './tl-gestures2-prepare-smpe-data';
import { emitTlTap, emitTlDblTap, emitTlPress, emitTlPan, emitTlSwipe, emitTlPinch } from './tl-gestures2-emit';
import { nonStartEventRxFac } from './tl-gestures2-non-start-events';

// flow: startEvent -> StartNonStartCombo -> SMPECombo -> SMPEComboPrevCurr -> SMPEData

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
  options = {
    pressInterval: 500,
    shortTapStartEndInterval: 150,
    dblTapsInterval: 400, // time between firstShortTap endTIme and secondeShortTap endTime
    swipeDistanceThreshold: 20
  };
  constructor() {}

  ngOnInit() {

    const startNonStartEventsComboRx: Observable<StartNonStartCombo> = this.startEventRxx
      .mergeMap(startEvent => {
        return nonStartEventRxFac(this, startEvent);
      }, (startEvent, nonStartEvent) => ({startEvent, nonStartEvent}));

    const smpeDataRx = startNonStartEventsComboRx
      .scan((acc: SMPEData, curr: StartNonStartCombo) => {
        const currIdentifier = curr.startEvent.identifier;
        const oldSmpeComboPrevCurr: SMPEComboPrevCurr = acc.smpeCombosMap.get(currIdentifier);
        const newSmpeComboPrevCurr: SMPEComboPrevCurr = {
          prev: oldSmpeComboPrevCurr && oldSmpeComboPrevCurr.curr,
          curr: newSmpeComboCurr(oldSmpeComboPrevCurr, curr)
        };
        acc.smpeCombosMap.set(currIdentifier, newSmpeComboPrevCurr);
        acc.latestIdentifier = currIdentifier;
        acc.activeTouchIdentifiers = newActiveTouchIdentifiers(acc);
        acc.firstTwoActiveTouchesDistance = newFirstTwoActiveTouchesDistance(acc);
        acc.lastShortTaps = composeShortTraps(this, acc);
        return acc;
      }, {
        smpeCombosMap: (<Map<Identifier, SMPEComboPrevCurr>>(new Map())),
        sCM: (<Map<Identifier, SMPECombo>>(new Map())),
        latestIdentifier: null,
        activeTouchIdentifiers: [],
        firstTwoActiveTouchesDistance: {identifiers: null, distancePrev: null, distanceCurr: null, distanceDiff: null},
        lastShortTaps: null
      });

    const tlGesturesEventRx = smpeDataRx
      .do(emitTlTap(this))
      .do(emitTlDblTap(this))
      .do(emitTlPress(this))
      .do(emitTlPan(this))
      .do(emitTlSwipe(this))
      .do(emitTlPinch(this))
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


}
