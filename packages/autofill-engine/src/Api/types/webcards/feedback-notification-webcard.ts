import { WebcardDataBase, WebcardType } from "./webcard-data-base";
export enum CredentialOperationType {
  SaveCredential = "save-credential",
  UpdateCredential = "update-credential",
}
interface CredentialOperationTypeBase {
  readonly type: CredentialOperationType;
  readonly credentialId: string;
  readonly fullDomain: string;
  readonly emailOrLogin: string;
}
interface UpdateCredentialOperation extends CredentialOperationTypeBase {
  readonly type: CredentialOperationType.UpdateCredential;
}
interface SaveCredentialOperation extends CredentialOperationTypeBase {
  readonly type: CredentialOperationType.SaveCredential;
}
export type CredentialOperation =
  | UpdateCredentialOperation
  | SaveCredentialOperation;
export interface FeedbackNotificationWebcardData extends WebcardDataBase {
  readonly webcardType: WebcardType.FeedbackNotification;
  readonly operation: CredentialOperation;
}
