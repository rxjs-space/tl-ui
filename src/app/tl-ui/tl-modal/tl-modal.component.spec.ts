/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlModalComponent } from './tl-modal.component';

describe('TlModalComponent', () => {
  let component: TlModalComponent;
  let fixture: ComponentFixture<TlModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
