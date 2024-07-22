import { BaseItem, EmbeddedAttachment } from "./common";
import { VaultItemType } from "./vault-item";
export interface Secret extends BaseItem {
  kwType: VaultItemType.Secret;
  title: string;
  content: string;
  isSecured: boolean;
  attachments?: EmbeddedAttachment[];
}
