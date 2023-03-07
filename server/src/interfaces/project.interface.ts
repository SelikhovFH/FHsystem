import { User } from "@interfaces/user.interface";
import { Client } from "@interfaces/client.interface";

export interface Project {
  _id: string;
  name: string;
  startDate: string;
  manager: User;
  workers: User[];
  client: Client;
  status: ProjectStatus;

}

export enum ProjectStatus {
  planned = "planned",
  ongoing = "ongoing",
  paused = "paused",
  finished = "finished",
  cancelled = "cancelled"
}
