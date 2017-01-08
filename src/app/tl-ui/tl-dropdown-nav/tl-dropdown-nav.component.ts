import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'tl-dropdown-nav',
  templateUrl: './tl-dropdown-nav.component.html',
  styleUrls: ['./tl-dropdown-nav.component.scss']
})
export class TlDropdownNavComponent implements OnInit {
  show: Boolean = false;
  @Input() model: any;
  @Output() select = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  clickOnToggler(event) {
    event.stopPropagation();
    event.preventDefault();
    this.show = !this.show;
  }
  clickOnItem(item) {
    // this.show = false; 
    this.select.emit(item);
  }

}
