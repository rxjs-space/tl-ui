import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tl0Component } from './tl-0/tl-0.component';
import { TlModalExamplesComponent } from './tl-modal-examples/tl-modal-examples.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: Tl0Component },
  { path: 'modal', component: TlModalExamplesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class TlUiExamplesRoutingModule { }
