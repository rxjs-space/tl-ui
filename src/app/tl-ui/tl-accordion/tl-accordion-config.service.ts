import { Injectable } from '@angular/core';
import { TlAccordionConfigForService } from './tl-accordion.interface';
@Injectable()
export class TlAccordionConfigService implements TlAccordionConfigForService {
  expandOneOnly = true;
  showAnimation = true;
}
