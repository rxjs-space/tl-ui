import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlModalComponent } from './tl-modal.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlModalComponent],
  exports: [TlModalComponent]
})
export class TlModalModule { }
