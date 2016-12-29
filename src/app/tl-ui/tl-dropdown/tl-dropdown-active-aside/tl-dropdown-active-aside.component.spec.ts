/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlDropdownActiveAsideComponent } from './tl-dropdown-active-aside.component';

describe('TlDropdownActiveAsideComponent', () => {
  let component: TlDropdownActiveAsideComponent;
  let fixture: ComponentFixture<TlDropdownActiveAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlDropdownActiveAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlDropdownActiveAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
