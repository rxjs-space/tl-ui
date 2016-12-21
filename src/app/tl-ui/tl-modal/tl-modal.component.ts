import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TlModalInput, TlModalOutput } from './tl-modal.interface';
@Component({
  selector: 'tl-modal',
  templateUrl: './tl-modal.component.html',
  styleUrls: ['./tl-modal.component.scss']
})
export class TlModalComponent implements OnInit {
  @Input() modalInput: TlModalInput;
  @Output() private modalOutput: EventEmitter<TlModalOutput> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onClickAll(modalOutput: TlModalOutput) {
    this.modalInput.showingRxx.next(false);
    this.modalOutput.emit(modalOutput)
  }


}
