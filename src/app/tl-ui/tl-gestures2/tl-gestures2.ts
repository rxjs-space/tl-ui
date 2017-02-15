
export const tlGestureEventTypes = {
  tlTap: 'tlTap',
  tlDblTap: 'tlDblTap',
  tlPress: 'tlPress',
  tlPan: 'tlPan',
  tlPinch: 'tlPinch',
  tlRotate: 'tlRotate',
  tlSwipe: 'tlSwipe'
}

export type Identifier = number | number[];

export interface EventIT {
  event: Event;
  identifier: Identifier;
  time: number;
}

export interface StartNonStartCombo {
  startEvent: EventIT;
  nonStartEvent: EventIT;
}

export class SMPECombo {
  constructor(
    public identifier: Identifier,
    public startEvent: EventIT,
    public moveEventPrev: EventIT,
    public moveEventCurr: EventIT,
    public possiblePressEvent: EventIT,
    public pressEvent: EventIT,
    public endEvent: EventIT,
    public latestEventType: string,
    public duration: number,
    public movement: {x: number, y: number},
    public distance: {x: number, y: number}
  ) {}
}

export interface SMPEComboPrevCurr {
  prev: SMPECombo;
  curr: SMPECombo;
}


export interface SMPEData {
  smpeCombosMap: Map<Identifier, SMPEComboPrevCurr>;
  latestIdentifier: Identifier;
  activeTouchIdentifiers: Identifier[];
  lastShortTaps: {prev: TlGestureEvent; curr: TlGestureEvent};
}

export interface TlGestureEvent {
  identifier: Identifier;
  target: EventTarget;
  time: number;
  type: string;
  distance?: {x: number, y: number},
  duration?: number;
  movement?: {x: number, y: number},
}