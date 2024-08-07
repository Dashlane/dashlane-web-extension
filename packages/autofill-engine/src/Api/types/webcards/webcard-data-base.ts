export enum WebcardType {
  AutofillConfirmationPasswordLess = "autofill-confirmation",
  AutofillDropdown = "autofill-dropdown",
  AutologinSelection = "autologin-selection",
  B2CFrozenDialog = "b2c-frozen-dialog",
  DataCapture = "data-capture",
  FeedbackNotification = "feedback-notification",
  FollowUpNotification = "follow-up-notification",
  LinkedWebsiteUpdateConfirmation = "linked-website-update-confirmation",
  MasterPassword = "master-password",
  OnboardingNotification = "notification",
  PhishingPrevention = "phishing-prevention",
  SavePassword = "save-password",
  UserVerification = "user-verification",
  WarnGeneratedPassword = "warn-generated-password",
  WebauthnCreateConfirmation = "webauthn-create-confirmation",
  WebauthnGetConfirmation = "webauthn-get-confirmation",
  WebauthnPasskeySelection = "webauthn-passkey-selection",
}
export enum WebcardMetadataType {
  WebauthnRequest = "webauthnRequest",
  PhishingPrevention = "phishingPrevention",
  PendingOperation = "pendingOperation",
}
export interface AbstractWebcardMetadata<T extends WebcardMetadataType> {
  readonly type: T;
}
type WebcardMetadataStoreEntry<T extends WebcardMetadataType> = {
  readonly [K in T]: AbstractWebcardMetadata<K>;
};
export type WebcardMetadataStore = Partial<
  WebcardMetadataStoreEntry<WebcardMetadataType>
>;
export function filterWebcardMetadataStore(
  store: WebcardMetadataStore,
  keys: WebcardMetadataType[]
): WebcardMetadataStore {
  return keys.reduce((acc, key) => {
    return store[key] ? { ...acc, [key]: store[key] } : acc;
  }, {} as WebcardMetadataStore);
}
export interface WebcardDataBase {
  readonly webcardId: string;
  readonly webcardType: WebcardType;
  readonly formType: string;
  readonly tabRootDomain?: string;
  readonly tabUrl?: string;
  isRestoredWebcard?: boolean;
  readonly metadata?: WebcardMetadataStore;
}
export interface WebcardSpacesData {
  readonly letter: string;
  readonly color: string;
  readonly displayName: string;
  readonly spaceId: string;
}
export interface WebcardVaultItemData {
  id: string;
  type: string;
  url?: string;
}
export interface WebcardCollectionData {
  readonly isShared: boolean;
  readonly id: string;
  readonly name: string;
  readonly spaceId: string;
  readonly vaultItems: WebcardVaultItemData[];
}
