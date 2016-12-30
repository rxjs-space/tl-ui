import { Component, OnInit, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { examplePaths } from './tl-ui-examples-routing.module';
import { TlDropdownModel } from '../tl-ui';
import { InitialCapPipe } from './+shared/pipes/initial-cap.pipe';

const initialCap = new InitialCapPipe();

@Component({
  selector: 'tl-ui-examples',
  templateUrl: './tl-ui-examples.component.html',
  styleUrls: ['./tl-ui-examples.component.scss']
})
export class TlUiExamplesComponent implements OnInit {
  dropdownModel: TlDropdownModel = {
    forNav: true,
    hostClasses: ['nav-item', 'hidden-sm-up'],
    toggler: {name: 'Components', path: 'components', classes: ['nav-link']},
    items: examplePaths
      .sort((a, b) => {
        if (a.path > b.path) {return 1; }
        if (a.path < b.path) {return -1; }
        return 0;
      })
      .map(e => ({name: initialCap.transform(e.path), path: e.path})),
    itemSelectedRxx: new Subject()
  };



  constructor() {}


  ngOnInit() {
  }


}
