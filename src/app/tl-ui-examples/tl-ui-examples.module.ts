import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TlUiExamplesRoutingModule } from './tl-ui-examples-routing.module';
import { TlUiExamplesComponent } from './tl-ui-examples.component';
import { Tl0Component } from './tl-0/tl-0.component';
import { TlModalExamplesComponent } from './tl-modal-examples/tl-modal-examples.component';
import { TlUiModule } from '../tl-ui';
import { TlAccordionExamplesComponent } from './tl-accordion-examples/tl-accordion-examples.component';
import { TlNotificationExamplesComponent } from './tl-notification-examples/tl-notification-examples.component';
import { InitialCapPipe } from './+shared/pipes/initial-cap.pipe';
import { TlDropdownExamplesComponent } from './tl-dropdown-examples/tl-dropdown-examples.component';
import { TlNoTagExamplesComponent } from './tl-no-tag-examples/tl-no-tag-examples.component';
import { TlClipboardExamplesComponent } from './tl-clipboard-examples/tl-clipboard-examples.component';
import { TlModalA6ExamplesComponent } from './tl-modal-a6-examples/tl-modal-a6-examples.component';
import { TlCarouselExamplesComponent } from './tl-carousel-examples/tl-carousel-examples.component';
import { TlTableExamplesComponent } from './tl-table-examples/tl-table-examples.component';
import { TlGesturesExamplesComponent } from './tl-gestures-examples/tl-gestures-examples.component';

@NgModule({
  imports: [
    CommonModule,
    TlUiExamplesRoutingModule,
    TlUiModule.withProviders(),
    // NgbModule.forRoot()
  ],
  declarations: [
    TlUiExamplesComponent,
    Tl0Component,
    TlModalExamplesComponent,
    TlAccordionExamplesComponent,
    TlNotificationExamplesComponent,
    InitialCapPipe,
    TlDropdownExamplesComponent,
    TlNoTagExamplesComponent,
    TlClipboardExamplesComponent,
    TlModalA6ExamplesComponent,
    TlCarouselExamplesComponent,
    TlTableExamplesComponent,
    TlGesturesExamplesComponent, ],
  exports: [TlUiExamplesComponent]
})
export class TlUiExamplesModule { }
