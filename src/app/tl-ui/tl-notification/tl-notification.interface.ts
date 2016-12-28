export interface TlNotificationConfig {
  showAnimation: boolean;
}

export enum TlNotificationType {
  Success, Info, Warning, Danger
}

export interface TlNotification {
  content: string;
  type: TlNotificationType;
  durationInSec?: number;
  showSecLeft?: boolean;
  secLeft?: number; // this is set automatically, will be calculated by durationInSec
  showing?: boolean; // this is set automatically, will be used to change animation related state
}
