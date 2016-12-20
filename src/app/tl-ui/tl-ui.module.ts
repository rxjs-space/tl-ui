import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlUiComponent } from './tl-ui.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlUiComponent],
  exports: [TlUiComponent],
})
export class TlUiModule { }
