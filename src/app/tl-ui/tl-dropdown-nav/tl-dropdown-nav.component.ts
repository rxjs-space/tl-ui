import { Component, EventEmitter, ElementRef, DebugElement,
  HostListener, Input, Output, OnInit, Renderer, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { TlMediaQueryService, TlMediaQueryWidthBreakPoints } from '../tl-media-query';
import 'rxjs/add/operator/map';

@Component({
  selector: 'tl-dropdown-nav',
  templateUrl: './tl-dropdown-nav.component.html',
  styleUrls: ['./tl-dropdown-nav.component.scss']
})
export class TlDropdownNavComponent implements OnInit {
  subscriptions: Subscription[] = [];
  public showRxx = new BehaviorSubject(false); // will instruct dropdown to show or to collapse
  active: boolean = false; // record if the current url is one of the model.children.rl
  collapseOnSelect = true; // if the dropdown should collapse on selection

  @Input() model: any; // navbar model
  @Input() navbarTogglableAt = TlMediaQueryWidthBreakPoints.sm; // at which point shall navbar be togglable
  @Output() select = new EventEmitter(); // an output stub
  @ViewChild('dropdownWrapper') dropdownWrapper: DebugElement; // need to set class 'show' on this element
  constructor(
    private mq: TlMediaQueryService,
    private renderer: Renderer,
    private el: ElementRef,
    private router: Router
  ) {}


  ngOnInit() {

    this.subscriptions.push(this.mq.minWidthRxxFac().subscribe(num => { // listen on width change
      if (num <= this.navbarTogglableAt) { // navbar is togglable in such circumstance
        if (this.active && !this.collapseOnSelect) { // if active and navbar not shown in full, show dropdown
          this.showDropdown();
        }
        this.collapseOnSelect = false; // dropdown will not collapse on selection
      } else { // navbar is shown in full in such circumstance
        this.collapseDropdown();
        this.collapseOnSelect = true;
      }
    }));


    this.subscriptions.push(this.router.events.filter(e => e instanceof NavigationEnd) // listen on router change
      .map(e => {
        let childrenRoutes = this.model.children.map(c => c.rl);
        if ( childrenRoutes.indexOf(e.url) > -1 ) { // if current route is in model.children.rl
          this.active = true;
          if ( !this.collapseOnSelect) { // if the navbar is not shown in full
            this.showDropdown();
          }
        } else {
          this.active = false;
          this.collapseDropdown();
        }
      })
    .subscribe());

    this.subscriptions.push(this.showRxx.subscribe(show => { // assign class 'show' on showRxx
      this.renderer.setElementClass(this.dropdownWrapper.nativeElement, 'show', show);
    }));
  }

  collapseDropdown() {
    if (this.showRxx.getValue()) { // if dropdown is open, collapse it
      this.showRxx.next(false);
    }
  }

  showDropdown() {
    if (!this.showRxx.getValue()) { // if dropdown is collasped, open it
      this.showRxx.next(true);
    }
  }

  toggleDropdown() {
    this.showRxx.next(!this.showRxx.getValue());
  }

  clickOnToggler(event) {
    event.stopPropagation();
    event.preventDefault();
    this.toggleDropdown();
  }

  clickOnItem(item) {
    if (this.collapseOnSelect) {
      this.collapseDropdown();
    }
    this.select.emit(item);
  }

  @HostListener('document:click') onHostClick() { // when the navbar is shown in full, click elsewhere will collase dropdown
    if (this.collapseOnSelect) {
      this.collapseDropdown();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
