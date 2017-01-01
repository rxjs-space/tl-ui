import { Component, HostBinding, HostListener,
  Input, OnInit,
  Renderer, ElementRef
 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import { TlDropdownModel, TlDropdownThing } from './tl-dropdown.interface';
import { dropdownAnimations } from './tl-dropdown.component.animation';

@Component({
  selector: 'tl-dropdown',
  templateUrl: './tl-dropdown.component.html',
  styleUrls: ['./tl-dropdown.component.scss'],
  changeDetection: 0,
  animations: dropdownAnimations
})
export class TlDropdownComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  @Input() dropdownModel: TlDropdownModel;
  @HostBinding('class.open') open: boolean = false;

  constructor(
    private renderer: Renderer,
    private el: ElementRef,
    private router: Router
  ) { }

  ngOnInit() {
    // add 'dropdown' class to host el
    const hostClasses = ['dropdown'].concat(this.dropdownModel.hostClasses ? this.dropdownModel.hostClasses : []);
    hostClasses.forEach(c => {
      this.renderer.setElementClass(this.el.nativeElement, c, true);
    });


    if (this.dropdownModel.forNav) { // if forNav, listen on nav event and ask navigationEndAfterItemSeletedRxx to emit
      const sub_ = this.router.events
        .filter(e => e instanceof NavigationEnd)
        .map(e => {
          let url = e.url.replace(/[;?].*/, ''); // delete queryParams and optional params
          let arr = url.split('/');
          // if url === '/components/accordion', arr will be ['', 'components', 'accordion']
          arr.splice(0, 1); // arr will be ['components', 'accordion']
          return arr;
        })
        .switchMap(arr => {
          const togglerPathIndex = arr.indexOf(this.dropdownModel.toggler.path);
          // if we have someting like ['components', 'accordion'] or ['components', 'accordion', 'xyz']
          if (togglerPathIndex > -1 && togglerPathIndex < arr.length - 1) {
            const navEndItemPath = arr[togglerPathIndex + 1]; // this is 'accordion'
            // and following is 'Accordion'
            const navEndItemName = this.dropdownModel.items.filter(item => item.path === navEndItemPath)[0].name;
            return Observable.of(navEndItemName);
          } else {
            return Observable.of('');
          }
        })
        .subscribe(this.dropdownModel.navigationEndAfterItemSeletedRxx);
        this.subscriptions.push(sub_);
    }

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

  ngOnDestroy() {
    this.subscriptions.forEach(sub_ => sub_.unsubscribe());
  }
}
