/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlModalA6Component } from './tl-modal-a6.component';

describe('TlModalA6Component', () => {
  let component: TlModalA6Component;
  let fixture: ComponentFixture<TlModalA6Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlModalA6Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlModalA6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
