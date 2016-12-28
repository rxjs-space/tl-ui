import { Component, OnInit, HostListener } from '@angular/core';
import { examplePaths } from './tl-ui-examples-routing.module';

@Component({
  selector: 'tl-ui-examples',
  templateUrl: './tl-ui-examples.component.html',
  styleUrls: ['./tl-ui-examples.component.scss']
})
export class TlUiExamplesComponent implements OnInit {
  private dropDownHeader: any;
  private dropDownHeaderClickCount: number = 0;
  // components to be an array like [{path: 'modal', name: 'Modal'}]
  // name is to be used in the links
  private components: any[] = examplePaths
    .sort((a, b) => {
      if (a.path > b.path) {return 1; }
      if (a.path < b.path) {return -1; }
      return 0;
    })
    .map(e => ({
      path: e.path, name: e.path[0].toUpperCase() + e.path.substr(1, e.path.length - 1)
    }));

  constructor() { }

  @HostListener('document:click') onHostClick() {
    if (this.dropDownHeader) {
      this.dropDownHeaderClickCount++;
      if (this.dropDownHeaderClickCount > 1) {
        this.dropDownHeader.open = false;
        this.dropDownHeader = null;
        this.dropDownHeaderClickCount = 0;
      }
    }
  }

  ngOnInit() {
  }

  clickDropDown(event, obj) {
    event.preventDefault();
    this.dropDownHeader = obj;
  }
}
