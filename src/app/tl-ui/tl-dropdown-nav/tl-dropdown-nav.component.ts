import { Component, EventEmitter, ElementRef, HostListener, Input, Output, OnInit, Renderer, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { TlMediaQueryService, TlMediaQueryWidthBreakPoints } from '../tl-media-query';

@Component({
  selector: 'tl-dropdown-nav',
  templateUrl: './tl-dropdown-nav.component.html',
  styleUrls: ['./tl-dropdown-nav.component.scss']
})
export class TlDropdownNavComponent implements OnInit {
  showRxx = new BehaviorSubject(false);
  collapseOnSelect = true;
  showChildrenWhileActive = false;
  @Input() model: any;
  @Input() navbarTogglableAt = TlMediaQueryWidthBreakPoints.sm;
  @Output() select = new EventEmitter();
  @ViewChild('dropdownWrapper') dropdownWrapper;
  constructor(private mq: TlMediaQueryService, private renderer: Renderer, private el: ElementRef) {}


  ngOnInit() {
    this.mq.minWidthRxxFac().subscribe(num => {
      if (num > this.navbarTogglableAt) {
        this.collapseOnSelect = true;
      } else { this.collapseOnSelect = false; }

      if (num <= this.navbarTogglableAt) {
        this.showChildrenWhileActive = true;
        this.showRxx.next(true);
      } else {
        this.showChildrenWhileActive = false;
        this.showRxx.next(false);
      }
    });

    this.showRxx.subscribe(show => {
      this.renderer.setElementClass(this.dropdownWrapper.nativeElement, 'show', show);
    });
  }

  clickOnToggler(event) {
    event.stopPropagation();
    event.preventDefault();
    this.showRxx.next(!this.showRxx.getValue())
  }

  clickOnItem(item) {
    if (this.collapseOnSelect) {
      this.showRxx.next(false);
    }
    this.select.emit(item);
  }

  @HostListener('document:click') onHostClick() {
    if (this.collapseOnSelect && this.showRxx.getValue()) {
      this.showRxx.next(false);
    }
  }

}
