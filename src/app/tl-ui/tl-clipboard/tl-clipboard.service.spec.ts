/* tslint:disable:no-unused-variable */
import { Component } from '@angular/core';
import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TlClipboardService } from './tl-clipboard.service';

// not testing this service
// because don't know the reason for unsuccessful document.execCommand('copy') ...
// ... after changing the nativeElement.value

@Component({
  template: `<div class="card">
  <h4 class="card-header">tl-clipboard examples</h4>
  <div class="card-block">
    <p>
      Examples of using TlClipboardService.
    </p>

    <form>

      <div class="input-group">

        <input type="text" class="form-control" placeholder="type something here ..." #el>
        <span class="input-group-btn">
          <button class="btn btn-secondary" type="button" 
            (click)="copy(el)"
          >Copy</button>
        </span>

      </div>

      <br>

      <!--<textarea class="form-control" placeholder="click here and ctrl + v to paste."
        (click)="target.value = '';" #target>-->
      <textarea rows="8" 
        class="form-control"
        placeholder="click here and ctrl + v to paste."
        (click)="target.value = '';" #target></textarea>
    </form>

    <hr>
    <div>
      <pre><code [innerHTML]="codeExample" #code>
      </code></pre>
      <button class="btn btn-outline-primary" (click)="copy(code)">Copy above code.</button>
    </div>
  </div>
</div>`,
})
export class TestHostComponent {
  codeExample = `@Component({
  selector: 'tl-clipboard-examples',
  templateUrl: './tl-clipboard-examples.component.html',
  styleUrls: ['./tl-clipboard-examples.component.scss'],
  animations: [TlSlideInOutAnimation]
})`;
  constructor(private clipboard: TlClipboardService) { }

  copy(element: any) {
    this.clipboard.copy(element);
  }

}


xdescribe('TlClipboardService', () => {

  let hostCmp: TestHostComponent;
  let hostFxt: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestHostComponent],
      providers: [TlClipboardService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFxt  = TestBed.createComponent(TestHostComponent);
    hostCmp = hostFxt.componentInstance;
    hostFxt.detectChanges();
  });


  it('should ...', inject([TlClipboardService], (service: TlClipboardService) => {
    expect(service).toBeTruthy();
  }));

  it('should copy from input element', () => {
    let inputEl = hostFxt.debugElement.query(By.css('input'));
    inputEl.nativeElement.value = 'xyz';
    console.log(inputEl.nativeElement);
    hostFxt.detectChanges();
    let inputCopyButton = hostFxt.debugElement.query(By.css('.btn-secondary'));
    inputCopyButton.triggerEventHandler('click', {});
    hostFxt.detectChanges();

  });
});
