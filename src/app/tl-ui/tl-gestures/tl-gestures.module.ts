import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlGesturesService } from './tl-gestures.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [TlGesturesService]
})
export class TlGesturesModule { }
