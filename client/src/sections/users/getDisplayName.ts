import { User } from "../../shared/user.interface";

export const getDisplayName = (user: User) => `${user.name} ${user.surname}`;
