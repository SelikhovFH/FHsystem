import { Document, model, Schema } from "mongoose";
import { SkillTag, SkillTagCategory } from "@interfaces/skillTag.interface";

const skillTagSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: Object.values(SkillTagCategory),
    default: SkillTagCategory.default
  }
});

const skillTagModel = model<SkillTag & Document>("SkillTag", skillTagSchema);

export default skillTagModel;
