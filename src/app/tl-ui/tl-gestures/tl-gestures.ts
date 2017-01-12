export interface TlGesturesConfig {

}

export interface TlGesturesEventCombo {
  event: Event;
  customEvent?: {
    type?: string;
    target?: string | EventTarget;
  };
}

type TAP = 'tap';
type SWIPE_LEFT = 'swipeleft';
type SWIPE_RIGHT = 'swiperight';
type DRAG = 'drag';
type PINCH_IN = 'pinchin';
type PINCH_OUT = 'pinchout';

export type TlGestureEventType = TAP | SWIPE_LEFT | SWIPE_RIGHT | DRAG | PINCH_IN | PINCH_OUT;

interface GestureEventTypesHolder {
  tap: TAP;
  swipeleft: SWIPE_LEFT;
  swiperight: SWIPE_RIGHT;
  drag: DRAG;
  pinchin: PINCH_IN;
  pinchout: PINCH_OUT;
};

export const TlGestureEventTypes: GestureEventTypesHolder = {
  tap: 'tap',
  swipeleft: 'swipeleft',
  swiperight: 'swiperight',
  drag: 'drag',
  pinchin: 'pinchin',
  pinchout: 'pinchout'
};

export class TlGestureEvent {
  constructor(
    public startEvent: Event,
    public endEvent: Event,
    public timeDiff: number,
    public distDiff: number,
    public xDiff: number,
    public yDiff: number,
    public type: TlGestureEventType,
    public extras?: {}
  ) {}
}


export const mouseEvents = {
  start: 'mousedown', end: 'mouseup',
  move: 'mousemove', cancel: 'mouseleave',
  wheel: 'wheel', mousewheel: 'mousewheel',
};

export const touchEvents = {
  start: 'touchstart', end: 'touchend',
  move: 'touchmove', cancel: 'touchcancel'
};




/*

Gesture Events
https://github.com/hammerjs/hammer.js/wiki/Getting-Started#gesture-events

The following events are triggered;

hold
tap
doubletap
drag, dragstart, dragend, dragup, dragdown, dragleft, dragright
swipe, swipeup, swipedown, swipeleft, swiperight
transform, transformstart, transformend
rotate
pinch, pinchin, pinchout
touch
release
gesture

*/

