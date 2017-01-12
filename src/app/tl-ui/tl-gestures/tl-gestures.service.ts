import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { mouseEvents, touchEvents, gestures, TlGesturesEventCombo } from './tl-gestures';

@Injectable()
export class TlGesturesService {
  private _gestureEventRxx: Subject<TlGesturesEventCombo> = new Subject();

  constructor() {}
  get gestureEventRxx() {
    return this._gestureEventRxx;
  }

  listenerFac(startEvent: Event, endEventType: string, targetAlias?: string) {
    const endListener = (endEvent: Event) => {
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
      const distDiff = Math.sqrt(
        Math.pow(startCoordinateHolder.pageX - endCoordinateHolder.pageX, 2) +
          Math.pow(startCoordinateHolder.pageY - endCoordinateHolder.pageY, 2)
      );
      // calculate timeDiff
      const timeDiff = endEvent.timeStamp - startEvent.timeStamp;

      // console.log(timeDiff, distDiff);
      switch (true) {
        case timeDiff < 400 && distDiff < 15:
          // console.log('could be tap');
          this._gestureEventRxx.next({
            event: endEvent, customEvent: {type: gestures.tap, target: targetAlias || startEvent.target}
          });
          break;
      }

      startEvent.target.removeEventListener(endEventType, endListener);
    };
    return endListener;
  }


  startBy(startEvent: Event, targetAlias?: string) {
    // console.log(event);
    // startEvent.preventDefault();
    let endEventType;
    switch (startEvent.type) {
      case 'click': // mouse click is considered equivalent as tap
        this._gestureEventRxx.next({
          event: startEvent, customEvent: {type: gestures.tap, target: targetAlias || startEvent.target}
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
