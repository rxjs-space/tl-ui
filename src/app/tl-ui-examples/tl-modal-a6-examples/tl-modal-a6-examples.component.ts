import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TlSlideInOutAnimation } from '../../tl-ui';
@Component({
  selector: 'tl-modal-a6-examples',
  templateUrl: './tl-modal-a6-examples.component.html',
  styleUrls: ['./tl-modal-a6-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlModalA6ExamplesComponent implements OnInit {
  modalModel = {
    showRxx: new BehaviorSubject(false),
  };

  constructor() { }

  ngOnInit() { }

}
