/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

import { TlModalComponent, TlModalModel, TlModalResult } from './index';

@Component({
  template: `
    <div class="card">
      <h4 class="card-header">tl-modal-examples</h4>
      <div class="card-block">
        <tl-modal [modalModel]="modalModel"></tl-modal>
        <button class="btn btn-lg btn-outline-primary" (click)="modalModel.showingRxx.next(true)">Show modal</button>
        <hr>
        <p>Result: {{modalModel.resultRxx | async | json}}</p>
      </div>
    </div>`
})
class TestHostComponent {
  modalModel: TlModalModel = {
    content: {
      header: 'Modal Title hoho',
      body: 'body hoho &hellip;',
      cancel: 'cancel hoho',
      save: 'Save hoho'
    },
    showingRxx: new BehaviorSubject(false),
    resultRxx: new Subject(),
    config: {
      switchToSmall: true
    }
  };
}

describe('TlModalComponent', () => {
  let hostFxt: ComponentFixture<TestHostComponent>;
  let hostCmp: TestHostComponent;
  let hostButton: DebugElement;
  let modalModel: TlModalModel;

  let focusEl: DebugElement;
  let focusCmp: TlModalComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestHostComponent, TlModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFxt = TestBed.createComponent(TestHostComponent);
    hostCmp = hostFxt.componentInstance;
    modalModel = hostCmp.modalModel;
    hostButton = hostFxt.debugElement.query(By.css('.btn'));

    focusEl = hostFxt.debugElement.query(By.css('tl-modal'));
    focusCmp = focusEl.componentInstance;
    hostFxt.detectChanges();
  });

  it('should create', () => {
    expect(focusCmp).toBeTruthy();
  });

  it('should initialize with input value', () => {
    expect(focusCmp.modalModel).toEqual(modalModel);
  });

  it('should show modal when click on trigger button', () => {
    hostButton.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    let modalEl = hostFxt.debugElement.query(By.css('.modal'));
    expect(modalEl).toBeTruthy();
  });

  it('should close the modal with correct output when click on "x"', () => {
    hostButton.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    let xEl = hostFxt.debugElement.query(By.css('.close'));

    let result;
    let sub_ = modalModel.resultRxx.subscribe(r => result = r);
    xEl.triggerEventHandler('click', {});
    expect(result).toEqual(<TlModalResult>{didConfirm: false, method: 'x'});

    hostFxt.detectChanges();
    let modalEl = hostFxt.debugElement.query(By.css('.modal'));
    expect(modalEl).toBeFalsy();
    sub_.unsubscribe();
  });

  it('should close the modal with correct output when click on "cancel"', () => {
    hostButton.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    let cancelEl = hostFxt.debugElement.query(By.css('.btn-secondary'));

    let result;
    let sub_ = modalModel.resultRxx.subscribe(r => result = r);
    cancelEl.triggerEventHandler('click', {});
    expect(result).toEqual(<TlModalResult>{didConfirm: false, method: 'cancel'});

    hostFxt.detectChanges();
    let modalEl = hostFxt.debugElement.query(By.css('.modal'));
    expect(modalEl).toBeFalsy();
    sub_.unsubscribe();
  });

  it('should close the modal with correct output when click on "backdrop"', () => {
    hostButton.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    let modalEl = hostFxt.debugElement.query(By.css('.modal'));

    let result;
    let sub_ = modalModel.resultRxx.subscribe(r => result = r);
    modalEl.triggerEventHandler('click', {});
    expect(result).toEqual(<TlModalResult>{didConfirm: false, method: 'backdrop'});

    hostFxt.detectChanges();
    modalEl = hostFxt.debugElement.query(By.css('.modal'));
    expect(modalEl).toBeFalsy();
    sub_.unsubscribe();
  });

  it('should close the modal with correct output when click on "save"', () => {
    hostButton.triggerEventHandler('click', {});
    hostFxt.detectChanges();
    let saveEl = hostFxt.debugElement.query(By.css('.btn-primary'));

    let result;
    let sub_ = modalModel.resultRxx.subscribe(r => result = r);
    saveEl.triggerEventHandler('click', {});
    expect(result).toEqual(<TlModalResult>{didConfirm: true, method: 'save'});

    hostFxt.detectChanges();
    let modalEl = hostFxt.debugElement.query(By.css('.modal'));
    expect(modalEl).toBeFalsy();
    sub_.unsubscribe();
  });


});
