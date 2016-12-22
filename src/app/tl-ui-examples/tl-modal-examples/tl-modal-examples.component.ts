import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { TlModalModel } from '../../tl-ui';

@Component({
  selector: 'tl-modal-examples',
  templateUrl: './tl-modal-examples.component.html',
  styleUrls: ['./tl-modal-examples.component.scss']
})
export class TlModalExamplesComponent {
  modalModel: TlModalModel = {
    content: {
      header: 'Modal Title hoho',
      body: 'body hoho &hellip;',
      cancel: 'cancel hoho',
      save: 'Save hoho'
    },
    showingRxx: new BehaviorSubject(false),
    resultRxx: new Subject(),
    config: {
      switchToSmall: true
    }
  };

}
