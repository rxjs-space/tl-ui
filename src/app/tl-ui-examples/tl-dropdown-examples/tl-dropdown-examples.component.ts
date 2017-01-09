import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TlDropdownModel, TlSlideInOutAnimation } from '../../tl-ui';
import { examplePaths } from '../tl-ui-examples-routing.module';
@Component({
  selector: 'tl-dropdown-examples',
  templateUrl: './tl-dropdown-examples.component.html',
  styleUrls: ['./tl-dropdown-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})
export class TlDropdownExamplesComponent implements OnInit {

  dropdownModel: TlDropdownModel = {
    toggler: {name: 'Group', classes: ['btn', 'btn-outline-primary']},
    items: [{name: 'Item1'}, {name: 'Item2'}],
    itemSelectedRxx: new BehaviorSubject(null)
  };

  constructor() { }

  ngOnInit() {
  }

}
