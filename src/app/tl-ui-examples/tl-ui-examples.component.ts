import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { examplePaths } from './tl-ui-examples-routing.module';
import { TlDropdownModel } from '../tl-ui';
import { InitialCapPipe } from './+shared/pipes/initial-cap.pipe';

const initialCap = new InitialCapPipe();

@Component({
  selector: 'tl-ui-examples',
  templateUrl: './tl-ui-examples.component.html',
  styleUrls: ['./tl-ui-examples.component.scss']
})
export class TlUiExamplesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  dropdownModel: TlDropdownModel = {
    forNav: true,
    hostClasses: ['nav-item', 'hidden-sm-up'],
    activeAsideClasses: ['nav-link'],
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
    const sub_ = this.dropdownModel.itemSelectedRxx.subscribe(console.log);
    this.subscriptions.push(sub_);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub_ => sub_.unsubscribe());
  }

}
