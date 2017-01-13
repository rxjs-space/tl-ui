import { trigger, state, style, transition, animate, keyframes, AnimationEntryMetadata } from '@angular/core';

export const carouselSlideAnimations: AnimationEntryMetadata[] = [

  trigger('carouselSlideState', [
    state('current', style({transform: 'translateX(0) scale(0.8)', opacity: '1'})),
    state('previous', style({transform: 'translateX(-41%) scale(0.9) perspective(1800px) rotateY(82deg)', opacity: '0.6'})),
    state('next', style({transform: 'translateX(41%) scale(0.9) perspective(1800px) rotateY(-82deg)', opacity: '0.6'})),
    state('idle', style({display: 'none '})),
    transition('previous => current', animate('0.4s')),
    transition('current => previous', animate('0.4s')),
    transition('next => current', animate('0.4s')),
    transition('current => next', animate('0.4s')),
    transition('previous => next', [
      animate('0.4s', keyframes([
        style({transform: 'translateX(-41%) scale(0.9) perspective(1500px) rotateY(82deg)', opacity: '0.6', offset: 0}),
        style({transform: 'translateX(-45%) scale(0.9) perspective(1500px) rotateY(82deg)', opacity: 0, offset: 0.5}),
        style({transform: 'translateX(45%) scale(0.9) perspective(1500px) rotateY(-82deg)', opacity: 0, offset: 0.5}),
        style({transform: 'translateX(41%) scale(0.9) perspective(1500px) rotateY(-82deg)', opacity: '0.6', offset: 1})
      ]))
    ]),
    transition('next => previous', [
      animate('0.4s', keyframes([
        style({transform: 'translateX(41%) scale(0.9) perspective(1500px) rotateY(-82deg)', opacity: '0.6', offset: 0}),
        style({transform: 'translateX(45%) scale(0.9) perspective(1500px) rotateY(-82deg)', opacity: 0, offset: 0.5}),
        style({transform: 'translateX(-45%) scale(0.9) perspective(1500px) rotateY(82deg)', opacity: 0, offset: 0.5}),
        style({transform: 'translateX(-41%) scale(0.9) perspective(1500px) rotateY(82deg)', opacity: '0.6', offset: 1}),
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
      animate('0.4s linear', keyframes([
        style({height: '*', opacity: '1', padding: '20px', transform: 'scale(1) rotateX(0)', offset: 0}),
        // style({height: '*', opacity: '0.7', padding: '14px 20px', transform: 'scale(0.97) rotateX(-36deg)', offset: 0.4}),
        style({height: 0, opacity: 0, padding: '0 20px', transform: 'scale(0.9) rotateX(-90deg)', 'transform-origin': '50% 0', display: 'none', offset: 1})
      ]))
    ]),
    transition('collapsed => expanded', [
      animate('0.4s linear', keyframes([
        style({height: 0, opacity: 0, padding: '0 20px', transform: 'scale(0.9) rotateX(-90deg)', 'transform-origin': '50% 30%', display: 'none', offset: 0}),
        // style({height: '*', opacity: '0.6', padding: '12px 20px', transform: 'scale(0.96) rotateX(-36deg)', offset: 0.6}),
        style({height: '*', opacity: '1', padding: '20px', transform: 'scale(1) rotateX(0)', offset: 1})
      ]))
    ]),
  ])
];
