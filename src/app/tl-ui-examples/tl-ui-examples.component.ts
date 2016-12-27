import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'tl-ui-examples',
  templateUrl: './tl-ui-examples.component.html',
  styleUrls: ['./tl-ui-examples.component.scss']
})
export class TlUiExamplesComponent implements OnInit {
  private dropDownHeader: any;
  private dropDownHeaderClickCount: number = 0;
  private components: any[] = [
    {path: 'accordion', name: 'Accordion'},
    {path: 'alert', name: 'Alert'},
    {path: 'modal', name: 'Modal'},
  ]
  constructor() { }

  @HostListener('document:click') onHostClick() {
    if(this.dropDownHeader) {
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
