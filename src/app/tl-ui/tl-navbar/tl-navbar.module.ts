import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlNavbarRoutingModule } from './tl-navbar-routing.module';
import { TlNavbarComponent } from './tl-navbar.component';
import { TlDropdownNavModule } from '../tl-dropdown-nav'
@NgModule({
  imports: [
    CommonModule,
    TlNavbarRoutingModule,
    TlDropdownNavModule
  ],
  declarations: [TlNavbarComponent],
  exports: [TlNavbarComponent]
})
export class TlNavbarModule { }
