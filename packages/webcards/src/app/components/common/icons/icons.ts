import {
  AutofillDataSourceType,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { IconName } from "@dashlane/design-system";
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
