import {Component, OnInit, OnDestroy, Input, Optional,
  HostBinding, HostListener, ElementRef, Renderer } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { TlModalModel, TlModalResult } from './tl-modal.interface';
import { TlModalConfigService } from './tl-modal-config.service';
import { accordionAnimations } from './tl-modal.component.animation';
import * as util from '../+shared/util';

@Component({
  selector: 'tl-modal',
  template: `
  <ng-container *ngIf="modalModel.config.showAnimation && (modalModel.showingRxx | async).showing">

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

  <ng-container *ngIf="!modalModel.config.showAnimation && (modalModel.showingRxx | async).showing">

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
export class TlModalComponent implements OnInit, OnDestroy {
  @Input() modalModel: TlModalModel;
  @HostBinding('attr.tabindex') private tabindex = -1; // so we can do el.focus() on tl-modal element

  private triggerEl: any;
  private subscriptions_: Subscription[] = [];

  constructor(
    @Optional() private configService: TlModalConfigService,
    private el: ElementRef, private renderer: Renderer
  ) {
    if (util.isNull(this.configService)) { // if configService was not injected
      this.configService = new TlModalConfigService();
    }
  }

  @HostListener('keyup.esc') private exitOnEscKeyUp() {
    this.onClose({didConfirm: false, method: 'esc'})
  }

  ngOnInit() {
    // focus on tl-modal when triggered
    let subShow_ = this.modalModel.showingRxx
      .filter(s => s.showing)
      .subscribe((s) => {
        this.renderer.invokeElementMethod(this.el.nativeElement, 'focus', []);
        this.triggerEl = s.triggerEvent.target; // is this op cross-platform compatible?
      });
    this.subscriptions_.push(subShow_);

    // resume focus to triggerElement when tl-modal closed
    let subHide = this.modalModel.showingRxx
      .filter(s => !s.showing)
      .subscribe(() => {
        if (this.triggerEl) {
          this.renderer.invokeElementMethod(this.triggerEl, 'focus', []);
          this.triggerEl = null;
        }
      });
    this.subscriptions_.push(subHide);

    // init config
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
    this.modalModel.showingRxx.next({showing: false});
    this.modalModel.resultRxx.next(modalResult);
  }

  ngOnDestroy() {
    this.subscriptions_.forEach(sub_ => sub_.unsubscribe());
  }

}
