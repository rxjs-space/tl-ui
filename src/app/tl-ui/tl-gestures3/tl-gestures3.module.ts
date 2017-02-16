import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlGestures3Directive } from './tl-gestures3.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlGestures3Directive],
  exports: [TlGestures3Directive],
})
export class TlGestures3Module { }
