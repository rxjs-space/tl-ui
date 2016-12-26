import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlUiComponent } from './tl-ui.component';
import { TlModalModule } from './tl-modal';
import { TlAccordionModule } from './tl-accordion';
import { TlAlertModule } from './tl-alert';
import { TlAlertComponent } from './tl-alert/tl-alert.component';

export const tlUiModulesArr = [
  TlModalModule,
  TlAccordionModule,
  TlAlertModule
];

export const tlUiModulesWithProvidersArr = [
  TlModalModule.withProviders(),
  TlAccordionModule.withProviders(),
  TlAlertModule.withProviders()
];

@NgModule({
  imports: [...tlUiModulesWithProvidersArr],
  exports: tlUiModulesArr
})
export class TlUiModuleWithProviders {}


@NgModule({
  imports: [CommonModule, ...tlUiModulesArr],
  declarations: [TlUiComponent, TlAlertComponent],
  exports: tlUiModulesArr,
})
export class TlUiModule {
  static withProviders(): ModuleWithProviders {
    return {ngModule: TlUiModuleWithProviders};
  }
}


