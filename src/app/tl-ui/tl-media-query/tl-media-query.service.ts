import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';


@Injectable()
export class TlMediaQueryService {


  constructor() { }
  matchWidthRxxFac(minMax, pixels) {
    let mql: MediaQueryList = window.matchMedia(`(${minMax}-width: ${pixels}px)`);
    let matchWidthRxx = new BehaviorSubject<Boolean>(mql.matches);
    let widthChangeHandler: MediaQueryListListener = mqx => {
      matchWidthRxx.next(mqx.matches);
    };
    let matchWidthRx: Observable<MediaQueryList> = Observable.fromEventPattern(
      (handler: MediaQueryListListener) => {mql.addListener(handler); },
      (handler: MediaQueryListListener) => {mql.removeListener(handler); }
    );
    matchWidthRx.subscribe(widthChangeHandler);
    return matchWidthRxx;
  }


/*
fullBreakpoints = { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 }
breakpoints = [576, 768, 992, 1200];
[false, false, false, false] will return 0, that is xs
[true, false, false, false] will return 1, thats sm (min 576)
[true, true, false, false] will return 2, thats md (min 768)
*/
  minWidthRxxFac() {

    let breakpoints = [576, 768, 992, 1200];
    let mqls: MediaQueryList[] = breakpoints.map(bp => window.matchMedia(`(min-width: ${bp}px)`));
    let matchWidthRxxs = mqls.map(mql => new BehaviorSubject(mql.matches));

    let matchWidthRxs: Observable<MediaQueryList>[] = mqls.map(mql => Observable.fromEventPattern(
      (handler: MediaQueryListListener) => {mql.addListener(handler); },
      (handler: MediaQueryListListener) => {mql.removeListener(handler); }
    ));
    let subscriptions = matchWidthRxs.map((matchWidthRx, i) => {
      matchWidthRx.subscribe(mql => matchWidthRxxs[i].next(mql.matches));
    });

    let matchWidthRxxsCombined = Observable.combineLatest(...matchWidthRxxs);
    let sumRx = matchWidthRxxsCombined.map(booleanArr => booleanArr.reduce((acc, curr) => Number(acc) + Number(curr), 0));
    return sumRx;
  }
}



// $grid-breakpoints: (
//   xs: 0,
//   sm: 576px,
//   md: 768px,
//   lg: 992px,
//   xl: 1200px
// ) 
