import { Injectable } from '@angular/core';

@Injectable()
export class TlClipboardService {

  constructor() { }

  tryIt(command: string) {
    try {
      let successful = document.execCommand(command);
      // let msg = successful ? 'successful' : 'unsuccessful';
      // console.log('Cutting text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to ' + command + '.');
    }
  }

  copy(element: any) {
    let copySupported = document.queryCommandSupported('copy');
    if (!copySupported) {throw(new Error('copy by document.execCommand is not supported. Please copy manually.'))};

    let hasSelect = !!element.select;

    if (hasSelect) { // if it's an input or textarea element
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
