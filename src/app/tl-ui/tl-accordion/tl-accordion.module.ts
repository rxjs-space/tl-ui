import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlAccordionComponent } from './tl-accordion.component';
import { TlAccordionConfigService } from './tl-accordion-config.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlAccordionComponent],
  exports: [TlAccordionComponent],
})
export class TlAccordionModule {
  static withProviders(): ModuleWithProviders {
    return {
      ngModule: TlAccordionModule,
      providers: [TlAccordionConfigService]
    }
  }
}
