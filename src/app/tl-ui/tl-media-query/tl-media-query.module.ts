import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlMediaQueryService } from './tl-media-query.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [TlMediaQueryService]
})
export class TlMediaQueryModule { }
