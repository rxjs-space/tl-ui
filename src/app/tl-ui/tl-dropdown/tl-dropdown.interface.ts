import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export type TlDropdownThing = {name: string, path?: string, classes?: string[]};

export interface TlDropdownModel {
  forNav?: boolean;
  hostClasses?: string[];
  activeAsideClasses?: string[];
  toggler: TlDropdownThing;
  items: TlDropdownThing[];
  itemSelectedRxx: BehaviorSubject<TlDropdownThing>;
  navigationEndAfterItemSeletedRxx?: BehaviorSubject<string>;
}

export interface TlDropdownConfig {

}
