export interface EmailDataInterface {
  to: string;
  from?: {
    name: string;
    email: string;
  };
  templateId?: string;
  dynamicTemplateData?: any;
  text?: string;
  subject?: string;
  html?: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }[];
}
