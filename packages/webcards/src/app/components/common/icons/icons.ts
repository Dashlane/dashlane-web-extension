import {
  AutofillDataSourceType,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { IconName } from "@dashlane/design-system";
export const getThumbnailName = (itemtype: AutofillDataSourceType) => {
  switch (itemtype) {
    case VaultSourceType.Identity:
      return "id-card";
    case VaultSourceType.Email:
      return "email";
    case VaultSourceType.Phone:
      return "phone-number";
    case VaultSourceType.Address:
      return "address";
    case VaultSourceType.Company:
      return "company";
    case VaultSourceType.PersonalWebsite:
      return "website";
    case VaultSourceType.PaymentCard:
      return "payment-card";
    case VaultSourceType.BankAccount:
      return "bank-account";
    case VaultSourceType.Passport:
      return "passport";
    case VaultSourceType.SocialSecurityId:
      return "social-security-number";
    case VaultSourceType.DriverLicense:
      return "drivers-license";
    case VaultSourceType.IdCard:
      return "id-card";
    case VaultSourceType.FiscalId:
      return "tax-number";
    default:
      return null;
  }
};
export const getIconName = (
  itemType: AutofillDataSourceType
): IconName | null => {
  switch (itemType) {
    case VaultSourceType.Identity:
      return "ItemPersonalInfoOutlined";
    case VaultSourceType.Email:
      return "ItemEmailOutlined";
    case VaultSourceType.Phone:
      return "ItemPhoneHomeOutlined";
    case VaultSourceType.Address:
      return "HomeOutlined";
    case VaultSourceType.Company:
      return "ItemCompanyOutlined";
    case VaultSourceType.PersonalWebsite:
      return "WebOutlined";
    case VaultSourceType.PaymentCard:
      return "ItemPaymentOutlined";
    case VaultSourceType.Credential:
      return "ItemLoginOutlined";
    case VaultSourceType.BankAccount:
      return "ItemBankAccountOutlined";
    case VaultSourceType.Passport:
      return "ItemPassportOutlined";
    case VaultSourceType.SocialSecurityId:
      return "ItemSocialSecurityOutlined";
    case VaultSourceType.DriverLicense:
      return "ItemDriversLicenseOutlined";
    case VaultSourceType.IdCard:
      return "ItemIdOutlined";
    case VaultSourceType.FiscalId:
      return "ItemTaxNumberOutlined";
    case VaultSourceType.Passkey:
      return "PasskeyOutlined";
    case VaultSourceType.GeneratedPassword:
      return "FeaturePasswordGeneratorOutlined";
    default:
      return null;
  }
};
