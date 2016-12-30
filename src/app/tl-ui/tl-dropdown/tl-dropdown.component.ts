import { Component, HostBinding, HostListener,
  Input, OnInit,
  Renderer, ElementRef
 } from '@angular/core';

import { TlDropdownModel, TlDropdownThing } from './tl-dropdown.interface';

@Component({
  selector: 'tl-dropdown',
  templateUrl: './tl-dropdown.component.html',
  styleUrls: ['./tl-dropdown.component.scss'],
  changeDetection: 0
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
    const hostClasses = ['dropdown'].concat(this.dropdownModel.hostClasses ? this.dropdownModel.hostClasses : []);
    hostClasses.forEach(c => {
      this.renderer.setElementClass(this.el.nativeElement, c, true);
    });

  }

  clickOnToggler(event) {
    event.preventDefault();
    event.stopPropagation(); // to work with @HostListener('document:click')
    this.open = !this.open;
  }

  clickOnItem(event, item: TlDropdownThing) {
    event.preventDefault();
    this.dropdownModel.itemSelectedRxx.next(item);
  }


  @HostListener('document:click') onHostClick() {
    this.open = false;
  }
}
