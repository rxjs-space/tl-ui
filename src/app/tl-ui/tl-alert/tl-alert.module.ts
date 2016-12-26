import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TlAlertComponent } from './tl-alert.component';
import { TlAlertService } from './tl-alert.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlAlertComponent],
  exports: [TlAlertComponent],
})
export class TlAlertModule {
  static withProviders(): ModuleWithProviders {
    return {
      ngModule: TlAlertModule,
      providers: [TlAlertService]
    };
  }
 }
