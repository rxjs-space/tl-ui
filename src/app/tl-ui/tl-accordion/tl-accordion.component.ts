import { Component, OnInit, Input, Optional} from '@angular/core';
import { TlAccordionConfigService } from './tl-accordion-config.service';
import { TlAccordionModel, TlAccordionPanel } from './tl-accordion.interface';
import { accordinAnimations } from './tl-accordion.component.animation';
@Component({
  selector: 'tl-accordion',
  templateUrl: './tl-accordion.component.html',
  styleUrls: ['./tl-accordion.component.scss'],
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
    if (!this.configService) { // if no such provider, will 'new' one here.
      this.configService = new TlAccordionConfigService();
    }
  }

  ngOnInit() {
    // init expandOneOnly, showAnimation
    if (typeof this.accordionModel.config === 'undefined') {
      this.expandOneOnly = this.configService.expandOneOnly;
      this.showAnimation = this.configService.showAnimation;
    } else {
      if (typeof this.accordionModel.config.expandOneOnly === 'undefined') {
        this.expandOneOnly = this.configService.expandOneOnly;
      } else { this.expandOneOnly = this.accordionModel.config.expandOneOnly; }
      if (typeof this.accordionModel.config.showAnimation === 'undefined') {
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
