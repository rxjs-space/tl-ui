/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Tl0Component } from './tl-0.component';

describe('Tl0Component', () => {
  let component: Tl0Component;
  let fixture: ComponentFixture<Tl0Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tl0Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tl0Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
