import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface TlModalOutput {
  didConfirm: boolean;
  clickedOn: 'x' | 'backdrop' | 'save' | 'cancel';
}

export interface TlModalInput {
  content: {
    header: string;
    body: string;
    footer: string;
    cancel: string;
    save?: string;
  };
  showingRxx: BehaviorSubject<boolean>;
  config?: string;
}