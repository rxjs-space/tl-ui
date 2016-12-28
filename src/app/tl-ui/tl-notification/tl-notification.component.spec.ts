/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Subject } from 'rxjs/Subject';

import { TlNotificationComponent, TlNotificationActionService } from './index';

@Component({
  template: `
    <tl-notification></tl-notification>

    <button class="btn btn-lg btn-primary"
      (click)="sendNotification()">Show notification (random type, duration)
    </button>

    <button class="btn btn-lg btn-outline-primary"
      (click)="sendNotificationInfinite()">Show notification (random type, 'infinite' duration)
    </button>
`
})
class TestHostComponent {
  constructor(private notificationSerivce: TlNotificationActionService) { }

  sendNotification() {
    let randomType = Math.floor(Math.random() * 4);
    let contents = [
      `<strong>Success</strong>`,
      `Info`,
      `Warning`,
      `Danger`
    ];
    this.notificationSerivce.notificationRxx
      .next({
        content: contents[1], // use 1 instandof randomType for testing
        type: 1, // use 1 instandof randomType for testing
        durationInSec: 2/*Math.random() * 10*/,
        showSecLeft: true
      });
  }

  sendNotificationInfinite() {
    let randomType = Math.floor(Math.random() * 4);
    let contents = [
      `<strong>Success</strong>`,
      `Info`,
      `Warning`,
      `Danger`
    ];
    this.notificationSerivce.notificationRxx
      .next({
        content: contents[2],
        type: 2
      });
  }

}

describe('TlNotificationComponent', () => {

  let hostFxt: ComponentFixture<TestHostComponent>;
  let hostCmp: TestHostComponent;
  let hostButtonAutoClose: DebugElement;
  let hostButtonNonAutoClose: DebugElement;

  let focusEl: DebugElement;
  let focusCmp: TlNotificationComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestHostComponent, TlNotificationComponent ],
      providers: [TlNotificationActionService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFxt = TestBed.createComponent(TestHostComponent);
    hostCmp = hostFxt.componentInstance;
    hostButtonAutoClose = hostFxt.debugElement.query(By.css('.btn-primary'));
    hostButtonNonAutoClose = hostFxt.debugElement.query(By.css('.btn-outline-primary'));

    focusEl = hostFxt.debugElement.query(By.css('tl-notification'));
    focusCmp = focusEl.componentInstance;
    hostFxt.detectChanges();
  });

  it('should init', () => {
    expect(focusCmp['showAnimation']).toBe(false);
    expect(focusCmp['notificationService']['notificationRxx'] instanceof Subject).toBe(true);
    expect(focusCmp['notificationsSet'] instanceof Set).toBeTruthy();
    expect(focusCmp['subscriptions_'] instanceof Array).toBeTruthy();
  });

  it('should add one notification and close automatically', fakeAsync(() => {
    let notificationInstance;
    let sub_ = focusCmp['notificationService']['notificationRxx'].subscribe(a => notificationInstance = a);
    hostButtonAutoClose.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    expect(notificationInstance).toEqual({
        content: `Info`,
        type: 1,
        durationInSec: 2,
        showSecLeft: true,
        showing: true,
        secLeft: 3
      }, 'notificationInstance will be set by Subject data and operation in ngOnInit');
    let notificationEl = hostFxt.debugElement.query(By.css('.alert-info'));
    expect(notificationEl).toBeTruthy();
    let notificationContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(notificationContentEl.nativeElement.innerHTML).toBe('Info');
    let notificationCountDownEl = hostFxt.debugElement.query(By.css('.text-muted'));
    expect(notificationCountDownEl.nativeElement.innerHTML).toBe('3');
    tick(3000);
    hostFxt.detectChanges();
    notificationContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(notificationContentEl).toBeFalsy();
    sub_.unsubscribe();
    discardPeriodicTasks();
  }));

  it('should add one (auto-close) notification and close manually', fakeAsync(() => {
    let notificationInstance;
    let sub_ = focusCmp['notificationService']['notificationRxx'].subscribe(a => notificationInstance = a);
    hostButtonAutoClose.triggerEventHandler('click', {});
    hostFxt.detectChanges();

    let closeEl = hostFxt.debugElement.query(By.css('.close'));
    expect(closeEl.nativeElement.innerHTML).toContain('aria-hidden');
    closeEl.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    let notificationContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(notificationContentEl).toBeFalsy();
    sub_.unsubscribe();
    tick(3000);
  }));

  it('should add one (non-auto-close) notification and close manually', fakeAsync(() => {
    let notificationInstance;
    let sub_ = focusCmp['notificationService']['notificationRxx'].subscribe(a => notificationInstance = a);
    hostButtonNonAutoClose.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    expect(notificationInstance).toEqual({
        content: `Warning`,
        type: 2,
        showing: true
      }, 'notificationInstance will be set by Subject data and operation in ngOnInit');
    let notificationEl = hostFxt.debugElement.query(By.css('.alert-warning'));
    expect(notificationEl).toBeTruthy();

    let notificationContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(notificationContentEl.nativeElement.innerHTML).toBe('Warning');

    let closeEl = hostFxt.debugElement.query(By.css('.close'));
    expect(closeEl.nativeElement.innerHTML).toContain('aria-hidden');
    closeEl.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    notificationContentEl = hostFxt.debugElement.query(By.css('.col-xs-9'));
    expect(notificationContentEl).toBeFalsy();
    sub_.unsubscribe();
  }));



});
