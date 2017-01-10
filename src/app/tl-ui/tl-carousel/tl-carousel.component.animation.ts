import { trigger, state, style, transition, animate, keyframes, AnimationEntryMetadata } from '@angular/core';

/*

in => out
translate(0), offset: 0
translateX(-100%), offset: 0.8
display: none, offset: 1

out => in
translate(100%), display: block, offset: 0
translate(0), offset: 1

*/


export const carouselAnimations: AnimationEntryMetadata[] = [

  trigger('carouselItemState', [
    state('in', style({display: 'flex'})),
    // state('out', style({display: 'none'})),
    transition('in => out', [
      style({display: 'flex !important'}),
      animate('5s', keyframes([
        style({transform: 'translateX(0)', offset: 0}),
        style({transform: 'translateX(-100%)', offset: 0.8}), // 0.5s * 0.8 = 0.4s
        style({transform: 'translateX(-100%)', display: 'none', offset: 1}),
      ]))
    ]),
    transition('out => in', [
      animate('0.4s', keyframes([
        style({transform: 'translateX(100%)', display: 'flex', offset: 0}),
        style({transform: 'translateX(0)', offset: 1}),
      ]))
    ]),
  ]),

  trigger('aState', [
    state('left', style({
      transform: 'translateX(-30%)'
    })),
    state('right', style({
      transform: 'translateX(100%)'
    })),
    transition('left <=> right', animate('0.2s'))
  ]),

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
      animate('0.3s linear', keyframes([
        style({height: '*', opacity: '1', padding: '20px', transform: 'scale(1) rotateX(0)', offset: 0}),
        // style({height: '*', opacity: '0.7', padding: '14px 20px', transform: 'scale(0.97) rotateX(-36deg)', offset: 0.4}),
        style({height: 0, opacity: 0, padding: '0 20px', transform: 'scale(0.9) rotateX(-90deg)', 'transform-origin': '50% 0', display: 'none', offset: 1})
      ]))
    ]),
    transition('collapsed => expanded', [
      animate('0.3s linear', keyframes([
        style({height: 0, opacity: 0, padding: '0 20px', transform: 'scale(0.9) rotateX(-90deg)', 'transform-origin': '50% 30%', display: 'none', offset: 0}),
        // style({height: '*', opacity: '0.6', padding: '12px 20px', transform: 'scale(0.96) rotateX(-36deg)', offset: 0.6}),
        style({height: '*', opacity: '1', padding: '20px', transform: 'scale(1) rotateX(0)', offset: 1})
      ]))
    ]),
  ])
];
