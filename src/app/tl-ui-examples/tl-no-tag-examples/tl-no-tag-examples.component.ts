import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation } from '../../tl-ui';
@Component({
  selector: 'tl-no-tag-examples',
  templateUrl: './tl-no-tag-examples.component.html',
  styleUrls: ['./tl-no-tag-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlNoTagExamplesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
