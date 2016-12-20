/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlUiComponent } from './tl-ui.component';

describe('TlUiComponent', () => {
  let component: TlUiComponent;
  let fixture: ComponentFixture<TlUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
