


/**
 * (copied from 'rxjs\src\util\root.ts')
 * window: browser in DOM main thread
 * self: browser in WebWorker
 * global: Node.js/other
 */
export const rootElement: any = (
     typeof window === 'object' && window.window === window && window
  || typeof self === 'object' && self.self === self && self
  || typeof global === 'object' && global.global === global && global
);

if (!rootElement) {
  throw new Error('RxJS could not find any global context (window, self, global)');
}



export const tlGestureEventTypes = {
  tlTap: 'tlTap',
  tlDblTap: 'tlDblTap',
  tlPress: 'tlPress',
  tlPan: 'tlPan',
  tlPinch: 'tlPinch',
  tlRotate: 'tlRotate',
  tlSwipe: 'tlSwipe'
}

export interface EventIT {
  event: Event;
  identifier: number;
  time: number;
}

export interface StartNonStartCombo {
  startEvent: EventIT;
  nonStartEvent: EventIT;
}

export class SMPECombo {
  constructor(
    public identifier: number,
    public startEvent: EventIT,
    public moveEventPrev: EventIT,
    public moveEventCurr: EventIT,
    public possiblePressEvent: EventIT,
    public pressEvent: EventIT,
    public endEvent: EventIT,
    public latestEventType: string,
    public duration: number,
    public movement: {x: number, y: number}
  ) {}
}

export interface SMPEComboPrevCurr {
  prev: SMPECombo;
  curr: SMPECombo;
}

export type Identifier = number;

export interface SMPEData {
  smpeCombosMap: Map<Identifier, SMPEComboPrevCurr>;
  latestIdentifier: Identifier;
  firstActiveIdentifier: Identifier;
  secondActiveIdentifier: Identifier;
  lastShortTap: TlGestureEvent;
}

export interface TlGestureEvent {
  identifier: number;
  target: EventTarget;
  time: number;
  type: string;
  distance?: {x: number, y: number},
  duration?: number;
  movement?: {x: number, y: number},
}