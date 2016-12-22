import { Injectable } from '@angular/core';
import { TlModalConfigForService } from './tl-modal.interface';
@Injectable()
export class TlModalConfigService implements TlModalConfigForService {
  switchToSmall = true;
  showAnimation = true;
}
