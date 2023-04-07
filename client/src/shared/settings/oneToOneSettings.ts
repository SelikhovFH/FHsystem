import { BaseSettings, SettingsModules } from "./settingsModules.enum";

export interface OneToOneSettings extends BaseSettings {
  module: SettingsModules.OneToOne,
  period: OneToOneSettingsPeriod,
  userSpecificPeriods: {
    userId: string,
    period: OneToOneSettingsPeriod
  }[]
}

export enum OneToOneSettingsPeriod {
  Month = "month",
  twoWeeks = "twoWeeks",
  twoMonths = "twoMonths",
  threeMonths = "threeMonths",
  sixMonths = "sixMonths",
}
