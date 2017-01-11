export interface TlGesturesConfig {

}

export interface TlGesturesEventCombo {
  event: Event;
  customEvent?: {
    type?: string;
    target?: string | EventTarget;
  };
}

export const gestures = {
  tap: 'tap',
  swipeleft: 'swipeleft',
  swiperight: 'swiperight',
  drag: 'drag'
};

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

