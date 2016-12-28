import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TlNotificationComponent } from './tl-notification.component';
import { TlNotificationActionService } from './tl-notification-action.service';

// config service is excluded, because there's only one tl-notification instance, we can config it with input property

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlNotificationComponent],
  exports: [TlNotificationComponent],
  providers: [TlNotificationActionService] // provide action service here, so we can show notifications no matter .withProviders is called or not
})
export class TlNotificationModule {
  static withProviders(): ModuleWithProviders {
    return {
      ngModule: TlNotificationModule,
      providers: []
    };
  }
 }
