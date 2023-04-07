import { Document, model, Schema } from "mongoose";
import { OneToOneSettings, OneToOneSettingsPeriod } from "@interfaces/settings/oneToOneSettings";
import { SettingsModules } from "@interfaces/settings/settingsModules.enum";

const oneToOneSettingsSchema: Schema = new Schema({
  module: { type: String, required: true, enum: Object.values(SettingsModules) },
  period: {
    type: String,
    required: true,
    enum: Object.values(OneToOneSettingsPeriod),
    default: OneToOneSettingsPeriod.Month
  },
  userSpecificPeriods: [{
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    period: { type: String, required: true, enum: Object.values(OneToOneSettingsPeriod) }
  }]
});

const oneToOneSettingsModel = model<OneToOneSettings & Document>("Settings", oneToOneSettingsSchema);

export default oneToOneSettingsModel;
