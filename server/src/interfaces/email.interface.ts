export interface Email {
  templateId: EmailTemplates;
  subject: string;
  to: { email: string, name: string };
  variables: Record<string, string>;
}

export enum EmailTemplates {
  Notification = 4690513,
  Register = 4698426,
}
