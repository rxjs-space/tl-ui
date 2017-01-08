import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlDropdownNavRoutingModule } from './tl-dropdown-nav-routing.module';
import { TlDropdownNavComponent } from './tl-dropdown-nav.component';

@NgModule({
  imports: [
    CommonModule,
    TlDropdownNavRoutingModule
  ],
  declarations: [TlDropdownNavComponent],
  exports: [TlDropdownNavComponent],
})
export class TlDropdownNavModule { }
