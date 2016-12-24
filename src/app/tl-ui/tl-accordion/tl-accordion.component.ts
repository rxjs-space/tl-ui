import { Component, OnInit, Input, Optional} from '@angular/core';
import { TlAccordionConfigService } from './tl-accordion-config.service';
import { TlAccordionModel, TlAccordionPanel } from './tl-accordion.interface';
import { accordinAnimations } from './tl-accordion.component.animation';
import * as util from '../+shared/util';
@Component({
  selector: 'tl-accordion',
  template: `
    <div class="card" *ngIf="panels.length === 0">
      <div class="card-header">No panels provided.</div>
    </div>
    <div class="card" *ngIf="panels.length > 0">

      <!--<template ngFor let-panel [ngForOf]="panels">-->
      <ng-container *ngFor="let panel of panels">

        <a href role="tab" class="card-header" 
          [style.display]="'block'"
          [innerHTML]="panel.title"
          (click)="onTitleClick($event, panel)"
          [class.text-muted]="panel.disabled"
        ></a>

        <div *ngIf="!panel.disabled && showAnimation"
          role="tablpanel" class="card-block" 
          [innerHTML]="panel.content" 
          [@panelContentState]="panel.expanded ? 'expanded' : 'collapsed'"
        ></div>

        <div *ngIf="!panel.disabled && !showAnimation"
          role="tablpanel" class="card-block" 
          [innerHTML]="panel.content" 
          [style.display]="panel.expanded ? null : 'none'"
        ></div>
        
      </ng-container>  
      <!--</template>-->
    </div>
  `,
  styles: [],
  changeDetection: 0,
  animations: accordinAnimations
})
export class TlAccordionComponent implements OnInit {
  @Input() accordionModel: TlAccordionModel;
  private panels: TlAccordionPanel[];
  private expandOneOnly: boolean;
  private showAnimation: boolean;
  private lastExpandedPanel: TlAccordionPanel;
  constructor(@Optional() private configService: TlAccordionConfigService) {
    if (util.isNull(this.configService)) { // if no such provider, will 'new' one here.
      this.configService = new TlAccordionConfigService();
    }
  }

  ngOnInit() {
    // init expandOneOnly, showAnimation
    if (util.isNullOrUndefined(this.accordionModel.config)) {
      this.expandOneOnly = this.configService.expandOneOnly;
      this.showAnimation = this.configService.showAnimation;
    } else {
      if (util.isNullOrUndefined(this.accordionModel.config.expandOneOnly)) {
        this.expandOneOnly = this.configService.expandOneOnly;
      } else { this.expandOneOnly = this.accordionModel.config.expandOneOnly; }
      if (util.isNullOrUndefined(this.accordionModel.config.showAnimation)) {
        this.showAnimation = this.configService.showAnimation;
      } else { this.showAnimation = this.accordionModel.config.showAnimation; }
    }

    // init lastExpandedPanel
    if (this.accordionModel.panels.length > 0) {
      this.panels = this.accordionModel.panels;
      const lastExpandedPanels = this.panels.filter(panel => panel.expanded);
      this.lastExpandedPanel = lastExpandedPanels[0];
    } else {
      this.panels = [];
    }
  }

  onTitleClick(event: any, panel: TlAccordionPanel) {
    if (typeof event !== 'undefined' && event.preventDefault) {
      event.preventDefault();
    }
    if (!panel.disabled) {
      panel.expanded = !panel.expanded;
      // in case of allowing expandOneOnly, hide other panels
      if (this.lastExpandedPanel !== panel && this.expandOneOnly) {
        this.lastExpandedPanel.expanded = false;
        this.lastExpandedPanel = panel;
      }
    }
  }

}
