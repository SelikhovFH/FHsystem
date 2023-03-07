import { Project } from "@interfaces/project.interface";

export interface Client {
  _id: string;
  name: string;
  email: string;
  website: string;
  additionalContacts: string;
  workStartDate: string;
}

export interface ClientProfile extends Client {
  projects: Project[];
}
