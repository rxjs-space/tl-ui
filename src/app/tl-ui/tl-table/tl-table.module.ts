import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlTableRoutingModule } from './tl-table-routing.module';
import { TlTableComponent } from './tl-table.component';

@NgModule({
  imports: [
    CommonModule,
    TlTableRoutingModule
  ],
  declarations: [TlTableComponent],
  exports: [TlTableComponent],
})
export class TlTableModule { }
