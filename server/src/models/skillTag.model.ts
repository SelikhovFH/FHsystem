import { Document, model, Schema } from "mongoose";
import { SkillTag, SkillTagColor } from "@interfaces/skillTag.interface";

const skillTagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  color: {
    type: String,
    enum: Object.values(SkillTagColor),
    default: SkillTagColor.default
  }
});

const skillTagModel = model<SkillTag & Document>("SkillTag", skillTagSchema);

export default skillTagModel;
