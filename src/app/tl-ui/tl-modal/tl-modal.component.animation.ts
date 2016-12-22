import { trigger, state, style, transition, animate, keyframes } from '@angular/core';
export const accordionAnimations = [
  trigger('modalDialogState', [
    // state('in', style({transform: 'translateY(0)'})),
    transition('void => *', [
      style({transform: 'translateY(-100%)'}),
      animate('0.5s ease')
    ]),
    transition('* => void', [
      animate('0.5s ease-in', style({transform: 'translateY(-100%)'}))
    ]),
  ]),
  trigger('modalBackdropState', [
    // state('in', style({transform: 'translateY(0)'})),
    transition('void => *', [
      style({opacity: 0}),
      animate('0.5s ease', style({opacity: 0.5}))
    ]),
    transition('* => void', [
      animate('0.5s ease-in', style({opacity: 0}))
    ]),
  ])

];
