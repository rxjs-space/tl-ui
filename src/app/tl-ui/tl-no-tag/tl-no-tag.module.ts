import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlNoTagRoutingModule } from './tl-no-tag-routing.module';
import { TlNoTagComponent } from './tl-no-tag.component';

@NgModule({
  imports: [
    CommonModule,
    TlNoTagRoutingModule
  ],
  declarations: [TlNoTagComponent],
  exports: [TlNoTagComponent]
})
export class TlNoTagModule { }
