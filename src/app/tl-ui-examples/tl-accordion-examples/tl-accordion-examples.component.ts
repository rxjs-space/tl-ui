import { Component } from '@angular/core';
import { TlAccordionModel, TlSlideInOutAnimation } from '../../tl-ui';

@Component({
  selector: 'tl-accordion-examples',
  templateUrl: './tl-accordion-examples.component.html',
  styleUrls: ['./tl-accordion-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlAccordionExamplesComponent {
  private accordionModel: TlAccordionModel = {
    panels: [
      {title: '<span>&#9733; <b>Fancy</b> title0 &#9733;</span>', content: 'content0', expanded: true},
      {title: 'title1', content: 'content1'},
      {title: 'title2', content: 'content2', disabled: true},
    ],
    // config: {
    //   expandOneOnly: true,
    //   // showAnimation: true
    // }
  };
}

