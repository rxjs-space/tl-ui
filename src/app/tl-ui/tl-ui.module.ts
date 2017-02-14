import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlUiComponent } from './tl-ui.component';
import { TlModalModule } from './tl-modal';
import { TlAccordionModule } from './tl-accordion';
import { TlNotificationModule } from './tl-notification';
import { TlDropdownModule } from './tl-dropdown';
import { TlNoTagModule } from './tl-no-tag';
import { TlClipboardModule } from './tl-clipboard';
import { TlNavbarModule } from './tl-navbar';
import { TlDropdownNavModule } from './tl-dropdown-nav';
import { TlMediaQueryModule } from './tl-media-query';
import { TlModalA6Module } from './tl-modal-a6';
import { TlCarouselModule } from './tl-carousel';
import { TlGesturesModule } from './tl-gestures';
import { TlTableModule } from './tl-table';
import { TlGestures2Module } from './tl-gestures2';

export const tlUiModulesArr = [
  TlModalModule,
  TlAccordionModule,
  TlNotificationModule,
  TlDropdownModule,
  TlNoTagModule,
  TlClipboardModule,
  TlNavbarModule,
  TlDropdownNavModule,
  TlMediaQueryModule,
  TlModalA6Module,
  TlCarouselModule,
  TlGesturesModule,
  TlTableModule,
  TlGestures2Module
];

export const tlUiModulesWithProvidersArr = [
  TlModalModule.withProviders(),
  TlAccordionModule.withProviders(),
  TlNotificationModule.withProviders(),
  TlDropdownModule.withProviders(),
  TlNoTagModule,
  TlClipboardModule,
  TlNavbarModule,
  TlDropdownNavModule,
  TlMediaQueryModule,
  TlModalA6Module,
  TlCarouselModule,
  TlGesturesModule,
  TlTableModule,
  TlGestures2Module
];

@NgModule({
  imports: [...tlUiModulesWithProvidersArr],
  exports: tlUiModulesArr
})
export class TlUiModuleWithProviders {}


@NgModule({
  imports: [CommonModule, ...tlUiModulesArr],
  declarations: [TlUiComponent],
  exports: tlUiModulesArr,
})
export class TlUiModule {
  static withProviders(): ModuleWithProviders {
    return {ngModule: TlUiModuleWithProviders};
  }
}


