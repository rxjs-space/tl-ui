import { Component, HostBinding, HostListener,
  Input, OnInit,
  Renderer, ElementRef
 } from '@angular/core';

import { TlDropdownModel } from './tl-dropdown.interface';

@Component({
  selector: 'tl-dropdown',
  templateUrl: './tl-dropdown.component.html',
  styleUrls: ['./tl-dropdown.component.scss']
})
export class TlDropdownComponent implements OnInit {

  @Input() dropdownModel: TlDropdownModel;
  @HostBinding('class.open') open: boolean = false;

  constructor(
    private renderer: Renderer,
    private el: ElementRef
  ) { }

  ngOnInit() {
    // add 'dropdown' class to host el
    const hostClasses = ['dropdown'].concat(this.dropdownModel.hostClasses);
    hostClasses.forEach(c => {
      this.renderer.setElementClass(this.el.nativeElement, c, true);
    });

  }

  clickOnToggler(event) {
    event.preventDefault();
    event.stopPropagation(); // to work with @HostListener('document:click')
    this.open = !this.open;
  }

  @HostListener('document:click') onHostClick() {
    this.open = false;
  }
}
