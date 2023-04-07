export enum SettingsModules {
  OneToOne = "oneToOne",
}

export interface BaseSettings {
  _id: string;
  module: SettingsModules;
}
