
export const tlGestureEventTypes = {
  tlTap: 'tlTap',
  tlDblTap: 'tlDblTap',
  tlPress: 'tlPress',
  tlPan: 'tlPan',
  tlPinch: 'tlPinch',
  tlRotate: 'tlRotate',
  tlSwipe: 'tlSwipe'
}

export type Identifier = number;

export interface EventIT {
  event: Event | {type: string; target: EventTarget};
  identifier: Identifier | Identifier[];
  time: number;
}

export interface StartNonStartCombo {
  startEvent: EventIT;
  nonStartEvent: EventIT;
}

export class SMPECombo {
  constructor(
    public identifier: Identifier | Identifier[],
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
  smpeCombosMap: Map<Identifier | Identifier[], SMPEComboPrevCurr>;
  sCM: Map<Identifier | Identifier[], SMPECombo>;
  latestIdentifier: Identifier | Identifier[];
  activeTouchIdentifiers: (Identifier | Identifier[])[];
  firstTwoActiveTouchesDistance: {identifiers: Identifier[]; distancePrev: number; distanceCurr: number; distanceDiff: number;}
  lastShortTaps: {prev: TlGestureEvent; curr: TlGestureEvent};
}

export interface TlGestureEvent {
  identifier: Identifier | Identifier[];
  target: EventTarget;
  time: number;
  type: string;
  distance?: {x: number, y: number},
  duration?: number;
  movement?: {x: number, y: number},
}