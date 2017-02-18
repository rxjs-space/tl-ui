import { EventEmitter, Directive, HostListener, Input, Output, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

import { baseEventTypes, EventIT, TlGestureEvent, tlGestureEventTypes,
  StartNonStartCombo, SMPE4SinglePointer, SMPEData, SinglePointerData, 
  mousemoveOrEnd, touchmoveOrEnd, TlGestureOptions,
} from './tl-gestures3';
// if put TlGestureConfigs (an interface for input property) in 'tl-gestures3.ts', \
// where there are other exports, tsc will warn that \
// 'WARNING in ./src/app/tl-ui/tl-gestures3/tl-gestures3.directive.ts \
// 698:91-107 "export 'TlGestureConfigs' was not found in './tl-gestures3'' \
// when put TlGestureConfigs in separate file, no more warning
import { TlGestureConfigs } from './tl-gestures3.2';

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
  @Output() tlPinchchange: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPinchend: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlPress: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlRotatestart: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlRotatechange: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlRotateend: EventEmitter<TlGestureEvent> = new EventEmitter();
  @Output() tlSwipe: EventEmitter<TlGestureEvent> = new EventEmitter();

  @Input() tlGestureConfig: TlGestureConfigs;

  private  _options: TlGestureOptions = {
    pressInterval: 500,
    shortTapStartEndInterval: 150,
    dblTapsInterval: 400, // time between firstShortTap endTIme and secondeShortTap endTime
    swipeDistanceThreshold: 20,
  };
  public get options() {
    return this._options;
  }

  private initSMPEData: SMPEData = {
    smpeCombosMap: new Map(),
    latestIdentifier: null,
    activeTouchIdentifiers: {prev: [], curr: []},
    singlePointerData: {},
    twoPointerData: {}
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
    // console.log('inside ngOnInit');
    // workflow: startEvent -> StartNonStartCombo -> SMPE4SinglePointer -> SMPEData -> tlGestureEvent

    const startNonStartEventsComboRx: Observable<StartNonStartCombo> = this.startEventRxx
      .mergeMap(startEvent => {
        return this.nonStartEventRxFac(this, startEvent);
      }, (startEvent, nonStartEvent) => ({startEvent, nonStartEvent}));

    const smpeDataRx = startNonStartEventsComboRx
      .scan(this.calNewSMPEData.bind(this), this.initSMPEData);

    const tlGesturesEventRx = smpeDataRx
      .do(this.emit.bind(this));

    const tlGesturesEvent_ = tlGesturesEventRx
      .subscribe(outcome => {
        if (this.tlGestureConfig.logSMPEData) {
          console.log(outcome);
        }
      }, err => console.log(err), () => console.log('completed'));

  }

  emit(smpeData: SMPEData) {
    const identifier = smpeData.latestIdentifier;
    const currSmpeCombo = smpeData.smpeCombosMap.get(identifier);
    const {endEvent, startEvent, moveEventCurr, pressEvent, latestEventType} = currSmpeCombo;
    const {singlePointerData, twoPointerData, activeTouchIdentifiers} = smpeData;
    let type;

    type = tlGestureEventTypes.tlTap;
    if (this.listenOn(type) && endEvent && endEvent.event.target === startEvent.event.target) {
      // if endEvent.event.target === startEvent.event.target, emit tlTap
      this[type].emit({
        identifier,
        target: endEvent.event.target,
        time: endEvent.time,
        type
      });
    }

    type = tlGestureEventTypes.tlDbltap;
    if (this.listenOn(type) && 
      endEvent &&
      singlePointerData.latestShortTaps && 
      singlePointerData.latestShortTaps.prev) {
      // if lastShortTaps has the same target and identifer and timeBetween is <= threshhold, emit tlDblTap
      const {prev, curr} = singlePointerData.latestShortTaps;
      const sameTarget = prev.target === curr.target;
      const sameIdentifier = prev.identifier === curr.identifier;
      const timeBetween = curr.time - prev.time;
      // console.log(timeBetween);
      if (sameTarget && sameIdentifier && timeBetween <= this.options.dblTapsInterval) {
        this[type].emit({
          identifier,
          target: curr.target,
          time: curr.time,
          type
        });
      }
    }

    type = tlGestureEventTypes.tlPress;
    if (this.listenOn(type)) {
      // if currSmpeCombo.latestEventType === 'press', emit tlPress
      if (currSmpeCombo.latestEventType === baseEventTypes.press) {
        this[type].emit({
          identifier,
          target: startEvent.event.target,
          time: pressEvent.time,
          type,
        });
      }
    }

    type = tlGestureEventTypes.tlSwipe;
    if (this.listenOn(type)) {
      // if currSmpeCombo.endEvent exists and distance >= threshold, emit swipe
      if (currSmpeCombo.endEvent) {
        const offsetFromStartPoint = smpeData.singlePointerData.offsetFromStartPoint;
        const offsetX = offsetFromStartPoint.x;
        const offsetY = offsetFromStartPoint.y;
        const distance = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2))
        if (distance >= this.options.swipeDistanceThreshold) {
          this[type].emit({
            identifier,
            target: currSmpeCombo.startEvent.event.target,
            time: currSmpeCombo.endEvent.time,
            type,
            singlePointerData: {
              offsetFromStartPoint
            }
          });
        }
      }
    }


    const firstActiveTouchIdentifiersChanged = activeTouchIdentifiers.curr[0] !== activeTouchIdentifiers.prev[0];

    type = tlGestureEventTypes.tlPanstart;
    if (this.listenOn(type) && 
      ((activeTouchIdentifiers.curr.length > 0 && firstActiveTouchIdentifiersChanged) || 
      latestEventType === 'mousedown')
    ) {
      if (latestEventType === 'mousedown') {
        this[type].emit({
          identifier,
          target: startEvent.event.target,
          time: startEvent.time,
          type
        });
      } else {

        const currIdentifier = activeTouchIdentifiers.curr[0];
        const currStartEvent = smpeData.smpeCombosMap.get(currIdentifier).startEvent;
        switch (true) {
          case activeTouchIdentifiers.prev.length === 0:
            this[type].emit({
              identifier: currIdentifier,
              target: currStartEvent.event.target,
              time: currStartEvent.time,
              type
            });
            break;
          case activeTouchIdentifiers.prev.length > 0:
            const prevIdentifier = activeTouchIdentifiers.prev[0];
            const prevEndEvent = smpeData.smpeCombosMap.get(prevIdentifier).endEvent;
            this[type].emit({
              identifier: currIdentifier,
              target: currStartEvent.event.target,
              time: prevEndEvent.time,
              type
            });
            break;

        }

      }

    }

    type = tlGestureEventTypes.tlPanmove;
    if (this.listenOn(type) && currSmpeCombo.latestEventType.search(/move/) > -1) {
      // if latestEventType is move, emit panmove
      this[type].emit({
        identifier,
        target: startEvent.event.target,
        time: moveEventCurr.time,
        type,
        singlePointerData: {
          movement: singlePointerData.movement
        }
      });
    }

    type = tlGestureEventTypes.tlPanend;
    if (this.listenOn(type) && ((endEvent && firstActiveTouchIdentifiersChanged) || latestEventType === 'mouseup')) {
      this[type].emit({
        identifier,
        target: startEvent.event.target,
        time: endEvent.time,
        type
      });
    }

    const firstTwoActiveTouchIdentifiersChanged = activeTouchIdentifiers.curr[0] !== activeTouchIdentifiers.prev[0] || 
      activeTouchIdentifiers.curr[1] !== activeTouchIdentifiers.prev[1];

    type = tlGestureEventTypes.tlPinchstart;
    // if currList.length > 1 and list changed, emit
    if (this.listenOn(type) && activeTouchIdentifiers.curr.length > 1 && firstTwoActiveTouchIdentifiersChanged) {
      this[type].emit({
        identifier,
        target: startEvent.event.target,
        time: startEvent.time,
        type,
        twoPointerData: {
          distanceBetweenPointersPrev: twoPointerData.distanceBetweenPointersPrev,
          distanceBetweenPointersCurr: twoPointerData.distanceBetweenPointersCurr,
          distanceBetweenPointersChange: twoPointerData.distanceBetweenPointersChange
        }
      });
    }



    type = tlGestureEventTypes.tlPinchend;
    if (this.listenOn(type) && (activeTouchIdentifiers.prev.length >= 2 ? firstTwoActiveTouchIdentifiersChanged : false)) {
      this[type].emit({
        identifier,
        target: startEvent.event.target,
        time: endEvent ? endEvent.time : (moveEventCurr ? moveEventCurr.time : startEvent.time),
        type,
        twoPointerData: {
          distanceBetweenPointersPrev: twoPointerData.distanceBetweenPointersPrev,
          distanceBetweenPointersCurr: twoPointerData.distanceBetweenPointersCurr,
          distanceBetweenPointersChange: twoPointerData.distanceBetweenPointersChange
        }
      });
    }

    type = tlGestureEventTypes.tlPinchchange;
    if (this.listenOn(type) && twoPointerData.distanceBetweenPointersChange !== null) {
      this[type].emit({
        identifier,
        target: startEvent.event.target,
        time: moveEventCurr ? moveEventCurr.time : pressEvent.time, // when press, also recal distanceBetweenPointersChange
        type,
        twoPointerData: {
          distanceBetweenPointersPrev: twoPointerData.distanceBetweenPointersPrev,
          distanceBetweenPointersCurr: twoPointerData.distanceBetweenPointersCurr,
          distanceBetweenPointersChange: twoPointerData.distanceBetweenPointersChange
        }
      });
    }


    type = tlGestureEventTypes.tlRotatestart;
    if (this.listenOn(type) && activeTouchIdentifiers.curr.length > 1 && firstTwoActiveTouchIdentifiersChanged) {
      this[type].emit({
        identifier,
        target: startEvent.event.target,
        time: startEvent.time,
        type,
        twoPointerData: {
          anglePrev: twoPointerData.anglePrev,
          angleCurr: twoPointerData.angleCurr,
          angleChange: twoPointerData.angleChange
        }
      });
    }

    type = tlGestureEventTypes.tlRotateend;
    if (this.listenOn(type) && (activeTouchIdentifiers.prev.length >= 2 ? firstTwoActiveTouchIdentifiersChanged : false)) {
      this[type].emit({
        identifier,
        target: startEvent.event.target,
        time: endEvent.time,
        type,
        twoPointerData: {
          anglePrev: twoPointerData.anglePrev,
          angleCurr: twoPointerData.angleCurr,
          angleChange: twoPointerData.angleChange
        }
      });
    }

    type = tlGestureEventTypes.tlRotatechange;
    if (this.listenOn(type) && twoPointerData.angleChange !== null) {
      this[type].emit({
        identifier,
        target: startEvent.event.target,
        time: moveEventCurr ? moveEventCurr.time : pressEvent.time, // when press, also recal distanceBetweenPointersChange
        type,
        twoPointerData: {
          anglePrev: twoPointerData.anglePrev,
          angleCurr: twoPointerData.angleCurr,
          angleChange: twoPointerData.angleChange
        }
      });
    }


  }



  listenOn(gestureEventType: string) {
    // console.log(gestureEventType);
    return !!this[gestureEventType].observers.length;
  }

  calNewSMPEData(oldSMPEData: SMPEData, currSNC: StartNonStartCombo) {
    // console.log('inside calNewSMPEData');
    const latestIdentifier = currSNC.startEvent.identifier;
    const oldSMPE4SinglePointer: SMPE4SinglePointer = oldSMPEData.smpeCombosMap.get(latestIdentifier);
    const newSMPE4SinglePointer: SMPE4SinglePointer = this.calNewSMPE4SinglePointer(oldSMPE4SinglePointer, currSNC);
    oldSMPEData.latestIdentifier = latestIdentifier;
    oldSMPEData.smpeCombosMap.set(latestIdentifier, newSMPE4SinglePointer);
    // by now, latestIdentifier and smpeCombosMap are both up-to-date, that is, currSNC info are contained in oldSMPEData.

    oldSMPEData.activeTouchIdentifiers = this.calNewActiveTouchIdentifiers(oldSMPEData);

    oldSMPEData.singlePointerData = this.calSinglePointerData(oldSMPEData, currSNC); // need refactor: currSNC info already in oldSMPEData
    oldSMPEData.twoPointerData = this.calTwoPointerData(oldSMPEData);
    return oldSMPEData; // return oldSMPEData for the moment, need to construct a newSMPEData actually
  }

  calNewActiveTouchIdentifiers(smpe: SMPEData) {
    const newCurrList = [...smpe.activeTouchIdentifiers.curr];
    if (smpe.latestIdentifier > -1) { // if it's a touch
      const smpe4SinglePointer = smpe.smpeCombosMap.get(smpe.latestIdentifier)
      switch (true) {
        case smpe4SinglePointer.moveEventCurr === null && smpe4SinglePointer.endEvent === null: // fresh start
          newCurrList.push(smpe.latestIdentifier);
          break;
        case !!smpe4SinglePointer.endEvent: // ended
          const index = newCurrList.indexOf(smpe.latestIdentifier);
          newCurrList.splice(index, 1);
      }
    }
    return {
      prev: smpe.activeTouchIdentifiers.curr,
      curr: newCurrList
    };
  }

  calTwoPointerData(smpeData: SMPEData) {
    let newTwoPointerData = {};
    const listeningOnTwoPointers = this.listenOn(tlGestureEventTypes.tlPinchstart) ||
      this.listenOn(tlGestureEventTypes.tlPinchchange) ||
      this.listenOn(tlGestureEventTypes.tlPinchend) ||
      this.listenOn(tlGestureEventTypes.tlRotatestart) ||
      this.listenOn(tlGestureEventTypes.tlRotatechange) ||
      this.listenOn(tlGestureEventTypes.tlRotateend);
      
    if (smpeData.latestIdentifier === -1 || !listeningOnTwoPointers) {
      return newTwoPointerData;
    }

    const currList = smpeData.activeTouchIdentifiers.curr;
    const prevList = smpeData.activeTouchIdentifiers.prev;

    const firstTwoTouchesChanged = (prevList[0] !== currList[0]) || (prevList[1] !== currList[1]);

    const calCoordinates = (smpeMap: Map<number, SMPE4SinglePointer>, currActiveTouchIdentifiers: number[]) => {
      const firstSMPECombo = smpeMap.get(currActiveTouchIdentifiers[0]);
      const secondSMPECombo = smpeMap.get(currActiveTouchIdentifiers[1]);
      let pageX0: number, pageY0: number, pageX1: number, pageY1: number;
      if (firstSMPECombo.moveEventCurr) {
        pageX0 = (firstSMPECombo.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
        pageY0 = (firstSMPECombo.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
      } else {
        pageX0 = (firstSMPECombo.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
        pageY0 = (firstSMPECombo.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
      }
      if (secondSMPECombo.moveEventCurr) {
        pageX1 = (secondSMPECombo.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
        pageY1 = (secondSMPECombo.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
      } else {
        pageX1 = (secondSMPECombo.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
        pageY1 = (secondSMPECombo.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
      }
      return {
        0: {x: pageX0, y: pageY0},
        1: {x: pageX1, y: pageY1}
      };
    };


    const calNewDistanceCurr = (smpeMap: Map<number, SMPE4SinglePointer>, currActiveTouchIdentifiers: number[]) => {
      let newDistanceCurr = null;
      if (currActiveTouchIdentifiers.length > 1) {
        const newCoordinates = calCoordinates(smpeMap, currActiveTouchIdentifiers);
        newDistanceCurr = Math.sqrt(Math.pow(newCoordinates['0'].x - newCoordinates['1'].x, 2) + 
          Math.pow(newCoordinates['0'].y - newCoordinates['1'].y, 2));
      }
      return newDistanceCurr;
    };

    const newDistanceCurr = calNewDistanceCurr(smpeData.smpeCombosMap, currList);
    const newDistancePrev = smpeData.twoPointerData.distanceBetweenPointersCurr;
    const newDistanceChange = firstTwoTouchesChanged ? null : 
      ((newDistanceCurr === null || newDistancePrev === null) ? null : Math.abs(newDistanceCurr - newDistancePrev));

    const calNewAngleCurr = (smpeMap: Map<number, SMPE4SinglePointer>, currActiveTouchIdentifiers: number[]) => {
      let newAngleCurr = null;
      if (currActiveTouchIdentifiers.length > 1) {
        const newCoordinates = calCoordinates(smpeMap, currActiveTouchIdentifiers);
        newAngleCurr = Math.atan((newCoordinates[1].y - newCoordinates[0].y) / (newCoordinates[1].x - newCoordinates[0].x));
      }
      return newAngleCurr;
    };


    const newAngleCurr = calNewAngleCurr(smpeData.smpeCombosMap, currList);
    const newAnglePrev = smpeData.twoPointerData.angleCurr;
    const newAngleChange = firstTwoTouchesChanged ? null : 
      ((newAngleCurr === null || newAnglePrev === null) ? null : (newAngleCurr - newAnglePrev));

    newTwoPointerData = {
      distanceBetweenPointersPrev: newDistancePrev,
      distanceBetweenPointersCurr: newDistanceCurr,
      distanceBetweenPointersChange: newDistanceChange,
      anglePrev: newAnglePrev,
      angleCurr: newAngleCurr,
      angleChange: newAngleChange,
    }

    return newTwoPointerData;
  }

  calSinglePointerData(smpeData: SMPEData, currSNC: StartNonStartCombo) {
    const oldSinglePointerData = smpeData.singlePointerData;

    // to delete
    // const calOffsetFromStart = (snc: StartNonStartCombo) => {
    //   if (snc.nonStartEvent && snc.nonStartEvent.event.type !== baseEventTypes.possiblePress) {
    //     let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
    //     switch (snc.startEvent.identifier) {
    //       case -1: // mouse event
    //         currPageX = (snc.nonStartEvent.event as MouseEvent).pageX;
    //         currPageY = (snc.nonStartEvent.event as MouseEvent).pageY;
    //         prevPageX = (snc.startEvent.event as MouseEvent).pageX;
    //         prevPageY = (snc.startEvent.event as MouseEvent).pageY;
    //         break;
    //       default: // touch event
    //         currPageX = (snc.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageX;
    //         currPageY = (snc.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageY;
    //         prevPageX = (snc.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
    //         prevPageY = (snc.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
    //     }
    //     return {x: currPageX - prevPageX, y: currPageY - prevPageY};
    //   }
    // };

    const calOffsetFromStart2 = (smpe4SinglePointer: SMPE4SinglePointer) => {
      let newOffsetFromStart = null;
      const startEvent = smpe4SinglePointer.startEvent;
      const nonStartEvent = smpe4SinglePointer.endEvent || smpe4SinglePointer.moveEventCurr;
      if (nonStartEvent) {
        let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
        switch (smpe4SinglePointer.identifier) {
          case -1: // mouse event
            currPageX = (nonStartEvent.event as MouseEvent).pageX;
            currPageY = (nonStartEvent.event as MouseEvent).pageY;
            prevPageX = (startEvent.event as MouseEvent).pageX;
            prevPageY = (startEvent.event as MouseEvent).pageY;
            break;
          default: // touch event
            currPageX = (nonStartEvent.event as TouchEvent).changedTouches.item(0).pageX;
            currPageY = (nonStartEvent.event as TouchEvent).changedTouches.item(0).pageY;
            prevPageX = (startEvent.event as TouchEvent).changedTouches.item(0).pageX;
            prevPageY = (startEvent.event as TouchEvent).changedTouches.item(0).pageY;
        }
        return {x: currPageX - prevPageX, y: currPageY - prevPageY};
      }
    };

    /**
     * to be replaced by isShortTap2
     */
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

    const isShortTap2 = (smpe4SinglePointer: SMPE4SinglePointer) => {
      let isShortTap = false;
      const {startEvent, endEvent} = smpe4SinglePointer;
      if (endEvent) {
        const isShortInterval = endEvent.time - startEvent.time <= this.options.shortTapStartEndInterval;
        if (isShortInterval) {
          isShortTap = true;
        }
      }
      return isShortTap;
    }

    const calNewLatestShortTaps = (smpeData: SMPEData, snc: StartNonStartCombo) => {
      const oldLatestShortTaps = smpeData.singlePointerData.latestShortTaps;
      const smpe4SinglePointer = smpeData.smpeCombosMap.get(smpeData.latestIdentifier);
      let newLatestShortTaps;
      if (smpe4SinglePointer.endEvent && isShortTap2(smpe4SinglePointer)) { // if current event is an endEvent and it's a shorttap
        const newShortTap = {
          identifier: smpe4SinglePointer.identifier,
          target: smpe4SinglePointer.endEvent.event.target,
          time: smpe4SinglePointer.endEvent.time
        };
        switch (!!oldLatestShortTaps.prev) {
          case true: // if there are already two shortTaps recorded, reset
            newLatestShortTaps = {
              prev: null,
              curr: newShortTap
            };
            break;
          default: // if there's only a currShortTap recored, add in the new currShortTap
            newLatestShortTaps = {
              prev: oldLatestShortTaps.curr,
              curr: newShortTap
            };
        }
      } else {
        newLatestShortTaps = Object.assign({}, oldLatestShortTaps);
      }
      return newLatestShortTaps;
    };


    const calNewMovement = (smpe4SinglePointer: SMPE4SinglePointer) => {
      const {identifier, startEvent, moveEventCurr, moveEventPrev, endEvent} = smpe4SinglePointer;
      let newMovement;
      switch (true) {
        case !!endEvent: // smpeCombo ended
          newMovement = null;
          break;
        case !!moveEventCurr: // smpedCombo not ended and moved
          let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
          switch (identifier) {
            case -1: // mouse event
              currPageX = (moveEventCurr.event as MouseEvent).pageX;
              currPageY = (moveEventCurr.event as MouseEvent).pageY;
              prevPageX = (((moveEventPrev && moveEventPrev.event) || startEvent.event) as MouseEvent).pageX;
              prevPageY = (((moveEventPrev && moveEventPrev.event) || startEvent.event) as MouseEvent).pageY;
              break;
            default: // touch event
              currPageX = (moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
              currPageY = (moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
              prevPageX = (((moveEventPrev && moveEventPrev.event) || startEvent.event) as TouchEvent).changedTouches.item(0).pageX;
              prevPageY = (((moveEventPrev && moveEventPrev.event) || startEvent.event) as TouchEvent).changedTouches.item(0).pageY;
          }
          newMovement = {x: currPageX - prevPageX, y: currPageY - prevPageY};
          break;
        default: // smpedCombo only started
          newMovement = null;
      }
      // console.log(newMovement);
      return newMovement;
    }

    return {
      latestShortTaps: calNewLatestShortTaps(smpeData, currSNC),
      // offsetFromStartPoint: calOffsetFromStart(currSNC),
      offsetFromStartPoint: calOffsetFromStart2(smpeData.smpeCombosMap.get(smpeData.latestIdentifier)),
      movement: calNewMovement(smpeData.smpeCombosMap.get(smpeData.latestIdentifier))
    };
  }


  /**
   * calculate newSMPE4SinglePointer based on oldSMPE4SinglePointer and current StartNonStartCombo
   */
  calNewSMPE4SinglePointer(oldSMPE4SinglePointer: SMPE4SinglePointer, currSNC: StartNonStartCombo) {
    // console.log('inside calNewSMPE4SinglePointer');
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
        currType = baseEventTypes.press;
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
        case baseEventTypes.mouse.move:
        case baseEventTypes.touch.move:
          return onMove(currSNC, oldSMPE4SinglePointer);
        case baseEventTypes.mouse.end:
        case baseEventTypes.touch.end:
          return onEnd(currSNC, oldSMPE4SinglePointer);
        case baseEventTypes.possiblePress:
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

    const mouseRxFac = (eventType: mousemoveOrEnd): Observable<EventIT> => {
      return Observable.fromEvent(rootElement, eventType)
        .map((e: Event) => ({event: e, identifier: -1, time: Date.now()}));
    };

    const possiblePressRxFac = (identifier: number): Observable<EventIT> => {
      return Observable.interval(tlGestures3Directive.options.pressInterval).take(1)
        .map(() => ({event: {type: baseEventTypes.possiblePress, target: null}, identifier, time: Date.now()}));
        // event.target of possiblePress will always be null, the target of moveEvent (if any) in SMPE4SinglePointer matters
    };

    const touchRxFac = (eventType: touchmoveOrEnd, identifier: number): Observable<EventIT> => {
      return Observable.fromEvent(rootElement, eventType)
        .filter((event: TouchEvent) => {
          // take this nonStartEvent only when it has the same identifier as startEvent.identifier
          return event.changedTouches.item(0).identifier === identifier;
        })
        .map((e: Event) => ({event: e, identifier, time: Date.now()}));
    };

    switch (startEvent.event.type) {
      case baseEventTypes.mouse.start:
        // 'mousedown' flow: \
        // at the beginning, emit {s: mousedown, e: null}
        // then, emit {s: mousedown, e: (mousemove * (0 or n) -> possiblePress * (0 or 1)) -> mouseup}
        return mouseRxFac(baseEventTypes.mouse.move)
          .merge(possiblePressRxFac(-1))
          .takeUntil(mouseRxFac(baseEventTypes.mouse.end))
          .merge(mouseRxFac(baseEventTypes.mouse.end).take(1))
          .startWith(null);
      case baseEventTypes.touch.start:
        const identifier = (startEvent.event as TouchEvent).changedTouches.item(0).identifier;
        return touchRxFac(baseEventTypes.touch.move, identifier)
          .merge(possiblePressRxFac(identifier))
          .takeUntil(touchRxFac(baseEventTypes.touch.end, identifier).take(1))
          .merge(touchRxFac(baseEventTypes.touch.end, identifier).take(1))
          .startWith(null);
    }
  }


}
