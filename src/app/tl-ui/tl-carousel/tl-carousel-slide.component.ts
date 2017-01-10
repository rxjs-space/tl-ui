import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Component({
  selector: 'tl-carousel-slide',
  templateUrl: './tl-carousel-slide.component.html',
  styleUrls: ['./tl-carousel-slide.component.scss']
})
export class TlCarouselSlideComponent implements OnInit {
  activeSlideRxx = new BehaviorSubject(null);
  constructor() { }

  ngOnInit() {}

}
