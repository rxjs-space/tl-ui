export interface TlNavBarRoute {
  name: string;
  rl: string;
  rla?: string;
  rlao?: {[key: string]: any};
  children?: TlNavBarRoute[]
}

export interface TlNavbarModel {
  brand: string;
  routes: TlNavBarRoute[]
}
