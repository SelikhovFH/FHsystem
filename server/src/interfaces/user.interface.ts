export interface User {
  _id: string;
  auth0id: string;
}

export enum UserRole {
  user = 'user',
  editor = 'editor',
  admin = 'admin'
}
