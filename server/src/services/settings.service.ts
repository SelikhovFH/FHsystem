import { Model } from "mongoose";
import { BaseSettings, SettingsModules } from "@interfaces/settings/settingsModules.enum";
import oneToOneSettingsModel from "@models/settings/oneToOneSettings.model";
import { OneToOneSettingsDto } from "@dtos/settings/oneToOneSettings.dto";
import { validateOrReject } from "class-validator";
import { Service } from "typedi";
import { OneToOneSettings, OneToOneSettingsPeriod } from "@interfaces/settings/oneToOneSettings";

@Service()
export class SettingsService {
  private models: Record<SettingsModules, Model<any>> = {
    [SettingsModules.OneToOne]: oneToOneSettingsModel
  };

  private validators: Record<SettingsModules, any> = {
    [SettingsModules.OneToOne]: OneToOneSettingsDto
  };

  private defaultSettings: Record<SettingsModules, BaseSettings> = {
    [SettingsModules.OneToOne]: {
      module: SettingsModules.OneToOne,
      period: OneToOneSettingsPeriod.Month,
      userSpecificPeriods: []
    } as OneToOneSettings
  };


  async getSettings<T>(module: SettingsModules): Promise<T> {
    const settings = await this.models[module].findOne({ module });
    return settings || this.defaultSettings[module];
  }

  async updateSettings<T>(module: SettingsModules, settings: T): Promise<T> {
    return this.models[module].findOneAndUpdate({ module }, settings, { new: true, upsert: true });
  }

  async validateSettings<T extends {}>(module: SettingsModules, settings: T): Promise<boolean> {
    const validator = new this.validators[module]();

    Object.keys(settings).forEach(key => {
      validator[key] = settings[key];
    });

    await validateOrReject(validator);

    return true;
  }

}
