import { Component, DebugElement, Input, OnInit,
  ContentChildren, ViewChild, QueryList, } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/switchMap';
import { carouselAnimations } from './tl-carousel.component.animation';
import { TlCarouselSlideComponent } from './tl-carousel-slide.component';

@Component({
  selector: 'tl-carousel',
  templateUrl: './tl-carousel.component.html',
  styleUrls: ['./tl-carousel.component.scss'],
  animations: carouselAnimations
})
export class TlCarouselComponent implements OnInit {
  @ContentChildren(TlCarouselSlideComponent) slides: QueryList<TlCarouselSlideComponent>;
  @Input() height = 100;
  @Input() slideInterval: number = 2000;
  @ViewChild('carouselInner') carouselInner: DebugElement;
  subscriptions: Subscription[] = [];
  actionRxx: BehaviorSubject<any> = new BehaviorSubject('start');
  nextSlideRx = this.actionRxx
    .switchMap(this.actionHandler.bind(this))
    .scan(this.slideIdAcc.bind(this));

  constructor() { }

  activateSlide(id) {
    this.slides.forEach(slide => slide.activeSlide = this.slides.toArray()[id]);
  }

  actionHandler(e): Observable<any> {
    switch (true) {
      case e === 'start':
        return Observable.timer(0, this.slideInterval);
      case e === 'mouseleave':
        return Observable.interval(this.slideInterval);
      case e === 'clickOnNext':
        return Observable.of('next');
      case e === 'clickOnPrevious':
        return Observable.of('previous');
      default:
        return Observable.never();
    }
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

  ngOnInit() {}


  ngAfterContentInit() {
    this.subscriptions.push(this.nextSlideRx.subscribe(v => {
      // console.log(v);
      this.activateSlide(v);
    }));
    // this.activateSlide(0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }



}
