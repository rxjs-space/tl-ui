import { rootElement, tlGestureEventTypes, EventIT, Identifier,
  StartNonStartCombo, SMPECombo, SMPEComboPrevCurr, SMPEData, TlGestureEvent
} from './tl-gestures2';





export const emitTlDblTap = (smpeData: SMPEData) => {
  // if SMPEComboPrevCurr.curr.endEvent.event.target === SMPEComboPrevCurr.curr.startEvent.event.target \
  // and SMPEComboPrevCurr.curr.endEvent.time - SMPEComboPrevCurr.curr.startEvent.time <= _options.shortTapStartEndInterval \
  // and SMPEComboPrevCurr.prev exists \
  // and SMPEComboPrevCurr.curr.startEvent.time - SMPEComboPrevCurr.prev.endEvent.time <= _options.dblTapsInterval \
  // and SMPEComboPrevCurr.prev.endEvent.event.target === SMPEComboPrevCurr.prev.startEvent.event.target \
  // and SMPEComboPrevCurr.prev.endEvent.time - SMPEComboPrevCurr.prev.startEvent.time <= _options.shortTapStartEndInterval \
  // emit tlDblTap
  const type = tlGestureEventTypes.tlDblTap;
  if (listenOn(type) && !!smpeData.lastShortTap) {
    const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
    if (currSmpeCombo.endEvent) {
      const currEndEvent = currSmpeCombo.endEvent;
      const currStartEvent = currSmpeCombo.startEvent;
      const currIsShortTap = currEndEvent.event.target === currStartEvent.event.target &&
        currEndEvent.time - currStartEvent.time <= this._options.shortTapStartEndInterval;
      const prevSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).prev;
      console.log(prevSmpeCombo);
      if (currIsShortTap && prevSmpeCombo && prevSmpeCombo.endEvent) {
        const prevStartEvent = prevSmpeCombo.startEvent;
        const prevEndEvent = prevSmpeCombo.endEvent;
        const timeBetweenCurrPrev = currStartEvent.time - prevEndEvent.time;
        if (timeBetweenCurrPrev <= this._options.dblTapsInterval) {
          const prevIsShortTap =  prevEndEvent.event.target === prevStartEvent.event.target &&
            prevEndEvent.time - prevStartEvent.time <= this._options.shortTapStartEndInterval;
          if (prevIsShortTap) {
            const pointer = currSmpeCombo.identifier === -1 ? 'mouse' : 'touch';
            this[type].emit({
              identifier: currSmpeCombo.identifier, 
              target: currSmpeCombo.startEvent.event.target,
              time: currEndEvent.time,
              type
            });
          }
        }
      }
    }
  }
};



export const emitTlPress = (smpeData: SMPEData) => {
  const type = tlGestureEventTypes.tlPress;
  if (listenOn(type)) {
    // if currSmpeCombo.pressEvent exists \
    // and prevSmpeCombo doesn't exist or prevSmpeCombo.endEvent exists or prevSmpeCombo.pressEvent doesn't exist \
    // emit tlPress
    const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
    const prevSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).prev;
    if ( currSmpeCombo.pressEvent && 
      (!prevSmpeCombo || prevSmpeCombo.endEvent || !prevSmpeCombo.pressEvent)
    ) {
      this.tlPress.emit({
        identifier: currSmpeCombo.identifier, 
        target: currSmpeCombo.startEvent.event.target,
        time: currSmpeCombo.pressEvent.time,
        type, 
      });
    }
  }
};



export const emitTlPan = (smpeData: SMPEData) => {
  const type = tlGestureEventTypes.tlPan;
  if (listenOn(type)) {
    // if currSmpeCombo.pressEvent exists \
    // and prevSmpeCombo doesn't exist or prevSmpeCombo.pressEvent doesn't exist or prevSmpeCombo.endEvent exists \
    // emit tlPress
    const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
    const {startEvent, moveEventCurr, moveEventPrev, endEvent} = currSmpeCombo;
    if (moveEventCurr && !endEvent) {
      const pointer = currSmpeCombo.identifier === -1 ? 'mouse' : 'touch';
      let currPageX: number, prevPageX: number, currPageY: number, prevPageY: number;
      switch (pointer) {
        case 'mouse':
          if (moveEventPrev) {
            currPageX = (moveEventCurr.event as MouseEvent).pageX;
            prevPageX = (moveEventPrev.event as MouseEvent).pageX;
            currPageY = (moveEventCurr.event as MouseEvent).pageY;
            prevPageY = (moveEventPrev.event as MouseEvent).pageY;
          } else {
            currPageX = (moveEventCurr.event as MouseEvent).pageX;
            prevPageX = (startEvent.event as MouseEvent).pageX;
            currPageY = (moveEventCurr.event as MouseEvent).pageY;
            prevPageY = (startEvent.event as MouseEvent).pageY;
          }
          break;
        case 'touch':
          if (moveEventPrev) {
            currPageX = (moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
            prevPageX = (moveEventPrev.event as TouchEvent).changedTouches.item(0).pageX;
            currPageY = (moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
            prevPageY = (moveEventPrev.event as TouchEvent).changedTouches.item(0).pageY;
          } else {
            currPageX = (moveEventCurr.event as TouchEvent).changedTouches.item(0).pageX;
            prevPageX = (startEvent.event as TouchEvent).changedTouches.item(0).pageX;
            currPageY = (moveEventCurr.event as TouchEvent).changedTouches.item(0).pageY;
            prevPageY = (startEvent.event as TouchEvent).changedTouches.item(0).pageY;
          }
          break;
      }
      const movementX = currPageX - prevPageX;
      const movementY = currPageY - prevPageY;
      const time = moveEventCurr.time;
      this.tlPan.emit({
        identifier: currSmpeCombo.identifier,
        target: currSmpeCombo.startEvent.event.target,
        time,
        type,
        movement: {x: movementX, y: movementY}
      });
    }
  }
};



export const emitTlSwipe = (smpeData: SMPEData) => {
  const type = tlGestureEventTypes.tlSwipe;
  if (listenOn(type)) {
    const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
    const {startEvent, endEvent} = currSmpeCombo;
    const pointer = currSmpeCombo.identifier === -1 ? 'mouse' : 'touch';
    // if currSmpeCombo.endEvent exists and \
    // currSmpeCombo.endEvent.event.pagePoint is at least 20px away from currSmpeCombo.startEvent.event.pagePoint
    // emit tlSwipe
    let endPageX, endPageY, startPageX, startPageY;
    if (endEvent) {
      switch (pointer) {
        case 'mouse':
          endPageX = (endEvent.event as MouseEvent).pageX;
          endPageY = (endEvent.event as MouseEvent).pageY;
          startPageX = (startEvent.event as MouseEvent).pageX;
          startPageY = (startEvent.event as MouseEvent).pageY;
          break;
        case 'touch':
          endPageX = (endEvent.event as TouchEvent).changedTouches.item(0).pageX;
          endPageY = (endEvent.event as TouchEvent).changedTouches.item(0).pageY;
          startPageX = (startEvent.event as TouchEvent).changedTouches.item(0).pageX;
          startPageY = (startEvent.event as TouchEvent).changedTouches.item(0).pageY;
          break;
      }
      const distDiffX = endPageX - startPageX;
      const distDiffY = endPageY - startPageY;
      const distDiff = Math.sqrt(distDiffX * distDiffX + distDiffY * distDiffY);
      const duration = endEvent.time - startEvent.time;
      const time = endEvent.time;
      if (distDiff >= this._options.swipeThreshold) {
        this.tlSwipe.emit({
          identifier: currSmpeCombo.identifier,
          target: currSmpeCombo.startEvent.event.target,
          time,
          type,
          distance: {x: distDiffX, y: distDiffY},
          duration
        });
      }
    }
  }
};




export const emitTlPinch = (smpeData: SMPEData) => {
  const type = tlGestureEventTypes.tlPinch;
  if (listenOn(type)) {
    // 
    const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
    const prevSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).prev;

  }
};

export const emitTlRotate = (smpeData: SMPEData) => {
  const type = tlGestureEventTypes.tlRotate;
  if (listenOn(type)) {
    // 
    const currSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).curr;
    const prevSmpeCombo = smpeData.smpeCombosMap.get(smpeData.latestIdentifier).prev;

  }
};
