/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlNoTagComponent } from './tl-no-tag.component';

describe('TlNoTagComponent', () => {
  let component: TlNoTagComponent;
  let fixture: ComponentFixture<TlNoTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlNoTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlNoTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
