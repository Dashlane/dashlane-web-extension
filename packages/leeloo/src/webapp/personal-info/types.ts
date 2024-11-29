import {
  DataModelType,
  SavePIAddressContentUI,
  SavePICompanyContentUI,
  SavePIEmailContentUI,
  SavePIIdentityContentUI,
  SavePIPersonalWebsiteContentUI,
  SavePIPhoneContentUI,
} from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { CompanyForm } from "./company/form";
import { EmailForm } from "./email/form";
import { IdentityForm } from "./identity/form";
import { PhoneForm } from "./phone/form";
import { WebsiteForm } from "./website/form";
import { AddressForm } from "./address/form";
export type PersonalInfoContentUI =
  | SavePIAddressContentUI
  | SavePICompanyContentUI
  | SavePIEmailContentUI
  | SavePIIdentityContentUI
  | SavePIPhoneContentUI
  | SavePIPersonalWebsiteContentUI;
export type CategoryKey =
  | "addresses"
  | "companies"
  | "emails"
  | "identities"
  | "personalWebsites"
  | "phones";
export interface Category {
  open: boolean;
}
export type CategoryStates = {
  [k in CategoryKey]: Category;
};
export type PersonalInfoKWType =
  | typeof DataModelType.KWAddress
  | typeof DataModelType.KWCompany
  | typeof DataModelType.KWEmail
  | typeof DataModelType.KWIdentity
  | typeof DataModelType.KWPhone
  | typeof DataModelType.KWPersonalWebsite;
export type PersonalInfoForm =
  | AddressForm
  | CompanyForm
  | EmailForm
  | IdentityForm
  | PhoneForm
  | WebsiteForm;
export type PersonalInfoItemType =
  | VaultItemType.Address
  | VaultItemType.Company
  | VaultItemType.Email
  | VaultItemType.Identity
  | VaultItemType.Phone
  | VaultItemType.Website;
