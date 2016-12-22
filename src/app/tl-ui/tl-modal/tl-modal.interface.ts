import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

export interface TlModalResult {
  didConfirm: boolean;
  method: 'x' | 'backdrop' | 'save' | 'cancel';
}

export interface TlModalConfig {
  switchToSmall?: boolean;
  showAnimation?: boolean;
}

export interface TlModalConfigForService {
  switchToSmall: boolean;
  showAnimation: boolean;
}

export interface TlModalModel {
  content: {
    header: string;
    body: string;
    cancel?: string;
    save?: string;
  };
  showingRxx: BehaviorSubject<boolean>;
  resultRxx: Subject<TlModalResult>;
  config?: TlModalConfig;
}
