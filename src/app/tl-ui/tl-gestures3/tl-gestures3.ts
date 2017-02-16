
export const baseEventTypes = {
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    end: 'mouseup',
    // cancel: 'mouseout' // ?
  },
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend',
    cancel: 'touchcancel'
  },
  // pointer: { // add support for ie/edge

  // }
};

export const tlGestureEventTypes = {
  tlTap: 'tlTap',
  tlShorttap: 'tlShorttap',
  tlDbltap: 'tlDbltap',
  tlPanstart: 'tlPanstart',
  tlPanmove: 'tlPanmove',
  tlPanend: 'tlPanend',
  tlPinchstart: 'tlPinstart',
  tlPinchmove: 'tlPinchmove',
  tlPinchend: 'tlPinchend',
  tlPress: 'tlPress',
  tlRotatestart: 'tlRotatestart',
  tlRotatemove: 'tlRotatemove',
  tlRotateend: 'tlRotateend',
  tlSwipe: 'tlSwipe'
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
    distanceFromStartPoint?: {x: number; y: number; };
    movement?: {x: number, y: number; }
  };
  twoPointerData?: {
    distanceBetweenPointersChange?: number;
    angleChange?: number;
  };
}

export interface StartNonStartCombo {
  startEvent: EventIT;
  nonStartEvent: EventIT;
}

/**
 * SMPE is start + move + press + end
 */
export class SMPE4SinglePointer {
  constructor(
    public identifier: number,
    public startEvent: EventIT,
    public moveEventPrev: EventIT,
    public moveEventCurr: EventIT,
    public possiblePressEvent: EventIT,
    public pressEvent: EventIT,
    public endEvent: EventIT,
    public latestEventType: string,
  ) {}
}


export interface SMPEData {
  SMPECombosMap: Map<number, SMPE4SinglePointer>;
  latestIdentifier: number;
  singlePointerData: {
    lastShortTap?: TlGestureEvent;
    distanceFromStartPoint?: {x: number; y: number; };
    movement?: {x: number, y: number; }
  };
  twoPointerData: {
    activeTouchIdentifiers: number[];
    distanceBetweenPointersPrev?: number;
    distanceBetweenPointersCurr?: number;
    distanceBetweenPointersChange?: number;
    anglePrev?: number;
    anguleCurr?: number;
    angleChange?: number;
  };
}

export interface TlGestureEvent {
  identifier: number | number[];
  target: EventTarget;
  time: number;
  type: string; // should be string contained in tlGestureEventTypes only
  duration: number;
  singlePointerData?: {
    distanceFromStartPoint?: {x: number; y: number; };
    movement?: {x: number, y: number; }
  };
  twoPointerData?: {
    distanceBetweenPointersChange?: number;
    angleChange?: number;
  };
}