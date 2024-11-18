import { VaultSourceType } from "@dashlane/autofill-contracts";
import { VaultIngredient } from "../autofill";
import { WebcardDataBase, WebcardType } from "./webcard-data-base";
import {
  UserCopiedBankAccountField,
  UserCopiedCredentialField,
  UserCopiedCreditCardField,
} from "@dashlane/risk-monitoring-contracts";
export interface VaultTypeToAuditLogTypeFields {
  [VaultSourceType.Credential]: UserCopiedCredentialField["properties"]["field"];
  [VaultSourceType.BankAccount]: UserCopiedBankAccountField["properties"]["field"];
  [VaultSourceType.PaymentCard]: UserCopiedCreditCardField["properties"]["field"];
}
type SomeFollowUpNotificationWebcardItem<
  T extends keyof FollowUpNotificationWebcardItemProperties
> = FollowUpNotificationWebcardItemBase<T> &
  FollowUpNotificationWebcardItemProperties[T];
type AllFollowUpNotificationWebcardItem<T> =
  T extends keyof FollowUpNotificationWebcardItemProperties
    ? SomeFollowUpNotificationWebcardItem<T>
    : never;
export type FollowUpNotificationWebcardItem =
  AllFollowUpNotificationWebcardItem<VaultSourceType>;
export type FollowUpNotificationWebcardData = WebcardDataBase & {
  readonly webcardType: WebcardType.FollowUpNotification;
  readonly webcardData: FollowUpNotificationWebcardItem;
  readonly copiedProperties: VaultIngredient["property"][];
};
type FollowUpNotificationWebcardItemBase<T extends VaultSourceType> = {
  readonly type: T;
  itemId: string;
  title: string;
};
export interface FollowUpNotificationWebcardItemProperties {
  [VaultSourceType.Credential]: {
    email?: string;
    login?: string;
    secondaryLogin?: string;
    hasPassword: boolean;
    hasOTP: boolean;
    hasLimitedRights: boolean;
  };
  [VaultSourceType.BankAccount]: {
    ownerName?: string;
    hasIBAN: boolean;
    hasBIC: boolean;
    hasBankCode: boolean;
  };
  [VaultSourceType.PaymentCard]: {
    ownerName?: string;
    hasCardNumber: boolean;
    hasSecurityCode: boolean;
    expireDate: string;
  };
}
export const isFollowUpNotificationWebcard = (
  obj: WebcardDataBase
): obj is FollowUpNotificationWebcardData => {
  return obj.webcardType === WebcardType.FollowUpNotification;
};
