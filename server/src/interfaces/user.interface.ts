export interface User {
  _id: string;
  auth0id: string;
  email: string;
  role: UserRole;
  name: string;
  surname: string;
  workStartDate: string;
  phone: string;
  emergencyContact: string;
  location: string;
  title: string;
  salaryHistory: Array<{ value: number; date: Date }>;
  cvLink: string;
  status: UserStatus;
}

export enum UserStatus {
  working = "working",
  bench = "bench",
  training = "training",
}

export enum UserRole {
  user = "user",
  editor = "editor",
  admin = "admin",
}
