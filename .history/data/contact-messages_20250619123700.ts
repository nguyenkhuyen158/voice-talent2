export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  to: string;
  createdAt: string;
  isRead?: boolean;
}

export type ContactMessagesData = {
  messages: ContactMessage[];
};
