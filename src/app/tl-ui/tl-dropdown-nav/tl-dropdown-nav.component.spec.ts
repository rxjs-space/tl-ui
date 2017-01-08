/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlDropdownNavComponent } from './tl-dropdown-nav.component';

describe('TlDropdownNavComponent', () => {
  let component: TlDropdownNavComponent;
  let fixture: ComponentFixture<TlDropdownNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlDropdownNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlDropdownNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
