import { Injectable } from '@angular/core';

@Injectable()
export class TlClipboardService {

  constructor() { }

  tryIt(command: string) {
    try {
      let successful = document.execCommand(command);
      let msg = successful ? 'successful' : 'unsuccessful';
      console.log(command + ' text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to ' + command + '.');
    }
  }

  checkSupport(command: string) {
    let isSupported = document.queryCommandSupported(command);
    if (!isSupported) {
      throw(new Error(`document.execCommand(${command}) is not supported. Please ${command} manually.`));
    }
  }

  copy(element: any) {
    this.checkSupport('copy');

    if (element.textContent.length === 0 && element.value.length === 0) {
      console.log('nothing to copy.');
      return;
    }

    let hasSelect = !!element.select;

    if (hasSelect) { // if it's an input or a textarea element
      element.select();
      this.tryIt('copy');
    } else { // not input or textarea element
      window.getSelection().removeAllRanges(); // remove first, in case anything in it
      let range = document.createRange();
      range.selectNode(element);
      window.getSelection().addRange(range);
      this.tryIt('copy');
      window.getSelection().removeAllRanges(); // remove again
    }

  }


}
