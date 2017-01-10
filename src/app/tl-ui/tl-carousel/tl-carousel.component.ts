import { Component, Input, OnInit, ContentChildren, QueryList } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
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
  @Input() slideInterval: number = 2000;
  subscriptions: Subscription[] = [];
  clickOnNextRxx: BehaviorSubject<any> = new BehaviorSubject(null);
  looperRx = this.clickOnNextRxx
    .switchMap(() => Observable.timer(0, this.slideInterval))
    .scan((acc, curr) => {
      if (++acc > this.slides.length - 1) {
        acc = 0;
      }
      return acc;
    });

  constructor() { }

  activateSlide(id) {
    this.slides.forEach(slide => slide.activeSlideRxx.next(this.slides.toArray()[id]));
  }

  ngOnInit() {}


  ngAfterContentInit() {
    this.subscriptions.push(this.looperRx.subscribe(v => this.activateSlide(v)));
    // this.activateSlide(0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }



}
