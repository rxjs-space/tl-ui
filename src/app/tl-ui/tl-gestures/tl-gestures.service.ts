import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { mouseEvents, touchEvents,
  TlGestureEventTypes, TlGesturesEventCombo, TlGestureEvent,
  TlGestureEventType
} from './tl-gestures';

@Injectable()
export class TlGesturesService {
  private _gestureEventRxx: Subject<TlGestureEvent> = new Subject();

  constructor() {}
  get gestureEventRxx() {
    return this._gestureEventRxx;
  }

  listenerFac(startEvent: Event, endEventType: string, targetAlias?: string) {
    const endListener = (endEvent: Event) => {
      endEvent.preventDefault();
      // calculate distDiff
      let startCoordinateHolder, endCoordinateHolder;
      switch (true) {
        case startEvent instanceof TouchEvent:
          startCoordinateHolder = (<TouchEvent>startEvent).changedTouches[0];
          endCoordinateHolder = (<TouchEvent>endEvent).changedTouches[0];
          break;
        case startEvent instanceof MouseEvent:
          startCoordinateHolder = startEvent;
          endCoordinateHolder = endEvent;
      }
      const xDiff = endCoordinateHolder.pageX - startCoordinateHolder.pageX;
      const yDiff = endCoordinateHolder.pageY - startCoordinateHolder.pageY;
      const distDiff = Math.sqrt(
        Math.pow(xDiff, 2) +
          Math.pow(yDiff, 2)
      );


      // calculate timeDiff
      const timeDiff = endEvent.timeStamp - startEvent.timeStamp;

      const target = targetAlias || startEvent.target;

      // decide the gestureType
      let gestureType: TlGestureEventType;
      switch (true) {
        case timeDiff < 400 && distDiff < 15:
          gestureType = TlGestureEventTypes.tap;
          break;
        case timeDiff < 400 && xDiff < -100:
          gestureType = TlGestureEventTypes.swipeleft;
          break;
        case timeDiff < 400 && xDiff > 100:
          gestureType = TlGestureEventTypes.swiperight;
          break;
      }

      // emit gestureEvent
      const gestureEvent: TlGestureEvent = new TlGestureEvent(
        startEvent, endEvent, timeDiff, distDiff, xDiff, yDiff,
        gestureType, {target}
      );
      this._gestureEventRxx.next(gestureEvent);

      // remove endEvent eventListener
      startEvent.target.removeEventListener(endEventType, endListener);
    };
    return endListener;
  }


  startBy(startEvent: Event, targetAlias?: string) {
    // console.log(event);
    startEvent.preventDefault();
    let endEventType;
    switch (startEvent.type) {
      case 'click': // mouse click is considered equivalent as tap
        const target = targetAlias || startEvent.target;
        const gestureEvent: TlGestureEvent = new TlGestureEvent(
          startEvent, startEvent, 0, 0, 0, 0,
          TlGestureEventTypes.tap, {target}
        );
        this._gestureEventRxx.next(gestureEvent);
        return;
      case touchEvents.start:
        endEventType = touchEvents.end;
        break;
      case mouseEvents.start:
        endEventType = mouseEvents.end;
        break;
      default:

    }
    startEvent.target.addEventListener(
      endEventType,
      this.listenerFac(startEvent, endEventType, targetAlias)
    );
  }


}
