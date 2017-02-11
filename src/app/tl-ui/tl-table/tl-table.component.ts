import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tl-table',
  templateUrl: './tl-table.component.html',
  styleUrls: ['./tl-table.component.scss']
})
export class TlTableComponent implements OnInit {
  @Input() data = [
    {name: 'x', value: 1},
    {name: 'y', value: 0}
  ]
  @Input() config: {headers: any[]};
  constructor() { }

  ngOnInit() {
    console.log('init');
    if (!this.config) { 
      // if no config object set
      this.config = {headers: null};
      console.log(Object.keys(this.data));
    } else {
      // if the config object is set
      // but the config.headers is not set
      if (!this.config.headers) {
        console.log(Object.keys(this.data));
        this.config.headers = [];
      }
    }
  }

}
