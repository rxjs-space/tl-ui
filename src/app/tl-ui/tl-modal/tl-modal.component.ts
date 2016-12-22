import { Component, Input } from '@angular/core';
import { TlModalModel, TlModalResult } from './tl-modal.interface';
@Component({
  selector: 'tl-modal',
  template: `<div *ngIf="(modalModel.showingRxx | async)">

  <div class="modal-backdrop fade in" ></div>

  <div role="dialog" class="modal" style="display: block" (click)="onClose({didConfirm: false, method: 'backdrop'})">
    <div class="modal-dialog" role="document" 
      [class.modal-sm]="modalModel.config.switchToSmall" 
      (click)="$event.stopPropagation();"
    >
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" aria-label="Close" (click)="onClose({didConfirm: false, method: 'x'})">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title" [innerHTML]="modalModel.content.header"></h4>
        </div>
        <div class="modal-body" [innerHTML]="modalModel.content.body">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" (click)="onClose({didConfirm: false, method: 'cancel'})"
            [innerHTML]="modalModel.content.cancel"
            *ngIf="modalModel.content.cancel"
          ></button>
          <button type="button" class="btn btn-primary" (click)="onClose({didConfirm: true, method: 'save'})"
            [innerHTML]="modalModel.content.save"
            *ngIf="modalModel.content.save"
          ></button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->

</div>`,
  styles: [],
  changeDetection: 0
})
export class TlModalComponent {
  @Input() modalModel: TlModalModel;

  onClose(modalResult: TlModalResult) {
    this.modalModel.showingRxx.next(false);
    this.modalModel.resultRxx.next(modalResult);
  }

}
