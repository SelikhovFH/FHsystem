import { User } from "@interfaces/user.interface";

export interface Device {
  _id: string;
  name: string;
  type: DeviceType;
  screenSize?: number;
  cpu?: string;
  ram?: number;
  storage?: number;
  serialNumber?: string;
  owner: deviceOwnerUnion;
  assignedToId?: string | null;
  notes?: string;
}

export interface DeviceResponse extends Device {
  assignedToUser: User;
}

export type deviceOwnerUnion = "FH" | "Personal" | string;

export enum DeviceType {
  laptop = "laptop",
  monitor = "monitor",
  other = "other",
  network = "network",
  printer = "printer",
  tv = "tv",
  adapter = "adapter",
}
