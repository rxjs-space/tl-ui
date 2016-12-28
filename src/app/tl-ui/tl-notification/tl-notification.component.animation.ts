import { trigger, state, style, transition, animate, keyframes, AnimationEntryMetadata } from '@angular/core';

export const notificationAnimations: AnimationEntryMetadata[] = [
  trigger('notificationState', [
    // state('in', style({transform: 'translateY(0)'})),
    transition('void => *', [
      style({opacity: 0, transform: 'translateX(-100%)'}),
      animate('0.5s ease')
    ]),
    transition('* => close', [
      animate('0.5s ease-in', keyframes([
        // use keyframes and ease-in to hide unwanted spacing at the end of animiation, 
        // switch to ease-out to show the unwanted spacing.
        style({opacity: 1, transform: 'translateX(0)', height: '*', padding: '*', margin: '*', border: '*', offset: 0}),
        style({opacity: 0, transform: 'translateX(100%)', height: '*', padding: '*', margin: '*', border: '*', offset: 0.8}),
        style({opacity: 0, transform: 'translateX(100%)', height: 0, padding: 0, margin: 0, border: 0, offset: 1})
      ]))
    ]),
  ]),
];

