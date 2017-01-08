import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'tl-navbar',
  templateUrl: './tl-navbar.component.html',
  styleUrls: ['./tl-navbar.component.scss']
})
export class TlNavbarComponent implements OnInit {
  show: Boolean = false;
  model = {
    brand: 'TL-UI',
    routes: [
      { name: 'Home', rl: '/', rla: 'active', rlao: {exact: true} },
      { name: 'Components', rl: '/components', rla: 'active', children: [
        { name: 'Accordion', rl: '/components/accordion', rla: 'active'},
        { name: 'Clipboard', rl: '/components/clipboard', rla: 'active'}
      ] }
    ]
  }
  constructor() { }

  ngOnInit() {
  }

  clickOnToggle(event) {
    event.stopPropagation();
    this.show = !this.show;
  }

  @HostListener('document:click') onHostClick() {
    if (this.show) {
      this.show = false;
    }
  }

}
