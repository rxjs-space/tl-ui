import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { carouselSlideAnimations } from './tl-carousel-slide.component.animation';

@Component({
  selector: 'tl-carousel-slide',
  templateUrl: './tl-carousel-slide.component.html',
  styleUrls: ['./tl-carousel-slide.component.scss'],
  changeDetection: 0,
  animations: carouselSlideAnimations
})
export class TlCarouselSlideComponent implements OnInit {
  activeSlideRxx: BehaviorSubject<TlCarouselSlideComponent> = new BehaviorSubject(null);
  constructor() { }

  ngOnInit() {}

}
