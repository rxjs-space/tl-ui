"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var tl_modal_config_service_1 = require('./tl-modal-config.service');
var tl_modal_component_animation_1 = require('./tl-modal.component.animation');
var util = require('../_shared/util');
var TlModalComponent = (function () {
    function TlModalComponent(configService) {
        this.configService = configService;
        if (util.isNull(this.configService)) {
            this.configService = new tl_modal_config_service_1.TlModalConfigService();
        }
    }
    TlModalComponent.prototype.ngOnInit = function () {
        if (util.isNullOrUndefined(this.modalModel.config)) {
            this.modalModel.config = this.configService;
        }
        else {
            if (util.isNullOrUndefined(this.modalModel.config.showAnimation)) {
                this.modalModel.config.showAnimation = this.configService.showAnimation;
            }
            if (util.isNullOrUndefined(this.modalModel.config.switchToSmall)) {
                this.modalModel.config.switchToSmall = this.configService.switchToSmall;
            }
        }
    };
    TlModalComponent.prototype.onClose = function (modalResult) {
        this.modalModel.showingRxx.next(false);
        this.modalModel.resultRxx.next(modalResult);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TlModalComponent.prototype, "modalModel", void 0);
    TlModalComponent = __decorate([
        core_1.Component({
            selector: 'tl-modal',
            template: "\n  <ng-container *ngIf=\"modalModel.config.showAnimation && modalModel.showingRxx | async\">\n\n    <div [@modalBackdropState]\n      class=\"modal-backdrop fade in\" \n    ></div>\n\n    <div [@modalDialogState]\n      role=\"dialog\" class=\"modal\" style=\"display: block\" (click)=\"onClose({didConfirm: false, method: 'backdrop'})\"\n    >\n      <div class=\"modal-dialog\" role=\"document\" \n        [class.modal-sm]=\"modalModel.config.switchToSmall\" \n        (click)=\"$event.stopPropagation();\"\n      >\n        <div class=\"modal-content\">\n          <div class=\"modal-header\">\n            <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"onClose({didConfirm: false, method: 'x'})\">\n              <span aria-hidden=\"true\">&times;</span>\n            </button>\n            <h4 class=\"modal-title\" [innerHTML]=\"modalModel.content.header\"></h4>\n          </div>\n          <div class=\"modal-body\" [innerHTML]=\"modalModel.content.body\">\n          </div>\n          <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-secondary\" (click)=\"onClose({didConfirm: false, method: 'cancel'})\"\n              [innerHTML]=\"modalModel.content.cancel\"\n              *ngIf=\"modalModel.content.cancel\"\n            ></button>\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"onClose({didConfirm: true, method: 'save'})\"\n              [innerHTML]=\"modalModel.content.save\"\n              *ngIf=\"modalModel.content.save\"\n            ></button>\n          </div>\n        </div><!-- /.modal-content -->\n      </div><!-- /.modal-dialog -->\n    </div><!-- /.modal -->\n  </ng-container>\n\n  <ng-container *ngIf=\"!modalModel.config.showAnimation && modalModel.showingRxx | async\">\n\n    <div \n      class=\"modal-backdrop fade in\" \n    ></div>\n\n    <div\n      role=\"dialog\" class=\"modal\" style=\"display: block\" (click)=\"onClose({didConfirm: false, method: 'backdrop'})\"\n    >\n      <div class=\"modal-dialog\" role=\"document\" \n        [class.modal-sm]=\"modalModel.config.switchToSmall\" \n        (click)=\"$event.stopPropagation();\"\n      >\n        <div class=\"modal-content\">\n          <div class=\"modal-header\">\n            <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"onClose({didConfirm: false, method: 'x'})\">\n              <span aria-hidden=\"true\">&times;</span>\n            </button>\n            <h4 class=\"modal-title\" [innerHTML]=\"modalModel.content.header\"></h4>\n          </div>\n          <div class=\"modal-body\" [innerHTML]=\"modalModel.content.body\">\n          </div>\n          <div class=\"modal-footer\">\n            <button type=\"button\" class=\"btn btn-secondary\" (click)=\"onClose({didConfirm: false, method: 'cancel'})\"\n              [innerHTML]=\"modalModel.content.cancel\"\n              *ngIf=\"modalModel.content.cancel\"\n            ></button>\n            <button type=\"button\" class=\"btn btn-primary\" (click)=\"onClose({didConfirm: true, method: 'save'})\"\n              [innerHTML]=\"modalModel.content.save\"\n              *ngIf=\"modalModel.content.save\"\n            ></button>\n          </div>\n        </div><!-- /.modal-content -->\n      </div><!-- /.modal-dialog -->\n    </div><!-- /.modal -->\n  </ng-container>",
            styles: [],
            changeDetection: 0,
            animations: tl_modal_component_animation_1.accordionAnimations
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [tl_modal_config_service_1.TlModalConfigService])
    ], TlModalComponent);
    return TlModalComponent;
}());
exports.TlModalComponent = TlModalComponent;
