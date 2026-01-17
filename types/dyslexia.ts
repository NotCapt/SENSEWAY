export enum Theme {
  Default = 'Default',
  Sepia = 'Sepia',
  HighContrast = 'High Contrast',
  Blue = 'Soft Blue',
}

export enum Font {
  OpenDyslexic = 'OpenDyslexic',
  Verdana = 'Verdana',
  Arial = 'Arial',
  OpenSans = 'Open Sans'
}

export interface DyslexiaSettings {
  fontSize: number;
  font: Font;
  theme: Theme;
  lineSpacing: number;
  letterSpacing: number;
  isReadingRuler: boolean;
}