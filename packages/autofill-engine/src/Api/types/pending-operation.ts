import { AutofillDetailsForVaultDataSource, VaultIngredient } from "./autofill";
import { WebauthnRequest } from "./webauthn";
export enum PendingOperationType {
  CopyValue = "copyValue",
  ApplyAutofillDetails = "applyAutofillDetails",
  Webauthn = "webauthnRequest",
}
export interface PendingCopyOperation {
  readonly type: PendingOperationType.CopyValue;
  readonly itemId: string;
  readonly vaultIngredient: VaultIngredient;
  readonly previouslyCopiedProperties: VaultIngredient["property"][];
}
export interface PendingApplyAutofillDetailsOperation {
  readonly type: PendingOperationType.ApplyAutofillDetails;
  readonly data: AutofillDetailsForVaultDataSource;
}
export interface PendingWebauthnRequestOperation {
  readonly type: PendingOperationType.Webauthn;
  readonly request: WebauthnRequest;
}
export type PendingOperation =
  | PendingApplyAutofillDetailsOperation
  | PendingCopyOperation
  | PendingWebauthnRequestOperation;
