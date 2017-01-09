import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { examplePaths } from './tl-ui-examples-routing.module';
import { TlNavbarModel } from '../tl-ui';
import { InitialCapPipe } from './+shared/pipes/initial-cap.pipe';

const initialCap = new InitialCapPipe();

@Component({
  selector: 'tl-ui-examples',
  templateUrl: './tl-ui-examples.component.html',
  styleUrls: ['./tl-ui-examples.component.scss']
})
export class TlUiExamplesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  navbarModel: TlNavbarModel = {
    brand: 'TL-UI',
    routes: [
      { name: 'Home', rl: '/', rla: 'active', rlao: {exact: true} },
      { name: 'Components', rl: '/components', rla: 'active',
        children:
          examplePaths
            .sort((a, b) => {
              if (a.path > b.path) {return 1; }
              if (a.path < b.path) {return -1; }
              return 0;
            })
            .map(e => ({
              name: initialCap.transform(e.path),
              rl: '/components/' + e.path,
              rla: 'active'
            }))
        // [
        //   { name: 'Accordion', rl: '/components/accordion', rla: 'active'},
        //   { name: 'Clipboard', rl: '/components/clipboard', rla: 'active'}
        // ]
      }
    ]
  };



  constructor() {}


  ngOnInit() {
    // const sub_ = this.dropdownModel.itemSelectedRxx.subscribe(console.log);
    // this.subscriptions.push(sub_);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub_ => sub_.unsubscribe());
  }

}
