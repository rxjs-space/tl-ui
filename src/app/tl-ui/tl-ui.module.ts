import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlUiComponent } from './tl-ui.component';
import { TlModalModule } from './tl-modal';
import { TlAccordionModule } from './tl-accordion';

const tlUiModules = [
  TlModalModule,
  TlAccordionModule
];

const tlUiModulesWithProviders = tlUiModules.map(m => m.withProviders());

@NgModule({
  imports: [CommonModule, ...tlUiModulesWithProviders],
  exports: tlUiModules
})
class TlUiModuleWithProviders {}


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


