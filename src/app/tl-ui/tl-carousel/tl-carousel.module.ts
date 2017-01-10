import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlCarouselComponent } from './tl-carousel.component';
import { TlCarouselSlideComponent } from './tl-carousel-slide.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [TlCarouselComponent, TlCarouselSlideComponent],
  exports: [TlCarouselComponent, TlCarouselSlideComponent],
})
export class TlCarouselModule { }
