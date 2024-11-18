import { ParsedURL } from "@dashlane/url-parser";
import {
  AddressAutofillView,
  BankAccountAutofillView,
  CompanyAutofillView,
  CredentialAutofillView,
  DriverLicenseAutofillView,
  EmailAutofillView,
  FiscalIdAutofillView,
  GeneratedPasswordAutofillView,
  IdCardAutofillView,
  IdentityAutofillView,
  PasskeyAutofillView,
  PassportAutofillView,
  PaymentCardAutofillView,
  PersonalWebsiteAutofillView,
  PhoneAutofillView,
  SocialSecurityIdAutofillView,
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { FollowUpNotificationWebcardItem } from "../../../Api/types/webcards/follow-up-notification-webcard";
import {
  WebcardItem,
  WebcardItemType,
} from "../../../Api/types/webcards/webcard-item";
import { GetFormattedWebcardItemArguments } from "../../abstractions/formatting/converters";
import { getFormattedPaymentCardWebcardItem } from "../../abstractions/formatting/formatters/PaymentCard/webcard-data";
import { getFormattedAddressWebcardData } from "../../abstractions/formatting/formatters/Address/webcard-data";
import { getFormattedBankAccountWebcardData } from "../../abstractions/formatting/formatters/BankAccount/webcard-data";
import { getFormattedCompanyWebcardData } from "../../abstractions/formatting/formatters/Company/webcard-data";
import { getFormattedCredentialWebcardData } from "../../abstractions/formatting/formatters/Credential/webcard-data";
import { getFormattedDriverLicenseWebcardData } from "../../abstractions/formatting/formatters/DriverLicense/webcard-data";
import { getFormattedEmailWebcardData } from "../../abstractions/formatting/formatters/Email/webcard-data";
import { getFormattedFiscalIdWebcardData } from "../../abstractions/formatting/formatters/FiscalId/webcard-data";
import { getFormattedIdCardWebcardData } from "../../abstractions/formatting/formatters/IdCard/webcard-data";
import { getFormattedIdentityWebcardData } from "../../abstractions/formatting/formatters/Identity/webcard-data";
import { getFormattedPassportWebcardData } from "../../abstractions/formatting/formatters/Passport/webcard-data";
import { getFormattedPersonalWebsiteWebcardData } from "../../abstractions/formatting/formatters/PersonalWebsite/webcard-data";
import { getFormattedPhoneWebcardData } from "../../abstractions/formatting/formatters/Phone/webcard-data";
import { getFormattedSocialSecurityWebcardData } from "../../abstractions/formatting/formatters/SocialSecurity/webcard-data";
import { getFormattedGeneratedPasswordWebcardData } from "../../abstractions/formatting/formatters/GeneratedPassword/webcard-data";
import { formatExpirationDate } from "../../abstractions/formatting/formatters/PaymentCard/vault-ingredient";
export function getFormattedWebcardItem<
  T extends keyof VaultAutofillViewInterfaces
>(args: GetFormattedWebcardItemArguments<T>): WebcardItem {
  const { vaultItem, vaultType, premiumStatusSpace } = args;
  switch (vaultType) {
    case VaultSourceType.Address: {
      return getFormattedAddressWebcardData(
        vaultItem as AddressAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.BankAccount: {
      return getFormattedBankAccountWebcardData(
        vaultItem as BankAccountAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.Company: {
      return getFormattedCompanyWebcardData(
        vaultItem as CompanyAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.Credential: {
      return getFormattedCredentialWebcardData(
        vaultItem as CredentialAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.DriverLicense: {
      return getFormattedDriverLicenseWebcardData(
        vaultItem as DriverLicenseAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.Email: {
      return getFormattedEmailWebcardData(
        vaultItem as EmailAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.FiscalId: {
      return getFormattedFiscalIdWebcardData(
        vaultItem as FiscalIdAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.IdCard: {
      return getFormattedIdCardWebcardData(
        vaultItem as IdCardAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.Identity: {
      return getFormattedIdentityWebcardData(
        vaultItem as IdentityAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.GeneratedPassword: {
      return getFormattedGeneratedPasswordWebcardData(
        vaultItem as GeneratedPasswordAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.PaymentCard: {
      return getFormattedPaymentCardWebcardItem(
        vaultItem as PaymentCardAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.Passkey: {
      const passkeyItem = vaultItem as PasskeyAutofillView;
      const content =
        passkeyItem.rpName.match(/^"(.*)"$/)?.[1] ?? passkeyItem.rpName;
      return {
        type: WebcardItemType.SimpleItem,
        itemId: passkeyItem.id,
        itemType: VaultSourceType.Passkey,
        title: passkeyItem.userDisplayName,
        content,
        isProtected: false,
      };
    }
    case VaultSourceType.Passport: {
      return getFormattedPassportWebcardData(
        vaultItem as PassportAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.PersonalWebsite: {
      return getFormattedPersonalWebsiteWebcardData(
        vaultItem as PersonalWebsiteAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.Phone: {
      return getFormattedPhoneWebcardData(
        vaultItem as PhoneAutofillView,
        premiumStatusSpace
      );
    }
    case VaultSourceType.SocialSecurityId: {
      return getFormattedSocialSecurityWebcardData(
        vaultItem as SocialSecurityIdAutofillView,
        premiumStatusSpace
      );
    }
    default:
      throw new Error(`Error: vault type not supported`);
  }
}
export function getFormattedFollowUpNotificationWebcardData<
  T extends keyof VaultAutofillViewInterfaces
>(
  vaultItem: VaultAutofillViewInterfaces[T],
  itemType: T
): FollowUpNotificationWebcardItem | undefined {
  switch (itemType) {
    case VaultSourceType.Credential: {
      const credentialItem = vaultItem as CredentialAutofillView;
      const rootDomain = new ParsedURL(credentialItem.url).getRootDomain();
      const hasLimitedRights =
        credentialItem.sharingStatus.isShared &&
        !credentialItem.sharingStatus.hasAdminPermission;
      return {
        type: VaultSourceType.Credential,
        itemId: credentialItem.id,
        title: rootDomain,
        email: credentialItem.email,
        login: credentialItem.login,
        secondaryLogin: credentialItem.secondaryLogin,
        hasPassword: !!credentialItem.password,
        hasOTP: credentialItem.hasOtp,
        hasLimitedRights,
      };
    }
    case VaultSourceType.BankAccount: {
      const bankAccountItem = vaultItem as BankAccountAutofillView;
      return {
        type: VaultSourceType.BankAccount,
        itemId: bankAccountItem.id,
        title: bankAccountItem.name,
        ownerName: bankAccountItem.owner,
        hasIBAN: !!bankAccountItem.IBAN,
        hasBIC: !!bankAccountItem.BIC,
        hasBankCode: !!bankAccountItem.bankCode,
      };
    }
    case VaultSourceType.PaymentCard: {
      const paymentCardItem = vaultItem as PaymentCardAutofillView;
      return {
        type: VaultSourceType.PaymentCard,
        itemId: paymentCardItem.id,
        title: paymentCardItem.name,
        ownerName: paymentCardItem.ownerName,
        hasCardNumber: !!paymentCardItem.cardNumber,
        hasSecurityCode: !!paymentCardItem.securityCode,
        expireDate: formatExpirationDate(paymentCardItem),
      };
    }
    default:
      return;
  }
}
