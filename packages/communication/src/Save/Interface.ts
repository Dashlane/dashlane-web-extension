import {
  EmailType,
  IdentityTitle,
  DataModelType,
  PaymentCardColor,
  NoteType,
  PhoneType,
} from "../";
import { Country } from "../DataModel/Interfaces/Common";
import { EmbeddedAttachment } from "../DataModel";
export enum SaveOrigin {
  MANUAL = "MANUAL",
  MAV_DATACAPTURE = "MAV_DATACAPTURE",
  MAV_SAVE_CREDENTIAL = "MAV_SAVE_CREDENTIAL",
  IMPORT = "IMPORT",
}
export interface BaseSavePersonalDataItemContent {
  id?: string;
  spaceId?: string;
  [k: string]: any;
}
export interface SavePersonalDataItem<T extends object> {
  kwType: DataModelType;
  origin?: SaveOrigin;
  content: BaseSavePersonalDataItemContent & T;
  attachments?: EmbeddedAttachment[];
}
export interface BaseSaveCredentialContent {
  category: string;
  email: string;
  login: string;
  onlyForThisSubdomain: boolean;
  password: string;
  protectWithMasterPassword: boolean;
  secondaryLogin: string;
  url: string;
  otpSecret?: string;
  otpUrl?: string;
}
export interface SaveCredentialContentCapture
  extends BaseSaveCredentialContent {
  newCategoryName?: string;
}
export interface SaveCredentialFromCapture
  extends SavePersonalDataItem<SaveCredentialContentCapture> {
  kwType: "KWAuthentifiant";
  origin: SaveOrigin.MAV_SAVE_CREDENTIAL;
  shouldSkipSync?: boolean;
}
export interface SaveCredentialContentUI extends BaseSaveCredentialContent {
  autoLogin: boolean;
  checked?: boolean;
  note: string;
  title: string;
  spaceId: string;
  linkedWebsites: {
    addedByDashlane: string[];
    addedByUser: string[];
  };
}
export interface SaveCredentialFromUI
  extends SavePersonalDataItem<SaveCredentialContentUI> {
  kwType: "KWAuthentifiant";
  origin: SaveOrigin.MANUAL;
  shouldSkipSync?: boolean;
}
export interface SaveCredentialFromImport
  extends SavePersonalDataItem<SaveCredentialContentUI> {
  kwType: "KWAuthentifiant";
  origin: SaveOrigin.IMPORT;
  shouldSkipSync?: boolean;
}
export interface SaveNoteFromUIContent {
  category: string;
  content: string;
  secured: boolean;
  title: string;
  type: NoteType;
}
export interface SaveNoteFromUI
  extends SavePersonalDataItem<SaveNoteFromUIContent> {
  kwType: "KWSecureNote";
}
export interface SaveSecretFromUIContent {
  title: string;
  content: string;
  secured: boolean;
}
export interface SaveSecretFromUI
  extends SavePersonalDataItem<SaveSecretFromUIContent> {
  kwType: "KWSecret";
}
export interface BaseSavePaymentCardContent {
  cardName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  ownerName: string;
  securityCode: string;
  personalNote: string;
}
export interface SavePaymentCardContentCapture
  extends BaseSavePaymentCardContent {}
export interface SavePaymentCardFromCapture
  extends SavePersonalDataItem<SavePaymentCardContentCapture> {
  kwType: "KWPaymentMean_creditCard";
  origin: SaveOrigin.MAV_DATACAPTURE;
}
export interface SavePaymentCardContentUI extends BaseSavePaymentCardContent {
  color: PaymentCardColor;
  spaceId?: string;
  id?: string;
}
export interface SavePaymentCardFromUI
  extends SavePersonalDataItem<SavePaymentCardContentUI> {
  kwType: "KWPaymentMean_creditCard";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSaveBankAccountContent {
  name: string;
  owner: string;
  IBAN: string;
  BIC: string;
  bank: string;
}
export interface SaveBankAccountFromUIContent
  extends BaseSaveBankAccountContent {}
export interface SaveBankAccountFromUI
  extends SavePersonalDataItem<SaveBankAccountFromUIContent> {
  kwType: "KWBankStatement";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSavePIIdentityContent {
  title: IdentityTitle;
  firstName: string;
  middleName: string;
  lastName: string;
  pseudo: string;
  birthDate: string;
  birthPlace: string;
}
export interface SavePIIdentityContentCapture
  extends BaseSavePIIdentityContent {}
export interface SavePIIdentityFromCapture
  extends SavePersonalDataItem<SavePIIdentityContentCapture> {
  kwType: "KWIdentity";
  origin: SaveOrigin.MAV_DATACAPTURE;
}
export interface SavePIIdentityContentUI extends BaseSavePIIdentityContent {
  lastName2: string;
  localeFormat: Country;
  spaceId: string;
}
export interface SavePIIdentityFromUI
  extends SavePersonalDataItem<SavePIIdentityContentUI> {
  kwType: "KWIdentity";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSaveIdCardContent {
  expirationDate: number;
  idNumber: string;
  issueDate: number;
  name: string;
}
export interface SaveIdCardFromUIContent extends BaseSaveIdCardContent {}
export interface SaveIdCardFromUI
  extends SavePersonalDataItem<SaveIdCardFromUIContent> {
  kwType: "KWIDCard";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSaveSocialSecurityIdContent {
  idNumber: string;
  name: string;
}
export interface SaveSocialSecurityIdFromUIContent
  extends BaseSaveSocialSecurityIdContent {}
export interface SaveSocialSecurityIdFromUI
  extends SavePersonalDataItem<SaveSocialSecurityIdFromUIContent> {
  kwType: "KWSocialSecurityStatement";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSavePIPhoneContent {
  type: PhoneType;
  phoneName: string;
  number: string;
  localeFormat: Country;
}
export interface SavePIPhoneContentCapture extends BaseSavePIPhoneContent {}
export interface SavePIPhoneFromCapture
  extends SavePersonalDataItem<SavePIPhoneContentCapture> {
  kwType: "KWPhone";
  origin: SaveOrigin.MAV_DATACAPTURE;
}
export interface SavePIPhoneContentUI extends BaseSavePIPhoneContent {
  spaceId: string;
}
export interface SavePIPhoneFromUI
  extends SavePersonalDataItem<SavePIPhoneContentUI> {
  kwType: "KWPhone";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSavePIAddressContent {
  addressName: string;
  receiver: string;
  addressFull: string;
  city: string;
  zipCode: string;
  state: string;
  streetNumber: string;
  building: string;
  stairs: string;
  floor: string;
  door: string;
  digitCode: string;
}
export interface SavePIAddressContentCapture extends BaseSavePIAddressContent {
  localeFormat?: Country;
}
export interface SavePIAddressFromCapture
  extends SavePersonalDataItem<SavePIAddressContentCapture> {
  kwType: "KWAddress";
  origin: SaveOrigin.MAV_DATACAPTURE;
}
export interface SavePIAddressContentUI extends BaseSavePIAddressContent {
  streetTitle: string;
  streetName: string;
  stateNumber: string;
  stateLevel2: string;
  linkedPhone?: string;
  localeFormat: Country;
  spaceId: string;
}
export interface SavePIAddressFromUI
  extends SavePersonalDataItem<SavePIAddressContentUI> {
  kwType: "KWAddress";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSavePICompanyContent {
  name: string;
  jobTitle: string;
}
export interface SavePICompanyContentCapture extends BaseSavePICompanyContent {}
export interface SavePICompanyFromCapture
  extends SavePersonalDataItem<SavePICompanyContentCapture> {
  kwType: "KWCompany";
  origin: SaveOrigin.MAV_DATACAPTURE;
}
export interface SavePICompanyContentUI extends BaseSavePICompanyContent {
  spaceId: string;
}
export interface SavePICompanyFromUI
  extends SavePersonalDataItem<SavePICompanyContentUI> {
  kwType: "KWCompany";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSavePIEmailContent {
  type: EmailType;
  emailName: string;
  email: string;
}
export interface SavePIEmailContentCapture extends BaseSavePIEmailContent {}
export interface SavePIEmailFromCapture
  extends SavePersonalDataItem<SavePIEmailContentCapture> {
  kwType: "KWEmail";
  origin: SaveOrigin.MAV_DATACAPTURE;
}
export interface SavePIEmailContentUI extends BaseSavePIEmailContent {
  spaceId: string;
}
export interface SavePIEmailFromUI
  extends SavePersonalDataItem<SavePIEmailContentUI> {
  kwType: "KWEmail";
  origin: SaveOrigin.MANUAL;
}
export interface BaseSavePIPersonalWebsiteContent {
  name: string;
  website: string;
}
export interface SavePIPersonalWebsiteContentCapture
  extends BaseSavePIPersonalWebsiteContent {}
export interface SavePIPersonalWebsiteFromCapture
  extends SavePersonalDataItem<SavePIPersonalWebsiteContentCapture> {
  kwType: "KWPersonalWebsite";
  origin: SaveOrigin.MAV_DATACAPTURE;
}
export interface SavePIPersonalWebsiteContentUI
  extends BaseSavePIPersonalWebsiteContent {
  spaceId: string;
}
export interface SavePIPersonalWebsiteFromUI
  extends SavePersonalDataItem<SavePIPersonalWebsiteContentUI> {
  kwType: "KWPersonalWebsite";
  origin: SaveOrigin.MANUAL;
}
export type SavePersonalInfoFromUI =
  | SavePIIdentityFromUI
  | SavePIPhoneFromUI
  | SavePIAddressFromUI
  | SavePICompanyFromUI
  | SavePIEmailFromUI
  | SavePIPersonalWebsiteFromUI;
export type SavePersonalInfoFromCapture =
  | SavePIIdentityFromCapture
  | SavePIPhoneFromCapture
  | SavePIAddressFromCapture
  | SavePICompanyFromCapture
  | SavePIEmailFromCapture
  | SavePIPersonalWebsiteFromCapture;
export type SavePersonalInfoEvent =
  | SavePersonalInfoFromUI
  | SavePersonalInfoFromCapture;
export function isPersonalInfoEvent(
  o: SavePersonalDataItemEvent
): o is SavePersonalInfoEvent {
  const dataModelTypes: DataModelType[] = [
    "KWCompany",
    "KWEmail",
    "KWPersonalWebsite",
    "KWIdentity",
    "KWAddress",
    "KWPhone",
  ];
  return dataModelTypes.some((type) => Boolean(o) && o.kwType === type);
}
export function isPIIdentityEvent(
  o: SavePersonalDataItemEvent
): o is SavePIIdentityFromUI {
  return Boolean(o) && o.kwType === "KWIdentity";
}
export function isPIPhoneEvent(
  o: SavePersonalDataItemEvent
): o is SavePIPhoneFromUI {
  return Boolean(o) && o.kwType === "KWPhone";
}
export function isPIAddressEvent(
  o: SavePersonalDataItemEvent
): o is SavePIAddressFromUI {
  return Boolean(o) && o.kwType === "KWAddress";
}
export function isPICompanyEvent(
  o: SavePersonalDataItemEvent
): o is SavePICompanyFromUI {
  return Boolean(o) && o.kwType === "KWCompany";
}
export function isPIEmailEvent(
  o: SavePersonalDataItemEvent
): o is SavePIEmailFromUI {
  return Boolean(o) && o.kwType === "KWEmail";
}
export function isPIPersonalWebsiteEvent(
  o: SavePersonalDataItemEvent
): o is SavePIPersonalWebsiteFromUI {
  return Boolean(o) && o.kwType === "KWPersonalWebsite";
}
export type SavePersonalDataItemFromCapture =
  | SaveCredentialFromCapture
  | SavePaymentCardFromCapture
  | SavePersonalInfoFromCapture;
export type SavePersonalDataItemFromUI =
  | SaveCredentialFromUI
  | SaveIdCardFromUI
  | SaveNoteFromUI
  | SavePaymentCardFromUI
  | SavePersonalInfoFromUI
  | SaveSocialSecurityIdFromUI
  | SaveBankAccountFromUI
  | SaveSecretFromUI;
export type SavePersonalDataItemFromImport = SaveCredentialFromImport;
export type SavePersonalDataItemEvent =
  | SavePersonalDataItemFromUI
  | SavePersonalDataItemFromCapture
  | SavePersonalDataItemFromImport;
export interface SaveCredentialEvent {
  id?: string;
  login: string;
  secondaryLogin: string;
  email: string;
  password: string;
  url: string;
  category: string;
  spaceId: string;
  checked?: boolean;
  newCategoryName?: string;
  onlyForThisSubdomain: boolean;
  protectWithMasterPassword: boolean;
}
export interface SaveCredentialUIEvent extends SaveCredentialEvent {
  title: string;
  note: string;
  autoLogin: boolean;
}
export interface SavePaymentCardEvent {
  id?: string;
  ownerName: string;
  cardName: string;
  cardNumber: string;
  securityCode: string;
  expireMonth: string;
  expireYear: string;
  color?: PaymentCardColor;
  spaceId?: string;
  personalNote?: string;
}
export declare type SaveEventType = "saveCredential" | "savePaymentCard";
export declare type SaveEvent = SaveEventCredential | SaveEventPaymentCard;
export interface SaveEventBase {
  type: SaveEventType;
  origin?: "MAV_DATACAPTURE" | "MAV_SAVE_CREDENTIAL";
}
export interface SaveEventCredential extends SaveEventBase {
  type: "saveCredential";
  content: SaveCredentialContent;
}
export interface SaveCredentialContent {
  id?: string;
  login: string;
  secondaryLogin: string;
  email: string;
  password: string;
  url: string;
  category: string;
  spaceId: string;
  newCategoryName?: string;
  onlyForThisSubdomain: boolean;
  protectWithMasterPassword: boolean;
  lastUse?: number;
  sharedObject?: boolean;
}
export interface SaveEventPaymentCard extends SaveEventBase {
  type: "savePaymentCard";
  content: SavePaymentCardContent;
}
export interface SavePaymentCardContent {
  id?: string;
  ownerName: string;
  cardName: string;
  cardNumber: string;
  securityCode: string;
  expireMonth: string;
  expireYear: string;
  color?: PaymentCardColor;
}
