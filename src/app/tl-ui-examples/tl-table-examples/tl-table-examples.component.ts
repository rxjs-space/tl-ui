import { Component, OnInit } from '@angular/core';
import { TlSlideInOutAnimation } from '../../tl-ui';

@Component({
  selector: 'tl-table-examples',
  templateUrl: './tl-table-examples.component.html',
  styleUrls: ['./tl-table-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlTableExamplesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
