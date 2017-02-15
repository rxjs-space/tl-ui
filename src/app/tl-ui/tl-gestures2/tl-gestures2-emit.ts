import { TlGestures2Directive } from './tl-gestures2.directive';
import { tlGestureEventTypes, EventIT, Identifier,
  StartNonStartCombo, SMPECombo, SMPEComboPrevCurr, SMPEData, TlGestureEvent
} from './tl-gestures2';

export const listenOn = (tlGestures2Directive: TlGestures2Directive, gestureEvent) => {
  return !!tlGestures2Directive[gestureEvent].observers.length;
};

export const emitTlTap = (tlGestures2Directive: TlGestures2Directive) => {
  return (smpeData: SMPEData) => {
    // if SMPEComboPrevCurr.curr.endEvent.event.target === SMPEComboPrevCurr.curr.startEvent.event.target \
    // emit tlTap
    const type = tlGestureEventTypes.tlTap;
    if (listenOn(tlGestures2Directive, type)) {
      const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
      if (currSmpeCombo.endEvent) {
        const {endEvent, startEvent} = currSmpeCombo;
        if (endEvent.event.target === startEvent.event.target) {
          tlGestures2Directive[type].emit({
            identifier: currSmpeCombo.identifier, 
            target: endEvent.event.target,
            time: endEvent.time,
            type
          });
        }
      }
    }
  };
};


export const emitTlDblTap = (tlGestures2Directive: TlGestures2Directive) => {
  return (smpeData: SMPEData) => {
    // if lastShortTaps has the same target and identifer and timeBetween is <= threshhold
    // emit tlDblTap
    const type = tlGestureEventTypes.tlDblTap;
    const latestIdentifier = smpeData.latestIdentifier;
    const lastSmpeCombo = smpeData.smpeCombosMap.get(latestIdentifier).curr;
    if (listenOn(tlGestures2Directive, type) && smpeData.lastShortTaps && smpeData.lastShortTaps.prev && lastSmpeCombo.endEvent) {
      const {prev, curr} = smpeData.lastShortTaps;
      const sameTarget = prev.target === curr.target;
      const sameIdentifier = prev.identifier === curr.identifier;
      const timeBetween = curr.time - prev.time;
      // console.log(timeBetween);
      if (sameTarget && sameIdentifier && timeBetween <= tlGestures2Directive.options.dblTapsInterval) {
        tlGestures2Directive[type].emit({
          identifier: curr.identifier, 
          target: curr.target,
          time: curr.time,
          type
        });
      }
    }
  };
};

export const emitTlPress = (tlGestures2Directive: TlGestures2Directive) => {
  return (smpeData: SMPEData) => {
    const type = tlGestureEventTypes.tlPress;
    if (listenOn(tlGestures2Directive, type)) {
      // if currSmpeCombo.latestEventType === 'press', emit tlPress
      const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
      if (currSmpeCombo.latestEventType === 'press') {
        tlGestures2Directive.tlPress.emit({
          identifier: currSmpeCombo.identifier, 
          target: currSmpeCombo.startEvent.event.target,
          time: currSmpeCombo.pressEvent.time,
          type, 
        });
      }
    }
  };
};


export const emitTlPan = (tlGestures2Directive: TlGestures2Directive) => {
  return (smpeData: SMPEData) => {
  const type = tlGestureEventTypes.tlPan;
    if (listenOn(tlGestures2Directive, type)) {
      // if currSmpeCombo.lastestEventType === 'mousemove' || 'touchmove'
      // emit tlPan
      const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
      if (currSmpeCombo.latestEventType.search(/move/) > -1) {
        // console.log(currSmpeCombo.movement);
        tlGestures2Directive.tlPan.emit({
          identifier: currSmpeCombo.identifier, 
          target: currSmpeCombo.startEvent.event.target,
          time: currSmpeCombo.moveEventCurr.time,
          type, 
          movement: currSmpeCombo.movement
        });
      }
    }
  };
};


export const emitTlSwipe = (tlGestures2Directive: TlGestures2Directive) => {
  return (smpeData: SMPEData) => {
    const type = tlGestureEventTypes.tlSwipe;
    if (listenOn(tlGestures2Directive, type)) {
      // if currSmpeCombo.endEvent exists and distance >= threshold, emit swipe
      const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
      if (currSmpeCombo.endEvent) {
        const distance = Math.sqrt(Math.pow(currSmpeCombo.distance.x, 2) + Math.pow(currSmpeCombo.distance.y, 2))
        if (distance >= tlGestures2Directive.options.swipeDistanceThreshold) {
          tlGestures2Directive.tlSwipe.emit({
            identifier: currSmpeCombo.identifier,
            target: currSmpeCombo.startEvent.event.target,
            time: currSmpeCombo.endEvent.time,
            type,
            distance: currSmpeCombo.distance,
            duration: currSmpeCombo.duration
          });
        }
      }
    }
  };
};



export const emitTlPinch = (tlGestures2Directive: TlGestures2Directive) => {
  return (smpeData: SMPEData) => {
    const type = tlGestureEventTypes.tlPinch;
    if (listenOn(tlGestures2Directive, type)) {
      // check the smpeData.activeTouchIdentifiers list \
      // if list.length > 1, and either of the first 2 touches moved \
      // emit tlPinch with relative movement for the first 2 touches
      const touchList = smpeData.activeTouchIdentifiers;

      if (touchList.length > 1) {
        console.log(touchList[0]);
        const firstTouch = smpeData.smpeCombosMap.get(touchList[0]).curr;
        const secondTouch = smpeData.smpeCombosMap.get(touchList[1]).curr;
        const firstMoved = firstTouch.latestEventType === 'touchmove';
        const secondtMoved = secondTouch.latestEventType === 'touchmove';

        if (firstMoved || secondtMoved) {
          const firstTouchX = firstTouch.moveEventCurr ?
            (firstTouch.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX :
            (firstTouch.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
          const secondeTouchX = secondTouch.moveEventCurr ?
            (secondTouch.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX :
            (secondTouch.startEvent.event as TouchEvent).changedTouches.item(0).pageX;
          const firstTouchY = firstTouch.moveEventCurr ?
            (firstTouch.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY :
            (firstTouch.startEvent.event as TouchEvent).changedTouches.item(0).pageY;
          const secondeTouchY = secondTouch.moveEventCurr ? 
            (secondTouch.moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY:
            (secondTouch.startEvent.event as TouchEvent).changedTouches.item(0).pageY;

          const firstOnTheRight = firstTouchX > secondeTouchX;
          const firstAtBottom = firstTouchY > secondeTouchY;

          let movement = {x: 0, y: 0}
          if (firstOnTheRight) {
            movement.x = firstTouch.movement.x - secondTouch.movement.x;
          } else {
            movement.x = secondTouch.movement.x - firstTouch.movement.x;
          }
          if (firstAtBottom) {
            movement.y = firstTouch.movement.y - secondTouch.movement.y;
          } else {
            movement.y = secondTouch.movement.y - firstTouch.movement.y;
          }
          const latestTouch = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
          tlGestures2Directive.tlPinch.emit({
            identifier: [(touchList[0] as number), (touchList[1] as number)],
            target: latestTouch.startEvent.event.target,
            time: latestTouch.moveEventCurr.time,
            type,
            movement
          })
        }

      }
    }
  };
};





// export const emitTlRotate = (smpeData: SMPEData) => {
//   const type = tlGestureEventTypes.tlRotate;
//   if (listenOn(type)) {
//     // 
//     const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
//     const prevSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).prev;

//   }
// };
