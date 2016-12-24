import { Component, OnInit, Input, Optional } from '@angular/core';
import { TlModalModel, TlModalResult } from './tl-modal.interface';
import { TlModalConfigService } from './tl-modal-config.service';
import { accordionAnimations } from './tl-modal.component.animation';
import * as util from '../+shared/util';

@Component({
  selector: 'tl-modal',
  template: `
  <ng-container *ngIf="modalModel.config.showAnimation && modalModel.showingRxx | async">

    <div [@modalBackdropState]
      class="modal-backdrop fade in" 
    ></div>

    <div [@modalDialogState]
      role="dialog" class="modal" style="display: block" (click)="onClose({didConfirm: false, method: 'backdrop'})"
    >
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
  </ng-container>

  <ng-container *ngIf="!modalModel.config.showAnimation && modalModel.showingRxx | async">

    <div 
      class="modal-backdrop fade in" 
    ></div>

    <div
      role="dialog" class="modal" style="display: block" (click)="onClose({didConfirm: false, method: 'backdrop'})"
    >
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
  </ng-container>`,
  styles: [],
  changeDetection: 0,
  animations: accordionAnimations
})
export class TlModalComponent implements OnInit {
  @Input() modalModel: TlModalModel;
  constructor(@Optional() private configService: TlModalConfigService) {
    if (util.isNull(this.configService)) {
      this.configService = new TlModalConfigService();
    }
  }

  ngOnInit() {
    if (util.isNullOrUndefined(this.modalModel.config)) {
      this.modalModel.config = this.configService;
    } else {
      if (util.isNullOrUndefined(this.modalModel.config.showAnimation)) {
        this.modalModel.config.showAnimation = this.configService.showAnimation;
      }
      if (util.isNullOrUndefined(this.modalModel.config.switchToSmall)) {
        this.modalModel.config.switchToSmall = this.configService.switchToSmall;
      }
    }
  }

  onClose(modalResult: TlModalResult) {
    this.modalModel.showingRxx.next(false);
    this.modalModel.resultRxx.next(modalResult);
  }

}
