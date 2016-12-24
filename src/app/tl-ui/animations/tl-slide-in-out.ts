import { trigger, state, style, transition, animate, keyframes, AnimationEntryMetadata } from '@angular/core';
export const TlSlideInOutAnimation: AnimationEntryMetadata =
  trigger('TlSlideInOutState', [
    transition('void => *', [
      style({opacity: 0, transform: 'translateX(-100%)'}),
      animate('0.3s ease', style({opacity: 1, transform: 'translateX(0)'}))
    ]),
    transition('* => void', [
      animate('0.3s ease', style({opacity: 0, transform: 'translateX(100%)'}))
    ]),
  ]);
