import { Subject } from 'rxjs/Subject';
export type TlDropdownThing = {name: string, path?: string, classes?: string[]};

export interface TlDropdownModel {
  forNav?: boolean;
  hostClasses?: string[];
  toggler: TlDropdownThing;
  items: TlDropdownThing[];
  itemSelectedRxx: Subject<TlDropdownThing>;
}

export interface TlDropdownConfig {

}
