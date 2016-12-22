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
var core_1 = require('@angular/core');
var TlModalComponent = (function () {
    function TlModalComponent() {
    }
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
            template: "<div *ngIf=\"(modalModel.showingRxx | async)\">\n\n  <div class=\"modal-backdrop fade in\" ></div>\n\n  <div role=\"\" class=\"modal\" style=\"display: block\" (click)=\"onClose({didConfirm: false, method: 'backdrop'})\">\n    <div class=\"modal-dialog\" role=\"document\" \n      [class.modal-sm]=\"modalModel.config.switchToSmall\" \n      (click)=\"$event.stopPropagation();\"\n    >\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"onClose({didConfirm: false, method: 'x'})\">\n            <span aria-hidden=\"true\">&times;</span>\n          </button>\n          <h4 class=\"modal-title\" [innerHTML]=\"modalModel.content.header\"></h4>\n        </div>\n        <div class=\"modal-body\" [innerHTML]=\"modalModel.content.body\">\n        </div>\n        <div class=\"modal-footer\">\n          <button type=\"button\" class=\"btn btn-secondary\" (click)=\"onClose({didConfirm: false, method: 'cancel'})\"\n            [innerHTML]=\"modalModel.content.cancel\"\n            *ngIf=\"modalModel.content.cancel\"\n          ></button>\n          <button type=\"button\" class=\"btn btn-primary\" (click)=\"onClose({didConfirm: true, method: 'save'})\"\n            [innerHTML]=\"modalModel.content.save\"\n            *ngIf=\"modalModel.content.save\"\n          ></button>\n        </div>\n      </div><!-- /.modal-content -->\n    </div><!-- /.modal-dialog -->\n  </div><!-- /.modal -->\n\n</div>",
            styleUrls: [],
            changeDetection: 0
        }), 
        __metadata('design:paramtypes', [])
    ], TlModalComponent);
    return TlModalComponent;
}());
exports.TlModalComponent = TlModalComponent;
