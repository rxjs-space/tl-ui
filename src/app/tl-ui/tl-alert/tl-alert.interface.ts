export interface TlAlertConfig {
  type: 'success' | 'info' | 'warning' | 'danger';
}

export interface TlAlert {
  content: any;
  config?: TlAlertConfig;
}
