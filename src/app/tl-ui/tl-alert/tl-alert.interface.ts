export interface TlAlertGlobalConfig {
  showAnimation: boolean;
}

export enum TlAlertType {
  Success, Info, Warning, Danger
}

export interface TlAlertLocalConfig {
  type: TlAlertType;
  durationInSec?: number;
  showSecLeft?: boolean;
  secLeft?: number;
  showing?: boolean;
}

export interface TlAlert {
  content: any;
  config: TlAlertLocalConfig;
}
