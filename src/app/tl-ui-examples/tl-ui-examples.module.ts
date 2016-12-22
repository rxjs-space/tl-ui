import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlUiExamplesRoutingModule } from './tl-ui-examples-routing.module';
import { TlUiExamplesComponent } from './tl-ui-examples.component';
import { Tl0Component } from './tl-0/tl-0.component';
import { TlModalExamplesComponent } from './tl-modal-examples/tl-modal-examples.component';

@NgModule({
  imports: [
    CommonModule,
    TlUiExamplesRoutingModule
  ],
  declarations: [TlUiExamplesComponent, Tl0Component, TlModalExamplesComponent, ],
  exports: [TlUiExamplesComponent ]
})
export class TlUiExamplesModule { }
