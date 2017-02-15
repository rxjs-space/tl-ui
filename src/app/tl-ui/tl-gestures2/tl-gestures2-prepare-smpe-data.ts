import { TlGestures2Directive } from './tl-gestures2.directive';
import { tlGestureEventTypes, EventIT, Identifier,
  StartNonStartCombo, SMPECombo, SMPEComboPrevCurr, SMPEData, TlGestureEvent
} from './tl-gestures2';
import { smpeOnStartFac, smpeOnEndFac, smpeOnMoveFac, smpeOnPossiblePressFac } from './tl-gestures2-on';

export const newSmpeComboCurr = (oldSmpeComboPrevCurr: SMPEComboPrevCurr, curr: StartNonStartCombo) => {
  if (curr.nonStartEvent) {
    switch (curr.nonStartEvent.event.type) {
      case 'mousemove':
      case 'touchmove':
        return smpeOnMoveFac(oldSmpeComboPrevCurr, curr);
      case 'mouseup':
      case 'touchend':
        return smpeOnEndFac(oldSmpeComboPrevCurr, curr);
      case 'possiblePress':
        return smpeOnPossiblePressFac(oldSmpeComboPrevCurr, curr);
      // default:
      // what about touchcancel
    }
  } else { // if curr.nonStartEvent === null
    return smpeOnStartFac(oldSmpeComboPrevCurr, curr);
  }
}

export const newActiveTouchIdentifiers = (smpeData: SMPEData) => {
  const latestIdentifier = smpeData.latestIdentifier;
  const listCopy = [...smpeData.activeTouchIdentifiers];

  if (latestIdentifier !== -1) { // if it's a touch event
    const latestSmpeComboEnded = !!smpeData.smpeCombosMap.get(latestIdentifier).curr.endEvent;
    const index = listCopy.indexOf(latestIdentifier);
    if (latestSmpeComboEnded) { // if this touch ended, it must is in the oldListCopy, we shall remove it
      listCopy.splice(index, 1);
    } else { // if this touch not ended and it's a new touch, we insert it into the list
      // console.log(index);
      index === -1 && listCopy.push(latestIdentifier);
    }
  }
  return listCopy;
}

export const composeShortTraps = (tlGestures2Directive: TlGestures2Directive, smpeData: SMPEData) => {
  const lastSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
  const lastSmpeComboEnded = !!lastSmpeCombo.endEvent;
  if (lastSmpeComboEnded) {
    const sameTarget = lastSmpeCombo.endEvent.event.target === lastSmpeCombo.startEvent.event.target;
    const shortDuration = lastSmpeCombo.duration <= tlGestures2Directive.options.shortTapStartEndInterval;
    if (sameTarget && shortDuration) {
      return {
        prev: smpeData.lastShortTaps && smpeData.lastShortTaps.curr,
        curr: ({
          identifier: lastSmpeCombo.identifier, 
          target: lastSmpeCombo.startEvent.event.target,
          time: lastSmpeCombo.endEvent.time,
          type: 'shortTap', 
        })
      }
    }
  }
  return smpeData.lastShortTaps;
}
