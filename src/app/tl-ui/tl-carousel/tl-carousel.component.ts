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
import { carouselAnimations } from './tl-carousel.component.animation';
import { TlCarouselSlideComponent } from './tl-carousel-slide.component';
import { TlGesturesService, TlGesturesEventCombo } from '../tl-gestures';

@Component({
  selector: 'tl-carousel',
  templateUrl: './tl-carousel.component.html',
  styleUrls: ['./tl-carousel.component.scss'],
  animations: carouselAnimations,
  changeDetection: 0
})
export class TlCarouselComponent implements OnInit {
  @ContentChildren(TlCarouselSlideComponent) slides: QueryList<TlCarouselSlideComponent>;
  @Input() height = 100;
  @Input() slideInterval: number = 2000;
  @ViewChild('carouselInner') carouselInner: DebugElement;

  subscriptions: Subscription[] = [];
  actionRxx: BehaviorSubject<{type?: string, target?: string | EventTarget} | Event> = new BehaviorSubject(null);
  nextSlideIdRx = this.actionRxx
    .switchMap(this.actionHandler.bind(this))
    .scan(this.slideIdAcc.bind(this));
  nextSlideIdRxx = new BehaviorSubject(0);

  constructor(private gestures: TlGesturesService) { }

  actionOnDomEvent(eventCombo: TlGesturesEventCombo) {
    let {event, customEvent} = eventCombo;
    event.preventDefault();
    // if customeEvent available, emit it; otherwise, emit event
    if (customEvent) {
      if (!customEvent.type) {customEvent.type = event.type; }
      this.actionRxx.next(customEvent);
    } else {
      if (this.actionRxx.getValue().type === 'tap' && (event.type === 'mouseenter')) {
        return;
      } else {
        this.actionRxx.next(event);
      }
    }
  }

  activateSlide(id) {
    this.slides.forEach(slide => slide.activeSlide = this.slides.toArray()[id]);
  }

  actionHandler(event): Observable<any> {
    // console.log(event.type, event.target);
    switch (true) {
      case event.type === 'start':
        return Observable.timer(0, this.slideInterval);
      case event.type === 'mouseleave':
        return Observable.interval(this.slideInterval);
      case event.type === 'tap' && event.target === 'buttonNext':
        return Observable.merge(Observable.of('next'), Observable.interval(this.slideInterval));
      case event.type === 'tap' && event.target === 'buttonPrevious':
        return Observable.merge(Observable.of('previous'), Observable.interval(this.slideInterval));

      default:
        return Observable.never();
    }
  }

  logEvent(event) {
    console.log(event);
    console.log(event.constructor);
    console.log(event instanceof MouseEvent)
  }

  slideIdAcc(acc, curr) {
    if (curr === 'previous') {
      --acc;
    } else {
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
    this.actionRxx.next({type: 'start'});
    // BehaviorSubject subscribe to Observable
    const nextSlideIdSub_ = this.nextSlideIdRx.subscribe(this.nextSlideIdRxx);
    this.subscriptions.push(nextSlideIdSub_);
    // actionOnDomEvent subscribe to gestrueEvent
    const gesturesSub_ = this.gestures.gestureEventRxx.subscribe(this.actionOnDomEvent.bind(this));
    this.subscriptions.push(gesturesSub_);

  }


  ngAfterContentInit() {
    const activateSlideSub_ = this.nextSlideIdRxx.subscribe(v => {
      // console.log(v);
      this.activateSlide(v);
    });

    this.subscriptions.push(activateSlideSub_);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }



}
