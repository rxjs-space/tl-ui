import { BehaviorSubject } from 'rxjs/BehaviorSubject';
export type TlDropdownThing = {name: string, path?: string, classes?: string[]};

export interface TlDropdownModel {
  forNav?: boolean;
  hostClasses?: string[];
  activeAsideClasses?: string[];
  toggler: TlDropdownThing;
  items: TlDropdownThing[];
  itemSelectedRxx: BehaviorSubject<TlDropdownThing>;
  itemSelected?: TlDropdownThing;
  navigationEndAfterItemSeletedRxx?: BehaviorSubject<string>;
  itemPropertyToShowOnButtonWhenSelected?: string;
  styleDisplay?: string;
}

export interface TlDropdownConfig {

}
