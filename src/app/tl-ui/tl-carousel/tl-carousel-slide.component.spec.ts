/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlCarouselSlideComponent } from './tl-carousel-slide.component';

describe('TlCarouselSlideComponent', () => {
  let component: TlCarouselSlideComponent;
  let fixture: ComponentFixture<TlCarouselSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TlCarouselSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TlCarouselSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
