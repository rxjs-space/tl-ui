import { Component, DebugElement, Input, OnInit, HostListener,
  ContentChildren, ViewChild, QueryList, } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/switchMap';
import { TlCarouselSlideComponent } from './tl-carousel-slide.component';
import { TlGestureEvent, TlGestureEventTypes } from '../tl-gestures';
import { TlCarouselAnimationScaleOptions, EventCombo } from './tl-carousel';

@Component({
  selector: 'tl-carousel',
  templateUrl: './tl-carousel.component.html',
  styleUrls: ['./tl-carousel.component.scss'],
  changeDetection: 0
})
export class TlCarouselComponent implements OnInit {

  // with animationScaleOptions, user can set the animationScale in the template, like:
  // <tl-carousel #c [animationScale]="c.animationScaleOptions.none"></tl-carousel>
  animationScaleOptions = TlCarouselAnimationScaleOptions;
  @Input() animationScale = 0;

  eventRxx: BehaviorSubject<EventCombo> = new BehaviorSubject(null);

  @ContentChildren(TlCarouselSlideComponent) slides: QueryList<TlCarouselSlideComponent>;
  @Input() height = 100;

  private _slideInterval: number = 3000;

  @Input() set slideInterval(interval) {
    if ( isNaN(interval) || interval < 3000) {
      interval = 3000;
    }
    this._slideInterval = interval;
    // restart the rolling once the interval is reset;
    this.restart();
    // console.log(this._slideInterval);
  }
  @ViewChild('carouselInner') carouselInner: DebugElement;

  subscriptions: Subscription[] = [];


  /* important part */
  nextSlideIdRx = this.eventRxx
    .switchMap(this.eventHandler.bind(this))
    .scan(this.slideIdAcc.bind(this), 'start'); // this 'start' will be the first acc param for this.slideIdAcc
  /* important part */


  nextSlideIdRxx = new BehaviorSubject(0);

  constructor() { }

  activateSlide(id) {
    this.slides.forEach((slide, index) => {
      let state;
      switch (true) {
        case id === index:
          state = 'current'; break;
        case id === index - 1 || (id === this.slides.length - 1 && index === 0):
          state = 'next'; break;
        case id === index + 1 || (id === 0 && index === this.slides.length - 1):
          state = 'previous'; break;
        default:
          state = 'idle';
      }
      // console.log(id, index, state);
      slide.whereAmIRxx.next(state);
    });
  }

  eventHandler(eventCombo: EventCombo): Observable<any> {
    let {event, targetAlias} = eventCombo;
    if (event instanceof Event) {event.preventDefault(); }
    // console.log(event.type, event.target);
    switch (true) {
      case event.type === 'mouseleave':
        return Observable.interval(this._slideInterval);
      case event.type === TlGestureEventTypes.swipeleft:
      case event.type === TlGestureEventTypes.swiperight:
      case event.type === 'click' && !!targetAlias:
      case event.type === 'resart':
        return Observable.merge(Observable.of(targetAlias), Observable.interval(this._slideInterval));
      default: // for example, 'tap' or 'mouseenter' will stop slides from rolling
        return Observable.never();
    }
  }

  @HostListener('document:touchstart') onDocumentTouchStart() {
    if (this.eventRxx.getValue().targetAlias === 'buttonPause') {
      this.restart();
    }
  }

  logEvent(event) {
    console.log(event);
    console.log(event.constructor);
  }

  restart() {
    this.eventRxx.next({event: {type: 'resart'}, targetAlias: 'resart'});
  }
  slideIdAcc(acc, curr) {
    switch (true) {
      case  typeof curr === 'string' && Boolean((<string>curr).match(/button\w+/)):
        let buttonName = curr.replace('button', '');
        if (buttonName === 'Previous') {
          --acc;
        } else {
          ++acc;
        }
        break;
      case typeof curr === 'string' && Boolean((<string>curr).match(/slide\d+/)):
        acc = Number((<string>curr).replace('slide', ''));
        break;
      case curr === 'resart':
        if (acc === 'start') { acc = 0; } // this is defined 2nd param of the scan func
        // else, do nothing
        break;

      default:
        ++acc;
    }

    if (acc > this.slides.length - 1) {
      acc = 0;
    }
    if (acc < 0) {
      acc = this.slides.length - 1;
    }
    return acc;
  }


  ngOnInit() {
    // normalize this.animationScale
    switch (true) {
      case isNaN(this.animationScale):
        this.animationScale = 0; break;
      case this.animationScale > 3:
        this.animationScale = 3; break;
      case this.animationScale < 0:
        this.animationScale = 0; break;
      default:
        this.animationScale = Math.floor(this.animationScale);
    }
  }


  ngAfterContentInit() {

    // pass animationScale to ContentChildren
    this.slides.forEach(slide => {
      if (this.slides.length < 3) { // if slides.length < 3, do no animation
        slide.animationScale = 0;
      } else {
        slide.animationScale = this.animationScale;
      }
    });
    
    // BehaviorSubject subscribe to Observable
    const nextSlideIdSub_ = this.nextSlideIdRx.subscribe(this.nextSlideIdRxx);
    this.subscriptions.push(nextSlideIdSub_);

    // activateSlide subscribe to nextSlideIdRxx
    const activateSlideSub_ = this.nextSlideIdRxx.subscribe(v => {
      this.activateSlide(v);
    });
    this.subscriptions.push(activateSlideSub_);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }



}
