import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tl0Component } from './tl-0/tl-0.component';
import { TlModalExamplesComponent } from './tl-modal-examples/tl-modal-examples.component';
import { TlAccordionExamplesComponent } from './tl-accordion-examples/tl-accordion-examples.component';
import { TlNotificationExamplesComponent } from './tl-notification-examples/tl-notification-examples.component';
import { TlDropdownExamplesComponent } from './tl-dropdown-examples/tl-dropdown-examples.component';

export const examplePaths = [
  { path: 'modal', component: TlModalExamplesComponent },
  { path: 'accordion', component: TlAccordionExamplesComponent },
  { path: 'notification', component: TlNotificationExamplesComponent },
  { path: 'dropdown', component: TlDropdownExamplesComponent }
];

const routes: Routes = [
  { path: '', pathMatch: 'full', component: Tl0Component },
  { path: 'components', children: [
    { path: '', pathMatch: 'full', redirectTo: 'accordion' },
    ...examplePaths
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class TlUiExamplesRoutingModule { }
