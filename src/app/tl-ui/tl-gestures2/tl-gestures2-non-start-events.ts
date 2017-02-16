import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/filter';
import { EventIT } from './tl-gestures2';
import { TlGestures2Directive } from './tl-gestures2.directive';

/**
 * rootElement (copied from 'rxjs\src\util\root.ts')
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

/**
 * nonStartEvents
 */
export const mouseRxFac = (eventType: 'mouseup' | 'mousemove'): Observable<EventIT> => {
  return Observable.fromEvent(rootElement, eventType)
    .map((e: Event) => ({event: e, identifier: -1, time: Date.now()}));
};

export const touchRxFac = (eventType: 'touchend' | 'touchmove', identifier: number): Observable<EventIT> => {
  return Observable.fromEvent(rootElement, eventType)
    .filter((event: TouchEvent) => {
      return event.changedTouches.item(0).identifier === identifier;
    })
    .map((e: Event) => ({event: e, identifier, time: Date.now()}));
};

export const possiblePressRxFac = (tlGestures2Directive: TlGestures2Directive, identifier: number): Observable<EventIT> => {
  return Observable.interval(tlGestures2Directive.options.pressInterval).take(1)
    .map(() => ({event: {type: 'possiblePress', target: null}, identifier, time: Date.now()}))
};

export const nonStartEventRxFac = (tlGestures2Directive: TlGestures2Directive, startEvent: EventIT): Observable<EventIT> => {
  switch (startEvent.event.type) {
    case 'mousedown':
      return mouseRxFac('mousemove')
        .merge(possiblePressRxFac(tlGestures2Directive, -1))
        .takeUntil(mouseRxFac('mouseup').take(1))
        .merge(mouseRxFac('mouseup').take(1))
        .startWith(null);
    case 'touchstart':
      const identifier = (startEvent.event as TouchEvent).changedTouches.item(0).identifier;
      // console.log('after start', identifier);
      return touchRxFac('touchmove', identifier)
        .merge(possiblePressRxFac(tlGestures2Directive, identifier))
        .takeUntil(touchRxFac('touchend', identifier).take(1))
        .merge(touchRxFac('touchend', identifier).take(1))
        .startWith(null);
  }
};