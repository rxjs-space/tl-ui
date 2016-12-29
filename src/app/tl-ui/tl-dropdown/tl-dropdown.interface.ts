export type TlDropdownThing = {name: string, path: string, classes?: string[]};

export interface TlDropdownModel {
  hostClasses?: string[];
  toggler: TlDropdownThing;
  items: TlDropdownThing[];
  showActiveAside?: boolean;
}

export interface TlDropdownConfig {

}
