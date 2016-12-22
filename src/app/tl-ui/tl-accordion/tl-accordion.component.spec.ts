/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  TlAccordionComponent,
  TlAccordionConfigService,
  TlAccordionModel } from './index';

@Component({
  template: `
    <tl-accordion [accordionModel]="accordionModel"></tl-accordion>`
})
class TestHostComponent {
  accordionModel: TlAccordionModel = {
    panels: [
      {title: '<span>&#9733; <b>Fancy</b> title0 &#9733;</span>', content: 'content0', expanded: true},
      {title: 'title1', content: 'content1'},
      {title: 'title2', content: 'content2', disabled: true},
    ],
    // config: {
    //   expandOneOnly: true,
    //   // showAnimation: true
    // }
  };
}

fdescribe('TlAccordionComponent', () => {
  let hostCmp: TestHostComponent;
  let hostFxt: ComponentFixture<TestHostComponent>;

  let focusCmp: TlAccordionComponent;
  let TlAccordionConfigServiceStub: TlAccordionConfigService;
  let focusEl: DebugElement;

  beforeEach(async(() => {
    TlAccordionConfigServiceStub = {expandOneOnly: true, showAnimation: true};
    TestBed.configureTestingModule({
      declarations: [ TestHostComponent, TlAccordionComponent ],
      providers: [
        {provide: TlAccordionConfigService, useValue: TlAccordionConfigServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFxt  = TestBed.createComponent(TestHostComponent);
    hostCmp = hostFxt.componentInstance;
    focusEl = hostFxt.debugElement.query(By.css('tl-accordion'));
    focusCmp = focusEl.componentInstance;
    hostFxt.detectChanges();
  });

  it('should inject the config', () => {
    expect(focusEl.injector.get(TlAccordionConfigService)).toEqual(TlAccordionConfigServiceStub);
    expect(focusCmp['configService']).toEqual(TlAccordionConfigServiceStub);
 });

  it('should initialize with TestHost setup', () => {
    expect(focusCmp['expandOneOnly']).toBe(true);
    expect(focusCmp['panels']).toEqual(hostCmp.accordionModel.panels);
    expect(focusCmp['lastExpandedPanel']).toEqual(hostCmp.accordionModel.panels[0]);
  });

  it('should act as expected when click on title', fakeAsync(() => {
    const titleElArr = hostFxt.debugElement.queryAll(By.css('tl-accordion .card-header'));
    const contentElArr = hostFxt.debugElement.queryAll(By.css('tl-accordion .card-block'));

    expect(focusCmp['panels'][0].expanded).toBe(true); // [0] is expanded initially

    titleElArr[1].triggerEventHandler('click', {preventDefault: () => {/*console.log('called pd')*/}}); // click on [1]
    hostFxt.detectChanges();
    expect(focusCmp['panels'][0].expanded).toBe(false); // model [0] is collapsed
    expect(focusCmp['panels'][1].expanded).toBe(true); // model [1] is expanded

    if (TlAccordionConfigServiceStub.showAnimation) {tick(500);} // don't know how to reset stub.showAnimation and recompile during test

    expect(contentElArr[0].styles['display']).toBe('none', 'dom [0] is collapsed, after animation');
    expect(contentElArr[1].styles['display']).toBeNull('dom [1] is style.display is not explicitly set.');


    titleElArr[2].triggerEventHandler('click', {preventDefault: () => {}}); // click on [2]
    hostFxt.detectChanges();
    expect(focusCmp['panels'][2].expanded).toBeUndefined(); // [2] has not expanded property initially and is disabled
    expect(contentElArr[2]).toBeUndefined(); // disabled content not rendered

    titleElArr[0].triggerEventHandler('click', {preventDefault: () => {}}); // click on [1]
    hostFxt.detectChanges();
    expect(focusCmp['panels'][1].expanded).toBe(false); // model [0] is collapsed
    expect(focusCmp['panels'][0].expanded).toBe(true); // model [1] is expanded
    if (TlAccordionConfigServiceStub.showAnimation) {tick(500);} // don't know how to set stub.showAnimation during test
    expect(contentElArr[1].styles['display']).toBe('none', 'dom [0] is collapsed, after animation');
    expect(contentElArr[0].styles['display']).toBeNull('dom [1] is style.display is not explicitly set.');

  }));


});
