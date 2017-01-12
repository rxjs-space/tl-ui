import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation } from '../../tl-ui';

@Component({
  selector: 'tl-carousel-examples',
  templateUrl: './tl-carousel-examples.component.html',
  styleUrls: ['./tl-carousel-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlCarouselExamplesComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
