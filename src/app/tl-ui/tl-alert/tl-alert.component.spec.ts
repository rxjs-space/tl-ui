/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TlAlertComponent, TlAlertActionService } from './index';

@Component({
  template: `
    <tl-alert></tl-alert>

    <button class="btn btn-lg btn-primary"
      (click)="sendAlert()">Show alert (random type, duration)
    </button>

    <button class="btn btn-lg btn-outline-primary"
      (click)="sendAlertInfinite()">Show alert (random type, 'infinite' duration)
    </button>
`
})
class TestHostComponent {
  constructor(private alertSerivce: TlAlertActionService) { }

  sendAlert() {
    let randomType = Math.floor(Math.random() * 4);
    let contents = [
      `<strong>Success</strong>`,
      `Info`,
      `Warning`,
      `Danger`
    ];
    this.alertSerivce.alertRxx
      .next({
        content: contents[randomType],
        config: {
          type: randomType,
          durationInSec: Math.random() * 10,
          showSecLeft: true
        }
      });
  }

  sendAlertInfinite() {
    let randomType = Math.floor(Math.random() * 4);
    let contents = [
      `<strong>Success</strong>`,
      `Info`,
      `Warning`,
      `Danger`
    ];
    this.alertSerivce.alertRxx
      .next({
        content: contents[randomType],
        config: {
          type: randomType
        }
      });
  }

}

fdescribe('TlAlertComponent', () => {

  let hostFxt: ComponentFixture<TestHostComponent>;
  let hostCmp: TestHostComponent;
  let hostButtonDuration: DebugElement;
  let hostButtonNonDuration: DebugElement;

  let focusEl: DebugElement;
  let focusCmp: TlAlertComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestHostComponent, TlAlertComponent ],
      providers: [TlAlertActionService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFxt = TestBed.createComponent(TestHostComponent);
    hostCmp = hostFxt.componentInstance;
    hostButtonDuration = hostFxt.debugElement.query(By.css('.btn-primary'));
    hostButtonDuration = hostFxt.debugElement.query(By.css('.btn-outline-primary'));

    focusEl = hostFxt.debugElement.query(By.css('tl-alert'));
    focusCmp = focusEl.componentInstance;
    hostFxt.detectChanges();
  });

  it('should create', () => {
    expect(focusCmp).toBeTruthy();
  });
});
