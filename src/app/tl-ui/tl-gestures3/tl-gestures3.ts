
export const baseEventTypes = {
  mousedown: 'mousedown',
  mousemove: 'mousemove',
  mouseup: 'mouseup',
  touchstart: 'touchstart',
  touchmove: 'touchmove',
  touchend: 'touchend',
  touchcancel: 'touchcancel',
};

export const tlGestureEventTypes = {
  tap: 'tap',
  shorttap: 'shorttap',
  dbltap: 'dbltap',
  press: 'press',
  pan: 'pan',
  pinch: 'pinch',
  rotate: 'rotate',
  swipe: 'swipe'
};

export interface EventIT {
  event: Event | {type: string; target: EventTarget};
  identifier: number;
  time: number;
}

export interface TlGestureEvent {
  identifier: number | number[];
  target: EventTarget;
  time: number;
  type: string; // should be string contained in tlGestureEventTypes only
  duration: number;
  singlePointerData?: {
    distanceToStartPoint?: {x: number; y: number; };
    movement?: {x: number, y: number; }
  };
  twoPointerData?: {
    distanceBetweenPointersChange?: number;
    angleChange?: number;
  };
}