import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlUiComponent } from './tl-ui.component';
import { TlModalModule } from './tl-modal';
import { TlAccordionModule } from './tl-accordion';

export const tlUiModules = [
  TlModalModule,
  TlAccordionModule
];

export const tlUiModulesWithProviders = [
  TlModalModule.withProviders(),
  TlAccordionModule.withProviders()
];

@NgModule({
  imports: [CommonModule, ...tlUiModulesWithProviders],
  exports: tlUiModules
})
export class TlUiModuleWithProviders {}


@NgModule({
  imports: [CommonModule, ...tlUiModules],
  declarations: [TlUiComponent],
  exports: tlUiModules,
})
export class TlUiModule {
  static withProviders(): ModuleWithProviders {
    return {ngModule: TlUiModuleWithProviders};
  }
}


