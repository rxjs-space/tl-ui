export enum TlAlertConfigType {
  Success, Info, Warning, Danger
}

export interface TlAlertConfig {
  type: TlAlertConfigType;
  duration?: number;
  showSecLeft?: boolean;
  secLeft?: number;
}

export interface TlAlert {
  content: any;
  config?: TlAlertConfig;
}
