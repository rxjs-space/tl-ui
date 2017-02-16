import { EventEmitter, Directive, HostListener, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/mergeMap';

import { baseEventTypes, EventIT, TlGestureEvent, tlGestureEventTypes,
  StartNonStartCombo, SMPE4SinglePointer, SMPEData, SinglePointerData, 

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
    smpeCombosMap: new Map(),
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
    console.log('inside ngOnInit');
    // workflow: startEvent -> StartNonStartCombo -> SMPECombo -> SMPEData -> tlGestureEvent

    const startNonStartEventsComboRx: Observable<StartNonStartCombo> = this.startEventRxx
      .mergeMap(startEvent => {
        return this.nonStartEventRxFac(this, startEvent);
      }, (startEvent, nonStartEvent) => ({startEvent, nonStartEvent}));

    const smpeDataRx = startNonStartEventsComboRx
      .scan(this.calNewSMPEData.bind(this), this.initSMPEData);

    const tlGesturesEventRx = smpeDataRx
      .do(this.emit.bind(this));

    const tlGesturesEvent_ = tlGesturesEventRx
      .subscribe(outcome => console.log(outcome), err => console.log(err), () => console.log('completed'));

  }

  emit(smpeData: SMPEData) {
    const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier);
    const {endEvent, startEvent} = currSmpeCombo;

    let type = tlGestureEventTypes.tlTap;
    if (this.listenOn(type) && endEvent && endEvent.event.target === startEvent.event.target) {
      // if endEvent.event.target === startEvent.event.target, emit tlTap
      this[type].emit({
        identifier: currSmpeCombo.identifier,
        target: endEvent.event.target,
        time: endEvent.time,
        type
      });
    }
  }



  listenOn(gestureEventType: string) {
    return !!this[gestureEventType].observers.length;
  }

  calNewSMPEData(oldSMPEData: SMPEData, currSNC: StartNonStartCombo) {
    console.log('inside calNewSMPEData');
    const latestIdentifier = currSNC.startEvent.identifier;
    const oldSMPE4SinglePointer: SMPE4SinglePointer = oldSMPEData.smpeCombosMap.get(latestIdentifier);
    const newSMPE4SinglePointer: SMPE4SinglePointer = this.calNewSMPE4SinglePointer(oldSMPE4SinglePointer, currSNC);
    oldSMPEData.latestIdentifier = latestIdentifier;
    oldSMPEData.smpeCombosMap.set(latestIdentifier, newSMPE4SinglePointer);
    oldSMPEData.singlePointerData = this.calSinglePointerData(oldSMPEData, currSNC); // need refactor: currSNC info already in oldSMPEData
    oldSMPEData.twoPointerData = this.calTwoPointerData(oldSMPEData);
    return oldSMPEData; // return oldSMPEData for the moment, need to construct a newSMPEData actually
  }

  calTwoPointerData(oldSMPEData: SMPEData) {
    const listCopy = [...oldSMPEData.twoPointerData.activeTouchIdentifiers];
    const calNewActiveTouchIdentifiers = (smpe: SMPEData) => {
      const anotherListCopy = [...smpe.twoPointerData.activeTouchIdentifiers];
      if (smpe.latestIdentifier > -1) { // if it's a touch
        const smpeCombo = smpe.smpeCombosMap.get(smpe.latestIdentifier)
        switch (true) {
          case smpeCombo.moveEventCurr === null && smpeCombo.endEvent === null: // fresh start
            anotherListCopy.push(smpe.latestIdentifier);
            break;
          case !!smpeCombo.endEvent: // ended
            const index = anotherListCopy.indexOf(smpe.latestIdentifier);
            anotherListCopy.splice(index, 1);
        }
      }
      return anotherListCopy;
    };

    const newActiveTouchIdentifiers = calNewActiveTouchIdentifiers(oldSMPEData);
    const listChanged = listCopy[0] !== newActiveTouchIdentifiers[0] || listCopy[1] || newActiveTouchIdentifiers[1];

    const calNewDistanceCurr = (smpeMap: Map<number, SMPE4SinglePointer>, activeTouchIdentifiers: number[]) => {
      if (activeTouchIdentifiers.length > 1) {
        const firstSMPECombo = smpeMap.get(activeTouchIdentifiers[0]);
        const secondSMPECombo = smpeMap.get(activeTouchIdentifiers[1]);
        let pageX0, pageY0, pageX1, pageY1;
        if (firstSMPECombo.moveEventCurr) {
          pageX0 = (firstSMPECombo.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
          pageY0 = (firstSMPECombo.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
        } else {
          pageX0 = (firstSMPECombo.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
          pageY0 = (firstSMPECombo.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
        }
        if (secondSMPECombo.moveEventCurr) {
          pageX0 = (secondSMPECombo.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
          pageY0 = (secondSMPECombo.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
        } else {
          pageX0 = (secondSMPECombo.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
          pageY0 = (secondSMPECombo.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
        }
        return Math.sqrt(Math.pow(pageX0 - pageX1, 2) + Math.pow(pageY0 - pageY1, 2));
      }
    };

    const newDistanceCurr = calNewDistanceCurr(oldSMPEData.smpeCombosMap, newActiveTouchIdentifiers);
    const newDistancePrev = listChanged ? null : oldSMPEData.twoPointerData.distanceBetweenPointersCurr;
    const newDistanceChange = listChanged ? null : Math.abs(newDistanceCurr - newDistancePrev);

    return {
      activeTouchIdentifiers: newActiveTouchIdentifiers,
      distanceBetweenPointersPrev: newDistancePrev,
      distanceBetweenPointersCurr: newDistanceCurr,
      distanceBetweenPointersChange: newDistanceChange,
      anglePrev: 0,
      anguleCurr: 0,
      angleChange: 0,
    }
  }

  calSinglePointerData(oldSMPEData: SMPEData, currSNC: StartNonStartCombo) {
    const oldSinglePointerData = oldSMPEData.singlePointerData;
    const calOffsetFromStart = (snc: StartNonStartCombo) => {
      if (snc.nonStartEvent) {
        let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
        switch (snc.startEvent.identifier) {
          case -1: // mouse event
            currPageX = (snc.nonStartEvent.event as MouseEvent).pageX;
            currPageY = (snc.nonStartEvent.event as MouseEvent).pageY;
            prevPageX = (snc.startEvent.event as MouseEvent).pageX;
            prevPageY = (snc.startEvent.event as MouseEvent).pageY;
            break;
          default: // touch event
            currPageX = (snc.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageX;
            currPageY = (snc.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageY;
            prevPageX = (snc.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
            prevPageY = (snc.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
        }
        return {x: currPageX - prevPageX, y: currPageY - prevPageY};
      }
    };

    const isShorttap = (snc: StartNonStartCombo) => {
      // if the snc ended, check if its a shorttap
      let isShortTap = false;
      if (snc.nonStartEvent.event.type === baseEventTypes.mouse.end || 
        snc.nonStartEvent.event.type === baseEventTypes.touch.end
      ) {
        // if target are the same and interval are short
        const sameTarget = snc.startEvent.event.target === snc.nonStartEvent.event.target;
        const isShortInterval = snc.nonStartEvent.time - snc.startEvent.time <= this.options.shortTapStartEndInterval;
        if (sameTarget && isShortInterval) {
          isShortTap = true;
        }
      }
      return isShortTap;
    };

    const calNewLatestShortTaps = (oldLatestShortTaps: any, snc: StartNonStartCombo) => {
      if ( snc.nonStartEvent && 
        (snc.nonStartEvent.event.type === baseEventTypes.mouse.end || snc.nonStartEvent.event.type === baseEventTypes.touch.end) && 
        isShorttap(snc)) {
        return {
          prev: oldLatestShortTaps.curr,
          curr: {
            identifier: snc.nonStartEvent.identifier,
            target: snc.nonStartEvent.event.target,
            time: snc.nonStartEvent.time
          }
        };
      } else {
        return Object.assign({}, oldLatestShortTaps);
      }
    };


    const calNewMovement = (oldSMPE4SinglePointer: SMPE4SinglePointer, snc: StartNonStartCombo) => {
      if (snc.nonStartEvent) {
        let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
        switch (oldSMPE4SinglePointer.startEvent.identifier) {
          case -1: // mouse event
            currPageX = (currSNC.nonStartEvent.event as MouseEvent).pageX;
            currPageY = (currSNC.nonStartEvent.event as MouseEvent).pageY;
            switch (!!oldSMPE4SinglePointer.moveEventCurr) {
              case true: // moved before
                prevPageX = (oldSMPE4SinglePointer.moveEventCurr.event as MouseEvent).pageX;
                prevPageY = (oldSMPE4SinglePointer.moveEventCurr.event as MouseEvent).pageY;
                break;
              case false: // not moved before
                prevPageX = (oldSMPE4SinglePointer.startEvent.event as MouseEvent).pageX;
                prevPageY = (oldSMPE4SinglePointer.startEvent.event as MouseEvent).pageY;
                break;
            }
            break;
          default: // touch event
            currPageX = (currSNC.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageX;
            currPageY = (currSNC.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageY;
            switch (!!oldSMPE4SinglePointer.moveEventCurr) {
              case true: // moved before
                prevPageX = (oldSMPE4SinglePointer.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
                prevPageY = (oldSMPE4SinglePointer.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
                break;
              case false: // not moved before
                prevPageX = (oldSMPE4SinglePointer.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
                prevPageY = (oldSMPE4SinglePointer.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
                break;
            }
        }
        return {x: currPageX - prevPageX, y: currPageY - prevPageY}
      }
    }

    return {
      latestShortTaps: calNewLatestShortTaps(oldSinglePointerData.latestShortTaps, currSNC),
      offsetFromStartPoint: calOffsetFromStart(currSNC),
      movement: calNewMovement(oldSMPEData.smpeCombosMap.get(currSNC.startEvent.identifier), currSNC)
    };
  }


  /**
   * calculate newSMPE4SinglePointer based on oldSMPE4SinglePointer and current StartNonStartCombo
   */
  calNewSMPE4SinglePointer(oldSMPE4SinglePointer: SMPE4SinglePointer, currSNC: StartNonStartCombo) {
    console.log('inside calNewSMPE4SinglePointer');
    const onStart = (snc: StartNonStartCombo) => {
      // always return new SMPECombo when curr.nonStartEvent === null
      return new SMPE4SinglePointer(
        snc.startEvent.identifier,
        snc.startEvent,
        null,
        null,
        null,
        null,
        null,
        snc.startEvent.event.type,
      );
    };

    const onMove = (snc: StartNonStartCombo, smpe: SMPE4SinglePointer) => {
      const currMoveEvent = snc.nonStartEvent;
      return new SMPE4SinglePointer(
        smpe.identifier,
        smpe.startEvent,
        smpe.moveEventCurr, // use last moveEventCurr as the new moveEventPrev
        currMoveEvent,
        smpe.possiblePressEvent,
        smpe.pressEvent,
        smpe.endEvent,
        currMoveEvent.event.type,
      );
    };

    const onEnd = (snc: StartNonStartCombo, smpe: SMPE4SinglePointer) => {
      const currEndEvent = snc.nonStartEvent;
      return new SMPE4SinglePointer(
        smpe.identifier,
        smpe.startEvent,
        smpe.moveEventPrev,
        smpe.moveEventCurr,
        smpe.possiblePressEvent,
        smpe.pressEvent,
        currEndEvent,
        currEndEvent.event.type,
      );
    };

    const onPossiblePress = (snc: StartNonStartCombo, smpe: SMPE4SinglePointer) => {
      const currPossiblePressEvent = snc.nonStartEvent;
      let currPressEvent, currType;
      const moved = !!smpe.moveEventCurr;
      const sameTargetAfterMove = moved && smpe.moveEventCurr.event.target === 
        smpe.startEvent.event.target;
      if (moved && !sameTargetAfterMove) {
        currType = currPossiblePressEvent.event.type;
        currPressEvent = smpe.pressEvent; // remain unchanged
      } else {
        currType = 'press';
        currPressEvent = Object.assign(currPossiblePressEvent, {type: currType});
      }

      return new SMPE4SinglePointer(
        smpe.identifier,
        smpe.startEvent,
        smpe.moveEventPrev,
        smpe.moveEventCurr,
        currPossiblePressEvent,
        currPressEvent,
        smpe.endEvent,
        currType,
      );
    };

    if (currSNC.nonStartEvent) {
      switch (currSNC.nonStartEvent.event.type) {
        case 'mousemove':
        case 'touchmove':
          return onMove(currSNC, oldSMPE4SinglePointer);
        case 'mouseup':
        case 'touchend':
          return onEnd(currSNC, oldSMPE4SinglePointer);
        case 'possiblePress':
          return onPossiblePress(currSNC, oldSMPE4SinglePointer);
        // default:
        // what about touchcancel
      }
    } else { // if currSNC.nonStartEvent === null
      return onStart(currSNC);
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
