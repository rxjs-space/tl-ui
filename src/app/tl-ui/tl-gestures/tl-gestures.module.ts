import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlGesturesService } from './tl-gestures.service';
import { TlGesturesDirective } from './tl-gestures.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [TlGesturesService],
  declarations: [TlGesturesDirective],
  exports: [TlGesturesDirective]
})
export class TlGesturesModule { }
