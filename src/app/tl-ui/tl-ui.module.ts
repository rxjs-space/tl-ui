import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlUiComponent } from './tl-ui.component';
import { TlModalModule } from './tl-modal/tl-modal.module';

@NgModule({
  imports: [
    CommonModule,
    TlModalModule
  ],
  declarations: [TlUiComponent],
  exports: [TlUiComponent, TlModalModule],
})
export class TlUiModule { }


