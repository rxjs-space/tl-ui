import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TlDropdownComponent } from './tl-dropdown.component';
import { TlDropdownConfigService } from './tl-dropdown-config.service';
import { TlDropdownActiveAsideComponent } from './tl-dropdown-active-aside/tl-dropdown-active-aside.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [TlDropdownComponent, TlDropdownActiveAsideComponent],
  exports: [TlDropdownComponent, TlDropdownActiveAsideComponent]
})
export class TlDropdownModule {
  static withProviders(): ModuleWithProviders {
    return {
      ngModule: TlDropdownModule,
      providers: [TlDropdownConfigService]
    };
  }
}
