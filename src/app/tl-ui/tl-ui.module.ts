import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlUiComponent } from './tl-ui.component';
import { TlModalModule } from './tl-modal';
import { TlAccordionModule } from './tl-accordion';
import { TlNotificationModule } from './tl-notification';
import { TlNotificationComponent } from './tl-notification/tl-notification.component';

export const tlUiModulesArr = [
  TlModalModule,
  TlAccordionModule,
  TlNotificationModule
];

export const tlUiModulesWithProvidersArr = [
  TlModalModule.withProviders(),
  TlAccordionModule.withProviders(),
  TlNotificationModule.withProviders()
];

@NgModule({
  imports: [...tlUiModulesWithProvidersArr],
  exports: tlUiModulesArr
})
export class TlUiModuleWithProviders {}


@NgModule({
  imports: [CommonModule, ...tlUiModulesArr],
  declarations: [TlUiComponent, TlNotificationComponent],
  exports: tlUiModulesArr,
})
export class TlUiModule {
  static withProviders(): ModuleWithProviders {
    return {ngModule: TlUiModuleWithProviders};
  }
}


