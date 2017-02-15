import { rootElement, tlGestureEventTypes, EventIT, Identifier,
  StartNonStartCombo, SMPECombo, SMPEComboPrevCurr, SMPEData, TlGestureEvent
} from './tl-gestures2';

export const smpeOnStartFac = (oldSmpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
  // always return new SMPECombo when curr.nonStartEvent === null
  return new SMPECombo(
    curr.startEvent.identifier,
    curr.startEvent,
    null,
    null,
    null,
    null,
    null,
    curr.startEvent.event.type,
    null,
    null
  );
};

export const calMovement = (oldSmpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
  let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
  switch (oldSmpeComboPrevCurr.curr.startEvent.identifier) {
    case -1: // mouse event
      currPageX = (curr.nonStartEvent.event as MouseEvent).pageX;
      currPageY = (curr.nonStartEvent.event as MouseEvent).pageY;
      switch (!!oldSmpeComboPrevCurr.curr.moveEventCurr) {
        case true: // moved before
          prevPageX = (oldSmpeComboPrevCurr.curr.moveEventCurr.event as MouseEvent).pageX;
          prevPageY = (oldSmpeComboPrevCurr.curr.moveEventCurr.event as MouseEvent).pageY;
          break;
        case false: // not moved before
          prevPageX = (oldSmpeComboPrevCurr.curr.startEvent.event as MouseEvent).pageX;
          prevPageY = (oldSmpeComboPrevCurr.curr.startEvent.event as MouseEvent).pageY;
          break;
      }
      break;
    default: // touch event
      currPageX = (curr.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageX;
      currPageY = (curr.nonStartEvent.event as TouchEvent).changedTouches.item(0).pageY;
      switch (!!oldSmpeComboPrevCurr.curr.moveEventCurr) {
        case true: // moved before
          prevPageX = (oldSmpeComboPrevCurr.curr.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
          prevPageY = (oldSmpeComboPrevCurr.curr.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
          break;
        case false: // not moved before
          prevPageX = (oldSmpeComboPrevCurr.curr.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
          prevPageY = (oldSmpeComboPrevCurr.curr.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
          break;
      }
  }
  return {x: currPageX - prevPageX, y: currPageY - prevPageY}
}

export const smpeOnMoveFac = (oldSmpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
  const currMoveEvent = curr.nonStartEvent;
  const movement = calMovement(oldSmpeComboPrevCurr, curr);
  return new SMPECombo(
    oldSmpeComboPrevCurr.curr.identifier,
    oldSmpeComboPrevCurr.curr.startEvent,
    oldSmpeComboPrevCurr.curr.moveEventCurr, // use last moveEventCurr as the new moveEventPrev
    currMoveEvent,
    oldSmpeComboPrevCurr.curr.possiblePressEvent,
    oldSmpeComboPrevCurr.curr.pressEvent,
    oldSmpeComboPrevCurr.curr.endEvent,
    currMoveEvent.event.type,
    currMoveEvent.time - oldSmpeComboPrevCurr.curr.startEvent.time,
    movement
  );
};

export const smpeOnEndFac = (oldSmpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
  const currEndEvent = curr.nonStartEvent;
  const movement = calMovement(oldSmpeComboPrevCurr, curr);
  return new SMPECombo(
    oldSmpeComboPrevCurr.curr.identifier,
    oldSmpeComboPrevCurr.curr.startEvent,
    oldSmpeComboPrevCurr.curr.moveEventPrev,
    oldSmpeComboPrevCurr.curr.moveEventCurr,
    oldSmpeComboPrevCurr.curr.possiblePressEvent,
    oldSmpeComboPrevCurr.curr.pressEvent,
    currEndEvent,
    currEndEvent.event.type,
    currEndEvent.time - oldSmpeComboPrevCurr.curr.startEvent.time,
    movement
  );
};

export const smpeOnPossiblePressFac = (oldSmpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
  const currPossiblePressEvent = curr.nonStartEvent;
  let currPressEvent, currType;
  const moved = !!oldSmpeComboPrevCurr.curr.moveEventCurr;
  const sameTargetAfterMove = moved && oldSmpeComboPrevCurr.curr.moveEventCurr.event.target === 
    oldSmpeComboPrevCurr.curr.startEvent.event.target;
  if (moved && !sameTargetAfterMove) {
    currType = currPossiblePressEvent.event.type;
    currPressEvent = oldSmpeComboPrevCurr.curr.pressEvent;
  } else {
    currType = 'press';
    currPressEvent = Object.assign(currPossiblePressEvent, {type: currType});
  }

  return new SMPECombo(
    oldSmpeComboPrevCurr.curr.identifier,
    oldSmpeComboPrevCurr.curr.startEvent,
    oldSmpeComboPrevCurr.curr.moveEventPrev,
    oldSmpeComboPrevCurr.curr.moveEventCurr,
    currPossiblePressEvent,
    currPressEvent,
    oldSmpeComboPrevCurr.curr.endEvent,
    currType,
    currPossiblePressEvent.time - oldSmpeComboPrevCurr.curr.startEvent.time,
    oldSmpeComboPrevCurr.curr.movement
  );
};
