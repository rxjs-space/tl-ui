import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TlModalComponent } from './tl-modal.component';
import { TlModalConfigService } from './tl-modal-config.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TlModalComponent],
  exports: [TlModalComponent]
})
export class TlModalModule {
  static withProviders(): ModuleWithProviders {
    return {
      ngModule: TlModalModule,
      providers: [TlModalConfigService]
    };
  }
}
