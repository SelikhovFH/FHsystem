import { User } from "../../shared/user.interface";

export const getDisplayName = (user: User) => user ? `${user.name} ${user.surname}` : "";
