import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlClipboardService } from './tl-clipboard.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [TlClipboardService] // provide here, instead of in withProviders static method, so we use it by default
})
export class TlClipboardModule { }
