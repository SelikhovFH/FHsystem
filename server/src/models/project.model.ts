import { Project } from "@/interfaces/project.interface";
import { Document, model, Schema } from "mongoose";

const projectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const projectModel = model<Project & Document>("Project", projectSchema);

export default projectModel;
