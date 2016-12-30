import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
@Component({
  selector: 'tl-no-tag',
  template: `
    <template #tmp>
      <p>{{value}}</p>
      <p>{{rxx | async}}</p>
    </template>`,
  styleUrls: []
})
export class TlNoTagComponent {
  @ViewChild('tmp') tmp: any;
  value = 100;
  rxx = Observable.interval(500);
}
