import { BaseItem, EmbeddedAttachment } from "./common";
export interface Secret extends BaseItem {
  title: string;
  content: string;
  isSecured: boolean;
  attachments?: EmbeddedAttachment[];
}
