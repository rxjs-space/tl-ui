import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tl0Component } from './tl-0/tl-0.component';
import { TlModalExamplesComponent } from './tl-modal-examples/tl-modal-examples.component';
import { TlModalA6ExamplesComponent } from './tl-modal-a6-examples/tl-modal-a6-examples.component';
import { TlAccordionExamplesComponent } from './tl-accordion-examples/tl-accordion-examples.component';
import { TlNotificationExamplesComponent } from './tl-notification-examples/tl-notification-examples.component';
import { TlDropdownExamplesComponent } from './tl-dropdown-examples/tl-dropdown-examples.component';
import { TlNoTagExamplesComponent } from './tl-no-tag-examples/tl-no-tag-examples.component';
import { TlClipboardExamplesComponent } from './tl-clipboard-examples/tl-clipboard-examples.component';
import { TlCarouselExamplesComponent } from './tl-carousel-examples/tl-carousel-examples.component';
import { TlTableExamplesComponent } from './tl-table-examples/tl-table-examples.component';
import { TlGesturesExamplesComponent } from './tl-gestures-examples/tl-gestures-examples.component';


export const examplePaths = [
  { path: 'modal', component: TlModalExamplesComponent },
  { path: 'accordion', component: TlAccordionExamplesComponent },
  { path: 'notification', component: TlNotificationExamplesComponent },
  { path: 'dropdown', component: TlDropdownExamplesComponent },
  { path: 'no-tag', component: TlNoTagExamplesComponent },
  { path: 'clipboard', component: TlClipboardExamplesComponent },
  { path: 'modal-a6', component: TlModalA6ExamplesComponent },
  { path: 'carousel', component: TlCarouselExamplesComponent },
  { path: 'table', component: TlTableExamplesComponent },
  { path: 'gestures', component: TlGesturesExamplesComponent },
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
