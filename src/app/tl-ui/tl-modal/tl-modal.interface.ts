import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

export interface TlModalResult {
  didConfirm: boolean;
  method: 'x' | 'backdrop' | 'save' | 'cancel' | 'esc';
}

export interface TlModalConfig {
  switchToSmall?: boolean;
  showAnimation?: boolean;
}

export interface TlModalConfigForService {
  switchToSmall: boolean;
  showAnimation: boolean;
}

export interface TlModalShowingEvent {
  showing: boolean;
  triggerEvent?: any;
}

export interface TlModalModel {
  content: {
    header: string;
    body: string;
    cancel?: string;
    save?: string;
  };
  showingRxx: BehaviorSubject<TlModalShowingEvent>;
  resultRxx: Subject<TlModalResult>;
  config?: TlModalConfig;
}
