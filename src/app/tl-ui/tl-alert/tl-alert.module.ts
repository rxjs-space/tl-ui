import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TlAlertComponent } from './tl-alert.component';
import { TlAlertActionService } from './tl-alert-action.service';

// config service is excluded, because there's only one tl-alert instance, we can config it with input property

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlAlertComponent],
  exports: [TlAlertComponent],
  providers: [TlAlertActionService] // provide action service here, so we can show alerts no matter .withProviders is called or not
})
export class TlAlertModule {
  static withProviders(): ModuleWithProviders {
    return {
      ngModule: TlAlertModule,
      providers: []
    };
  }
 }
