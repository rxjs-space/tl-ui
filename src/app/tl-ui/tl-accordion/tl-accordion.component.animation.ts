import { trigger, state, style, transition, animate, keyframes, AnimationEntryMetadata } from '@angular/core';
export const accordinAnimations: AnimationEntryMetadata[] = [
  trigger('panelContentState', [
    state('expanded', style({
      height: '*',
      opacity: 1,
      padding: '20px',
      transform: 'scale(1) rotateX(0)',
      // display: 'inherit'
    })),
    state('collapsed', style({
      height: 0,
      opacity: 0,
      padding: '0 20px',
      transform: 'scale(0.9) rotateX(-90deg)',
      display: 'none'
    })),
    transition('expanded => collapsed', [
      animate('0.5s ease', keyframes([
        style({height: '*', opacity: '1', padding: '20px', transform: 'scale(1) rotateX(0)', offset: 0}),
        style({height: '*', opacity: '0.7', padding: '14px 20px', transform: 'scale(0.97) rotateX(-36deg)', offset: 0.4}),
        style({height: 0, opacity: 0, padding: '0 20px', transform: 'scale(0.9) rotateX(-90deg)', 'transform-origin': '50% 0', display: 'none', offset: 1})
      ]))
    ]),
    transition('collapsed => expanded', [
      animate('0.5s ease-in', keyframes([
        style({height: 0, opacity: 0, padding: '0 20px', transform: 'scale(0.9) rotateX(-90deg)', 'transform-origin': '50% 30%', display: 'none', offset: 0}),
        style({height: '*', opacity: '0.6', padding: '12px 20px', transform: 'scale(0.96) rotateX(-36deg)', offset: 0.6}),
        style({height: '*', opacity: '1', padding: '20px', transform: 'scale(1) rotateX(0)', offset: 1})
      ]))
    ]),
  ])
];
