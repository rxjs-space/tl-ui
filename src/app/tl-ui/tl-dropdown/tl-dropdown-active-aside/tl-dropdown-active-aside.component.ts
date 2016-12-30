import { Component, ElementRef, Input, OnInit, Renderer } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/startWith';
import { TlDropdownModel } from '../tl-dropdown.interface';


@Component({
  selector: 'tl-dropdown-active-aside',
  templateUrl: './tl-dropdown-active-aside.component.html',
  styleUrls: ['./tl-dropdown-active-aside.component.scss'],
  changeDetection: 0
})
export class TlDropdownActiveAsideComponent implements OnInit {
  @Input() dropdownModel: TlDropdownModel;
  activeNameRx: Observable<any>;
  constructor(
    private router: Router,
    private el: ElementRef,
    private renderer: Renderer
  ) { }

  ngOnInit() {
    if (this.dropdownModel.hostClasses) { // set tl-dropdown-active-aside tag class to be same as tl-dropdown tag class
      this.dropdownModel.hostClasses.forEach(c => {
        this.renderer.setElementClass(this.el.nativeElement, c, true);
      });
    }

    if (this.dropdownModel.forNav) { // if forNav, listen on nav event and turn path to name
      this.activeNameRx = this.router.events
        .filter(e => e instanceof NavigationEnd)
        .map(e => {
          let url = e.url.replace(/[;?].*/, ''); // delete queryParams and optional params
          let arr = url.split('/');
          arr.splice(0, 1);
          return arr;
        })
        .switchMap(arr => {
          if (arr[arr.length - 2] === this.dropdownModel.toggler.path) {
            // if 'components' is at index (-2)
            return Observable.of(arr[arr.length - 1])
              .map(path => {
                return this.dropdownModel.items.filter(i => {
                  return i.path === path;
                })[0].name;
              })
              .map(name => '/ ' + name);
          } else { // if 'components' is not at index (-2)
            return Observable.of('');
          }
        });
    } else {
      this.activeNameRx = this.dropdownModel.itemSelectedRxx
        .map(item => `/ ${item.name}`)
        .startWith('');
    }
  }

}
