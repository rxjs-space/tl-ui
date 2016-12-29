import { Component, OnInit } from '@angular/core';
import { TlDropdownModel, TlDropdownThing } from '../../tl-ui';
import { examplePaths } from '../tl-ui-examples-routing.module';
@Component({
  selector: 'tl-dropdown-examples',
  templateUrl: './tl-dropdown-examples.component.html',
  styleUrls: ['./tl-dropdown-examples.component.scss']
})
export class TlDropdownExamplesComponent implements OnInit {
  dropdownModel: TlDropdownModel = {
    hostClasses: ['nav-item', 'hidden-sm-up'],
    toggler: {name: 'Components', path: 'components', classes: ['nav-link']},
    items: examplePaths
      .sort((a, b) => {
        if (a.path > b.path) {return 1; }
        if (a.path < b.path) {return -1; }
        return 0;
      })
      .map(e => ({name: e.path, path: e.path})),
    showActiveAside: true
  };

  constructor() { }

  ngOnInit() {
  }

}
