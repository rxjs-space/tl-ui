/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Subject } from 'rxjs/Subject';

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
        content: contents[1], // use 1 instandof randomType for testing
        config: {
          type: 1, // use 1 instandof randomType for testing
          durationInSec: 2/*Math.random() * 10*/,
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
        content: contents[2],
        config: {
          type: 2
        }
      });
  }

}

describe('TlAlertComponent', () => {

  let hostFxt: ComponentFixture<TestHostComponent>;
  let hostCmp: TestHostComponent;
  let hostButtonAutoClose: DebugElement;
  let hostButtonNonAutoClose: DebugElement;

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
    hostButtonAutoClose = hostFxt.debugElement.query(By.css('.btn-primary'));
    hostButtonNonAutoClose = hostFxt.debugElement.query(By.css('.btn-outline-primary'));

    focusEl = hostFxt.debugElement.query(By.css('tl-alert'));
    focusCmp = focusEl.componentInstance;
    hostFxt.detectChanges();
  });

  it('should init', () => {
    expect(focusCmp['showAnimation']).toBe(false);
    expect(focusCmp['alertService']['alertRxx'] instanceof Subject).toBe(true);
    expect(focusCmp['alertsSet'] instanceof Set).toBeTruthy();
    expect(focusCmp['subscriptions_'] instanceof Array).toBeTruthy();
  });

  it('should add one alert and close automatically', fakeAsync(() => {
    let alertInstance;
    let sub_ = focusCmp['alertService']['alertRxx'].subscribe(a => alertInstance = a);
    hostButtonAutoClose.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    expect(alertInstance).toEqual({
        content: `Info`,
        config: {
          type: 1,
          durationInSec: 2,
          showSecLeft: true,
          showing: true,
          secLeft: 3
        },
      }, 'alertInstance will be set by Subject data and operation in ngOnInit');
    let alertEl = hostFxt.debugElement.query(By.css('.alert-info'));
    expect(alertEl).toBeTruthy();
    let alertContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(alertContentEl.nativeElement.innerHTML).toBe('Info');
    let alertCountDownEl = hostFxt.debugElement.query(By.css('.text-muted'));
    expect(alertCountDownEl.nativeElement.innerHTML).toBe('3');
    tick(3000);
    hostFxt.detectChanges();
    alertContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(alertContentEl).toBeFalsy();
    sub_.unsubscribe();
    discardPeriodicTasks();
  }));

  it('should add one (auto-close) alert and close manually', fakeAsync(() => {
    let alertInstance;
    let sub_ = focusCmp['alertService']['alertRxx'].subscribe(a => alertInstance = a);
    hostButtonAutoClose.triggerEventHandler('click', {});
    hostFxt.detectChanges();

    let closeEl = hostFxt.debugElement.query(By.css('.close'));
    expect(closeEl.nativeElement.innerHTML).toContain('aria-hidden');
    closeEl.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    let alertContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(alertContentEl).toBeFalsy();
    sub_.unsubscribe();
    tick(3000);
  }));

  it('should add one (non-auto-close) alert and close manually', fakeAsync(() => {
    let alertInstance;
    let sub_ = focusCmp['alertService']['alertRxx'].subscribe(a => alertInstance = a);
    hostButtonNonAutoClose.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    expect(alertInstance).toEqual({
        content: `Warning`,
        config: {
          type: 2,
          showing: true
        },
      }, 'alertInstance will be set by Subject data and operation in ngOnInit');
    let alertEl = hostFxt.debugElement.query(By.css('.alert-warning'));
    expect(alertEl).toBeTruthy();

    let alertContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(alertContentEl.nativeElement.innerHTML).toBe('Warning');

    let closeEl = hostFxt.debugElement.query(By.css('.close'));
    expect(closeEl.nativeElement.innerHTML).toContain('aria-hidden');
    closeEl.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    alertContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(alertContentEl).toBeFalsy();
    sub_.unsubscribe();
  }));



});
