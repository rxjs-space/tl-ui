import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TlDropdownComponent } from './tl-dropdown.component';
import { TlDropdownConfigService } from './tl-dropdown-config.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [TlDropdownComponent],
  exports: [TlDropdownComponent]
})
export class TlDropdownModule {
  static withProviders(): ModuleWithProviders {
    return {
      ngModule: TlDropdownModule,
      providers: [TlDropdownConfigService]
    };
  }
}
