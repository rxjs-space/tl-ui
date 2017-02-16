import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';

import { baseEventTypes, EventIT, TlGestureEvent, tlGestureEventTypes,
  StartNonStartCombo, SMPE4SinglePointer, SMPEData, 
} from './tl-gestures3';

@Directive({
  selector: '[tlGestures3]'
})
export class TlGestures3Directive implements OnInit {

  private startEventRxx: Subject<EventIT> = new Subject();
  @Output() tlTap: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlShorttap: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlDbltap: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPanstart: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPanmove: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPanend: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPinchstart: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPinchmove: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPinchend: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPress: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlRotatestart: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlRotatemove: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlRotateend: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlSwipe: EventEmitter<TlGestureEvent> = new EventEmitter();

  private  _options = {
    pressInterval: 500,
    shortTapStartEndInterval: 150,
    dblTapsInterval: 400, // time between firstShortTap endTIme and secondeShortTap endTime
    swipeDistanceThreshold: 20
  };
  public get options() {
    return this._options;
  }

  private initSMPEData: SMPEData = {
    SMPECombosMap: new Map(),
    latestIdentifier: null,
    singlePointerData: {},
    twoPointerData: {
      activeTouchIdentifiers: []
    }
  }

  constructor() { }

  @HostListener(baseEventTypes.mouse.start, ['$event'])
  @HostListener(baseEventTypes.touch.start, ['$event'])
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


  ngOnInit() {
    console.log('3');
    // flow: startEvent -> StartNonStartCombo -> SMPECombo -> SMPEData -> tlGestureEvent

    const startNonStartEventsComboRx: Observable<StartNonStartCombo> = this.startEventRxx
      .mergeMap(startEvent => {
        return this.nonStartEventRxFac(this, startEvent);
      }, (startEvent, nonStartEvent) => ({startEvent, nonStartEvent}));

    const smpeDataRx = startNonStartEventsComboRx
      .scan(this.calNewSMPEData, this.initSMPEData);

    // const tlGesturesEventRx = smpeDataRx
      // .do(emit())

    // const tlGesturesEvent_ = tlGesturesEventRx
    //   .subscribe(outcome => console.log(outcome), err => console.log(err), () => console.log('completed'));

  }

  listenOn(gestureEventType: string) {
    return !!this[gestureEventType].observers.length;
  }

  calNewSMPEData(oldSMPEData: SMPEData, currSNC: StartNonStartCombo) {
    const latestIdentifier = currSNC.startEvent.identifier;
    const oldSMPE4SinglePointer: SMPE4SinglePointer = oldSMPEData.SMPECombosMap.get(latestIdentifier);
    const newSMPE4SinglePointer: SMPE4SinglePointer = this.calNewSMPE4SinglePointer(oldSMPE4SinglePointer, currSNC);
    oldSMPEData.SMPECombosMap.set(latestIdentifier, newSMPE4SinglePointer);
    oldSMPEData.latestIdentifier = latestIdentifier;
    // oldSMPEData.activeTouchIdentifiers = newActiveTouchIdentifiers(oldSMPEData);
    // oldSMPEData.firstTwoActiveTouchesDistance = newFirstTwoActiveTouchesDistance(oldSMPEData);
    // oldSMPEData.lastShortTaps = composeShortTraps(this, oldSMPEData);
    return oldSMPEData; // return oldSMPEData for the moment, need to construct a newSMPEData actually
  }



  /**
   * calculate newSMPE4SinglePointer based on oldSMPE4SinglePointer and current StartNonStartCombo
   */
  calNewSMPE4SinglePointer(oldSMPE4SinglePointer: SMPE4SinglePointer, currSNC: StartNonStartCombo) {

    // const calMovement = () => {
    //   let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
    //   switch (oldSMPE4SinglePointer.startEvent.identifier) {
    //     case -1: // mouse event
    //       currPageX = (currSNC.nonStartEvent.event as MouseEvent).pageX;
    //       currPageY = (currSNC.nonStartEvent.event as MouseEvent).pageY;
    //       switch (!!oldSMPE4SinglePointer.moveEventCurr) {
    //         case true: // moved before
    //           prevPageX = (oldSMPE4SinglePointer.moveEventCurr.event as MouseEvent).pageX;
    //           prevPageY = (oldSMPE4SinglePointer.moveEventCurr.event as MouseEvent).pageY;
    //           break;
    //         case false: // not moved before
    //           prevPageX = (oldSMPE4SinglePointer.startEvent.event as MouseEvent).pageX;
    //           prevPageY = (oldSMPE4SinglePointer.startEvent.event as MouseEvent).pageY;
    //           break;
    //       }
    //       break;
    //     default: // touch event
    //       currPageX = (currSNC.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageX;
    //       currPageY = (currSNC.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageY;
    //       switch (!!oldSMPE4SinglePointer.moveEventCurr) {
    //         case true: // moved before
    //           prevPageX = (oldSMPE4SinglePointer.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
    //           prevPageY = (oldSMPE4SinglePointer.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
    //           break;
    //         case false: // not moved before
    //           prevPageX = (oldSMPE4SinglePointer.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
    //           prevPageY = (oldSMPE4SinglePointer.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
    //           break;
    //       }
    //   }
    //   return {x: currPageX - prevPageX, y: currPageY - prevPageY}
    // }

    // const calDistance = (oldSmpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
    //   let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
    //   switch (oldSmpeComboPrevCurr.curr.startEvent.identifier) {
    //     case -1: // mouse event
    //       currPageX = (curr.nonStartEvent.event as MouseEvent).pageX;
    //       currPageY = (curr.nonStartEvent.event as MouseEvent).pageY;
    //       prevPageX = (oldSmpeComboPrevCurr.curr.startEvent.event as MouseEvent).pageX;
    //       prevPageY = (oldSmpeComboPrevCurr.curr.startEvent.event as MouseEvent).pageY;
    //       break;
    //     default: // touch event
    //       currPageX = (curr.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageX;
    //       currPageY = (curr.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageY;
    //       prevPageX = (oldSmpeComboPrevCurr.curr.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
    //       prevPageY = (oldSmpeComboPrevCurr.curr.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
    //   }
    //   return {x: currPageX - prevPageX, y: currPageY - prevPageY}
    // }


    const onStart = () => {
      // always return new SMPECombo when curr.nonStartEvent === null
      return new SMPE4SinglePointer(
        currSNC.startEvent.identifier,
        currSNC.startEvent,
        null,
        null,
        null,
        null,
        null,
        currSNC.startEvent.event.type,
      );
    };

    const onMove = () => {
      const currMoveEvent = currSNC.nonStartEvent;
      return new SMPE4SinglePointer(
        oldSMPE4SinglePointer.identifier,
        oldSMPE4SinglePointer.startEvent,
        oldSMPE4SinglePointer.moveEventCurr, // use last moveEventCurr as the new moveEventPrev
        currMoveEvent,
        oldSMPE4SinglePointer.possiblePressEvent,
        oldSMPE4SinglePointer.pressEvent,
        oldSMPE4SinglePointer.endEvent,
        currMoveEvent.event.type,
      );
    };

    const onEnd = () => {
      const currEndEvent = currSNC.nonStartEvent;
      return new SMPE4SinglePointer(
        oldSMPE4SinglePointer.identifier,
        oldSMPE4SinglePointer.startEvent,
        oldSMPE4SinglePointer.moveEventPrev,
        oldSMPE4SinglePointer.moveEventCurr,
        oldSMPE4SinglePointer.possiblePressEvent,
        oldSMPE4SinglePointer.pressEvent,
        currEndEvent,
        currEndEvent.event.type,
      );
    };

    const onPossiblePress = () => {
      const currPossiblePressEvent = currSNC.nonStartEvent;
      let currPressEvent, currType;
      const moved = !!oldSMPE4SinglePointer.moveEventCurr;
      const sameTargetAfterMove = moved && oldSMPE4SinglePointer.moveEventCurr.event.target === 
        oldSMPE4SinglePointer.startEvent.event.target;
      if (moved && !sameTargetAfterMove) {
        currType = currPossiblePressEvent.event.type;
        currPressEvent = oldSMPE4SinglePointer.pressEvent; // remain unchanged
      } else {
        currType = 'press';
        currPressEvent = Object.assign(currPossiblePressEvent, {type: currType});
      }

      return new SMPE4SinglePointer(
        oldSMPE4SinglePointer.identifier,
        oldSMPE4SinglePointer.startEvent,
        oldSMPE4SinglePointer.moveEventPrev,
        oldSMPE4SinglePointer.moveEventCurr,
        currPossiblePressEvent,
        currPressEvent,
        oldSMPE4SinglePointer.endEvent,
        currType,
      );
    };

    if (currSNC.nonStartEvent) {
      switch (currSNC.nonStartEvent.event.type) {
        case 'mousemove':
        case 'touchmove':
          return onMove();
        case 'mouseup':
        case 'touchend':
          return onEnd();
        case 'possiblePress':
          return onPossiblePress();
        // default:
        // what about touchcancel
      }
    } else { // if currSNC.nonStartEvent === null
      return onStart();
    }

  }

  /**
   * the stream triggered by startEventRxx
   */
  nonStartEventRxFac = (tlGestures3Directive: TlGestures3Directive, startEvent: EventIT): Observable<EventIT> => {
    const rootElement = document;

    const mouseRxFac = (eventType: 'mouseup' | 'mousemove'): Observable<EventIT> => {
      return Observable.fromEvent(rootElement, eventType)
        .map((e: Event) => ({event: e, identifier: -1, time: Date.now()}));
    };

    const possiblePressRxFac = (identifier: number): Observable<EventIT> => {
      return Observable.interval(tlGestures3Directive.options.pressInterval).take(1)
        .map(() => ({event: {type: 'possiblePress', target: null}, identifier, time: Date.now()}));
        // event.target of possiblePress will always be null, the target of moveEvent (if any) in SMPE4SinglePointer matters
    };

    const touchRxFac = (eventType: 'touchend' | 'touchmove', identifier: number): Observable<EventIT> => {
      return Observable.fromEvent(rootElement, eventType)
        .filter((event: TouchEvent) => {
          // take this nonStartEvent only when it has the same identifier as startEvent.identifier
          return event.changedTouches.item(0).identifier === identifier;
        })
        .map((e: Event) => ({event: e, identifier, time: Date.now()}));
    };

    switch (startEvent.event.type) {
      case 'mousedown':
        // 'mousedown' flow: \
        // at the beginning, emit {s: mousedown, e: null}
        // then, emit {s: mousedown, e: (mousemove * (0 or n) -> possiblePress * (0 or 1)) -> mouseup}
        return mouseRxFac('mousemove')
          .merge(possiblePressRxFac(-1))
          .takeUntil(mouseRxFac('mouseup'))
          .merge(mouseRxFac('mouseup').take(1))
          .startWith(null);
      case 'touchstart':
        const identifier = (startEvent.event as TouchEvent).changedTouches.item(0).identifier;
        return touchRxFac('touchmove', identifier)
          .merge(possiblePressRxFac(identifier))
          .takeUntil(touchRxFac('touchend', identifier).take(1))
          .merge(touchRxFac('touchend', identifier).take(1))
          .startWith(null);
    }
  }



}
