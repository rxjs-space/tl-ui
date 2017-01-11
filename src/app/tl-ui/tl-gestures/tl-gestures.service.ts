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

  processorFac(startEvent: Event, targetAlias?: string) {
    const endListener = (endEvent: Event) => {
      // console.log(endEvent);
      const startingTouch = (<any>startEvent).changedTouches[0];
      const endingTouch = (<any>endEvent).changedTouches[0];
      const timeDiff = endEvent.timeStamp - startEvent.timeStamp;
      const distDiff = Math.sqrt(
        Math.pow(endingTouch.pageX - startingTouch.pageX, 2) + Math.pow(endingTouch.pageY - startingTouch.pageY, 2)
      );
      // console.log(timeDiff, distDiff);
      switch (true) {
        case timeDiff < 400 && distDiff < 15:
          // console.log('could be tap');
          this._gestureEventRxx.next({
            event: endEvent, customEvent: {type: gestures.tap, target: targetAlias || event.target}
          });
          break;
      }

      event.target.removeEventListener(touchEvents.end, endListener);
    };
    return endListener;
  }

  startBy(event: Event, targetAlias?: string) {
    // console.log(event);
    switch (true) {
      case event.type === touchEvents.start:
        // const endListener = this.processorFac(event, endListener)
        event.target.addEventListener(touchEvents.end, this.processorFac(event, targetAlias));
        break;
      case event.type === mouseEvents.start:
        break;
      default:

    }
    // this._gestureEventRxx.next({event});
  }


}
