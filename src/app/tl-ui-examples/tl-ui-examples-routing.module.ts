import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tl0Component } from './tl-0/tl-0.component';
import { TlModalExamplesComponent } from './tl-modal-examples/tl-modal-examples.component';
import { TlAccordionExamplesComponent } from './tl-accordion-examples/tl-accordion-examples.component';
import { TlNotificationExamplesComponent } from './tl-alert-examples/tl-notification-examples.component';

const examplePaths = [
  { path: 'modal', component: TlModalExamplesComponent },
  { path: 'accordion', component: TlAccordionExamplesComponent },
  { path: 'notification', component: TlNotificationExamplesComponent }
];

export const sortedExamplePaths = examplePaths.sort((a, b) => {
  if (a.path > b.path) {return 1; }
  if (a.path < b.path) {return -1; }
  return 0;
});

const routes: Routes = [
  { path: '', pathMatch: 'full', component: Tl0Component },
  { path: 'components', children: [
    { path: '', pathMatch: 'full', redirectTo: sortedExamplePaths[0].path },
    ...examplePaths
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class TlUiExamplesRoutingModule { }
