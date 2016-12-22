import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlAccordionComponent } from './tl-accordion.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlAccordionComponent],
  exports: [TlAccordionComponent],
})
export class TlAccordionModule { }
