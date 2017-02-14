import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlGestures2Directive } from './tl-gestures2.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [TlGestures2Directive],
  exports: [TlGestures2Directive]
})
export class TlGestures2Module { }
