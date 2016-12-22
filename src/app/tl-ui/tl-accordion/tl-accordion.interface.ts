export interface TlAccordionPanel {
  title: string;
  content: string;
  expanded?: boolean;
  disabled?: boolean;
}

export interface TlAccordionConfig {
  expandOneOnly?: boolean;
  showAnimation?: boolean;
}

export interface TlAccordionModel {
  panels: TlAccordionPanel[];
  config?: TlAccordionConfig;
}
