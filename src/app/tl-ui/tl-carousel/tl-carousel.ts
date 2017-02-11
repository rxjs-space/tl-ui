import { TlGestureEvent } from '../tl-gestures';
export interface TlCarouselModel {
  
}

export enum TlCarouselAnimationScaleOptions {
  None = 0,
  Simple = 1,
  ThreeD = 2
}

export interface EventCombo {
  event: Event | TlGestureEvent | {type: string};
  targetAlias?: string;
}