import { Project, ProjectStatus } from "@/interfaces/project.interface";
import { Document, model, Schema } from "mongoose";

const projectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  startDate: Date,
  status: {
    type: String,
    enum: Object.values(ProjectStatus),
    default: ProjectStatus.ongoing
  },
  manager: { type: Schema.Types.ObjectId, ref: "User" },
  workers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  client: { type: Schema.Types.ObjectId, ref: "Client" }
});

const projectModel = model<Project & Document>("Project", projectSchema);

export default projectModel;
