import { Component, DebugElement, Input, OnInit, Renderer, ViewChild } from '@angular/core';
@Component({
  selector: 'tl-modal-a6',
  templateUrl: './tl-modal-a6.component.html',
  styleUrls: ['./tl-modal-a6.component.scss']
})
export class TlModalA6Component implements OnInit {
  @Input() model: any;
  @ViewChild('modalContainer') modalContainer: DebugElement;
  trigger: any;
  constructor(private renderer: Renderer) { }

  ngOnInit() {
    this.model.showRxx.subscribe(v => {
      if (v.show) {
        this.renderer.setElementStyle(this.modalContainer.nativeElement, 'display', 'block');
        this.renderer.invokeElementMethod(this.modalContainer.nativeElement, 'focus', []);
        this.trigger = v.trigger;
      } else {
        this.renderer.setElementStyle(this.modalContainer.nativeElement, 'display', 'none');
        if (this.trigger) {
          this.renderer.invokeElementMethod(this.trigger, 'focus', []);
          this.trigger = null;
        }
      }
    });
  }

  closeModal(info) {
    console.log(info);
    if (this.model.showRxx.getValue()) {
      this.model.showRxx.next({show: false});
    }
  }
}
