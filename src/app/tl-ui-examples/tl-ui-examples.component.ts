import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterState, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { examplePaths } from './tl-ui-examples-routing.module';

@Component({
  selector: 'tl-ui-examples',
  templateUrl: './tl-ui-examples.component.html',
  styleUrls: ['./tl-ui-examples.component.scss']
})
export class TlUiExamplesComponent implements OnInit {
  private dropDownHeader: any;
  private dropDownHeaderClickCount: number = 0;
  private urlParts: string[] = [];
  // components to be an array like [{path: 'modal', name: 'Modal'}]
  // name is to be used in the links
  private components: any[] = examplePaths
    .sort((a, b) => {
      if (a.path > b.path) {return 1; }
      if (a.path < b.path) {return -1; }
      return 0;
    });

  constructor(private route: Router) {}



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
    this.route.events
    .filter(e => e instanceof NavigationEnd)
    .map(e => {
      let url = e.url.replace(/[;?].*/, ''); // delete queryParams and optional params
      let arr = url.split('/');
      arr.splice(0, 1);
      return arr;
    })
    .subscribe(arr => {
      this.urlParts = arr;
    });
  }

  clickDropDown(event, obj) {
    event.preventDefault();
    this.dropDownHeader = obj;
  }
}
