import { trigger, state, style, transition, animate, keyframes, AnimationEntryMetadata } from '@angular/core';

/*
general style in .scss file:

.carousel-item {
  position: absolute;
  display: flex;
  justify-content: space-around;
}

*/

let animateDuration = '0.8s';
let easeIn = ' ease-in'; // with a space at the beginning
let easeOut = ' ease-out'; // with a space at the beginning
export const carouselSlideAnimations: AnimationEntryMetadata[] = [

  trigger('carouselSlideStateThreeD', [
    state('current', style({transform: 'translateX(0) scale(0.9)', 'z-index': 2, opacity: '1'})),
    state('previous', style({transform: 'translateX(-43%) scale(1) perspective(2000px) rotateY(85deg)', 'z-index': 1, opacity: 0.6})),
    state('next', style({transform: 'translateX(43%) scale(1) perspective(2000px) rotateY(-85deg)', 'z-index': 1, opacity: 0.6})),
    state('idle', style({transform: 'translateX(0) scale(0.9)', display: 'none'})),
    // when click on buttonNext
    transition('next => current', [style({'z-index': 2}), animate(animateDuration + easeOut)]),
    transition('current => previous', [style({'z-index': 1}), animate(animateDuration + easeOut)]),
    // when click on buttonPrevious
    transition('previous => current', [style({'z-index': 2}), animate(animateDuration + easeOut)]),
    transition('current => next', [style({'z-index': 1}), animate(animateDuration + easeOut)]),
    transition('previous => next', [
      animate(animateDuration + easeOut, keyframes([
        style({transform: 'translateX(-43%) scale(1) perspective(2000px) rotateY(85deg)', opacity: 0.6, offset: 0}),
        style({transform: 'translateX(-47%) scale(1) perspective(2000px) rotateY(85deg)', opacity: 0, offset: 0.5}),
        style({transform: 'translateX(47%) scale(1) perspective(2000px) rotateY(-85deg)', opacity: 0, offset: 0.5}),
        style({transform: 'translateX(43%) scale(1) perspective(2000px) rotateY(-85deg)', opacity: 0.6, offset: 1})
      ]))
    ]),
    transition('next => previous', [
      animate(animateDuration + easeOut, keyframes([
        style({transform: 'translateX(43%) scale(1) perspective(2000px) rotateY(-85deg)', opacity: 0.6, offset: 0}),
        style({transform: 'translateX(47%) scale(1) perspective(2000px) rotateY(-85deg)', opacity: 0, offset: 0.5}),
        style({transform: 'translateX(-47%) scale(1) perspective(2000px) rotateY(85deg)', opacity: 0, offset: 0.5}),
        style({transform: 'translateX(-43%) scale(1) perspective(2000px) rotateY(85deg)', opacity: 0.6, offset: 1}),
      ]))
    ]),
    transition('previous => idle', [
      animate(animateDuration + easeOut, keyframes([
        style({transform: 'translateX(-43%) scale(1) perspective(2000px) rotateY(85deg)', opacity: 0.6, offset: 0}),
        style({transform: 'translateX(-47%) scale(1) perspective(2000px) rotateY(85deg)', opacity: 0, offset: 0.5}),
        style({display: 'none', offset: 1}),
      ]))
    ]),
    transition('next => idle', [
      animate(animateDuration + easeOut, keyframes([
        style({transform: 'translateX(43%) scale(1) perspective(2000px) rotateY(-85deg)', opacity: 0.6, offset: 0}),
        style({transform: 'translateX(47%) scale(1) perspective(2000px) rotateY(-85deg)', opacity: 0, offset: 0.5}),
        style({display: 'none', offset: 1}),
      ]))
    ]),
    transition('idle => previous', [
      animate(animateDuration + easeOut, keyframes([
        style({transform: 'translateX(-47%) scale(1) perspective(2000px) rotateY(85deg)', display: 'flex', opacity: 0, offset: 0}),
        style({transform: 'translateX(-43%) scale(1) perspective(2000px) rotateY(85deg)', opacity: 0.6, offset: 0.5}),
        style({transform: 'translateX(-43%) scale(1) perspective(2000px) rotateY(85deg)', opacity: 0.6, offset: 1}),
      ]))
    ]),
    transition('idle => next', [
      animate(animateDuration + easeOut, keyframes([
        style({transform: 'translateX(47%) scale(1) perspective(2000px) rotateY(-85deg)', display: 'flex', opacity: 0, offset: 0}),
        style({transform: 'translateX(43%) scale(1) perspective(2000px) rotateY(-85deg)', opacity: 0.6, offset: 0.5}),
        style({transform: 'translateX(43%) scale(1) perspective(2000px) rotateY(-85deg)', opacity: 0.6, offset: 1}),
      ]))
    ]),
    transition('idle => current', [style({display: 'flex', 'z-index': 2}), animate(animateDuration + easeOut, keyframes([
        style({transform: 'translateX(0) scale(1)', opacity: 0, offset: 0}),
        style({transform: 'translateX(0) scale(0.9)', opacity: 1, offset: 1}),
      ]))
    ]),
    // transition('current => idle') // it will go 'display:none' directly

  ]),

  trigger('carouselSlideStateSimple', [
    state('current', style({transform: 'translateX(0)'})),
    state('previous', style({transform: 'translateX(-100%)', display: 'none'})),
    state('next', style({transform: 'translateX(100%)', display: 'none'})),
    state('idle', style({display: 'none '})),
    transition('next <=> current', animate(animateDuration + easeOut)),
    transition('current <=> previous', animate(animateDuration + easeOut)),
  ]),

  trigger('carouselSlideStateNone', [
    state('current', style({transform: 'translateX(0)'})),
    state('previous', style({display: 'none'})),
    state('next', style({display: 'none'})),
    state('idle', style({display: 'none '})),
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
