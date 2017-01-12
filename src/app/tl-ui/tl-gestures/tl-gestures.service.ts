import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { mouseEvents, touchEvents, TlGestureEventTypes, TlGesturesEventCombo } from './tl-gestures';

@Injectable()
export class TlGesturesService {
  private _gestureEventRxx: Subject<TlGesturesEventCombo> = new Subject();

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
      const distDiffX = endCoordinateHolder.pageX - startCoordinateHolder.pageX;
      const distDiffY = endCoordinateHolder.pageY - startCoordinateHolder.pageY;
      const distDiff = Math.sqrt(
        Math.pow(distDiffX, 2) +
          Math.pow(distDiffY, 2)
      );


      // calculate timeDiff
      const timeDiff = endEvent.timeStamp - startEvent.timeStamp;

      const target = targetAlias || startEvent.target;
      // console.log(timeDiff, distDiff);
      switch (true) {
        case timeDiff < 400 && distDiff < 15:
          // console.log('could be tap');
          this.emitGestureEvent(endEvent, TlGestureEventTypes.tap, target);
          break;
        case timeDiff < 400 && distDiffX < -100:
          this.emitGestureEvent(endEvent, TlGestureEventTypes.swipeleft, target);
          break;
        case timeDiff < 400 && distDiffX > 100:
          this.emitGestureEvent(endEvent, TlGestureEventTypes.swiperight, target);
          break;
      }

      startEvent.target.removeEventListener(endEventType, endListener);
    };
    return endListener;
  }

  emitGestureEvent(endEvent, type, target) {
    this._gestureEventRxx.next({
      event: endEvent, customEvent: {type, target}
    });
  }

  startBy(startEvent: Event, targetAlias?: string) {
    // console.log(event);
    startEvent.preventDefault();
    let endEventType;
    switch (startEvent.type) {
      case 'click': // mouse click is considered equivalent as tap
        this._gestureEventRxx.next({
          event: startEvent, customEvent: {type: TlGestureEventTypes.tap, target: targetAlias || startEvent.target}
        });
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
