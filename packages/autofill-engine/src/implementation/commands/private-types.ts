import {
  AbstractWebcardMetadata,
  AutofillDetailsForVaultDataSource,
  VaultIngredient,
  WebauthnRequest,
  WebcardMetadataStore,
  WebcardMetadataType,
} from "../../types";
export interface WebauthnRequestWebcardMetadata
  extends AbstractWebcardMetadata<WebcardMetadataType.WebauthnRequest> {
  readonly type: WebcardMetadataType.WebauthnRequest;
  readonly request: WebauthnRequest;
}
export function isWebauthnRequestWebcardMetadata(
  metadata: AbstractWebcardMetadata<WebcardMetadataType>
): metadata is WebauthnRequestWebcardMetadata {
  return (
    metadata.type === WebcardMetadataType.WebauthnRequest &&
    "request" in metadata
  );
}
export interface PhishingPreventionWebcardMetadata
  extends AbstractWebcardMetadata<WebcardMetadataType.PhishingPrevention> {
  readonly type: WebcardMetadataType.PhishingPrevention;
  readonly itemId: string;
  readonly vaultIngredient: VaultIngredient;
}
export function isPhishingPreventionWebcardMetadata(
  metadata: AbstractWebcardMetadata<WebcardMetadataType>
): metadata is PhishingPreventionWebcardMetadata {
  return (
    metadata.type === WebcardMetadataType.PhishingPrevention &&
    "itemId" in metadata &&
    "vaultIngredient" in metadata
  );
}
export interface PendingOperationWebcardMetadata
  extends AbstractWebcardMetadata<WebcardMetadataType.PendingOperation> {
  readonly type: WebcardMetadataType.PendingOperation;
  readonly operation: PendingOperation;
}
export function isPendingOperationWebcardMetadata(
  metadata: AbstractWebcardMetadata<WebcardMetadataType>
): metadata is PendingOperationWebcardMetadata {
  return (
    metadata.type === WebcardMetadataType.PendingOperation &&
    "operation" in metadata
  );
}
export type WebcardMetadata =
  | WebauthnRequestWebcardMetadata
  | PhishingPreventionWebcardMetadata
  | PendingOperationWebcardMetadata;
export function pushWebcardMetadataInStore(
  store: WebcardMetadataStore,
  metadata: WebcardMetadata
): WebcardMetadataStore {
  return {
    ...store,
    [metadata.type]: metadata,
  };
}
export function newWebcardMetadataStore(metadata: WebcardMetadata) {
  return pushWebcardMetadataInStore({}, metadata);
}
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
