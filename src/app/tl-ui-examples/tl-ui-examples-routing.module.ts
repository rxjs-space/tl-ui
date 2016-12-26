import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tl0Component } from './tl-0/tl-0.component';
import { TlModalExamplesComponent } from './tl-modal-examples/tl-modal-examples.component';
import { TlAccordionExamplesComponent } from './tl-accordion-examples/tl-accordion-examples.component';
import { TlAlertExamplesComponent } from './tl-alert-examples/tl-alert-examples.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: Tl0Component },
  { path: 'modal', component: TlModalExamplesComponent },
  { path: 'accordion', component: TlAccordionExamplesComponent },
  { path: 'alert', component: TlAlertExamplesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class TlUiExamplesRoutingModule { }
