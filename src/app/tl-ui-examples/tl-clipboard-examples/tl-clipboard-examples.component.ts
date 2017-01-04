import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation, TlClipboardService } from '../../tl-ui';
@Component({
  selector: 'tl-clipboard-examples',
  templateUrl: './tl-clipboard-examples.component.html',
  styleUrls: ['./tl-clipboard-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlClipboardExamplesComponent implements OnInit {
  codeExample = `@Component({
  selector: 'tl-clipboard-examples',
  templateUrl: './tl-clipboard-examples.component.html',
  styleUrls: ['./tl-clipboard-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})`;
  constructor(private clipboard: TlClipboardService) { }

  ngOnInit() {
  }

  copy(element: any) {
    this.clipboard.copy(element);
  }

  log(event) {
    console.log(event);
  }

}
