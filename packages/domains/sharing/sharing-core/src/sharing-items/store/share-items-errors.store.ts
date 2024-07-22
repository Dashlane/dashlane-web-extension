import { defineStore } from "@dashlane/framework-application";
import { UseCaseScope } from "@dashlane/framework-contracts";
import {
  ShareableItemType,
  ShareItemFailureReason,
} from "@dashlane/sharing-contracts";
export interface VaultItemDetails {
  id: string;
  title: string;
  error: ShareItemFailureReason;
}
export type CredentialDetails = VaultItemDetails & {
  type: ShareableItemType.Credential;
  domain?: string;
  text: string;
};
export type NoteDetails = VaultItemDetails & {
  type: ShareableItemType.SecureNote;
  color: string;
};
export type SecretDetails = VaultItemDetails & {
  type: ShareableItemType.Secret;
};
export type ShareItemErrorDetails =
  | CredentialDetails
  | NoteDetails
  | SecretDetails;
export type ShareItemsErrorsState =
  | {
      hasErrors: true;
      errors: ShareItemErrorDetails[];
    }
  | {
      hasErrors: false;
    };
export class ShareItemsErrorsStore extends defineStore<ShareItemsErrorsState>({
  storeName: "share-items-errors-state",
  scope: UseCaseScope.User,
  persist: false,
  initialValue: { hasErrors: false },
}) {}
