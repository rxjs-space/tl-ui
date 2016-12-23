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
var common_1 = require('@angular/common');
var tl_ui_component_1 = require('./tl-ui.component');
var tl_modal_1 = require('./tl-modal');
var tl_accordion_1 = require('./tl-accordion');
var tlUiModules = [
    tl_modal_1.TlModalModule,
    tl_accordion_1.TlAccordionModule
];
var tlUiModulesWithProviders = tlUiModules.map(function (m) { return m.withProviders(); });
var TlUiModuleWithProviders = (function () {
    function TlUiModuleWithProviders() {
    }
    TlUiModuleWithProviders = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule].concat(tlUiModulesWithProviders),
            exports: tlUiModules
        }), 
        __metadata('design:paramtypes', [])
    ], TlUiModuleWithProviders);
    return TlUiModuleWithProviders;
}());
var TlUiModule = (function () {
    function TlUiModule() {
    }
    TlUiModule.withProviders = function () {
        return { ngModule: TlUiModuleWithProviders };
    };
    TlUiModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule].concat(tlUiModules),
            declarations: [tl_ui_component_1.TlUiComponent],
            exports: tlUiModules,
        }), 
        __metadata('design:paramtypes', [])
    ], TlUiModule);
    return TlUiModule;
}());
exports.TlUiModule = TlUiModule;
