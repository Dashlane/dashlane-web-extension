import { DataModelType, SavePIAddressContentUI, SavePICompanyContentUI, SavePIEmailContentUI, SavePIIdentityContentUI, SavePIPersonalWebsiteContentUI, SavePIPhoneContentUI, } from '@dashlane/communication';
import { VaultItemType } from '@dashlane/vault-contracts';
import { CompanyForm } from 'webapp/personal-info/company/form';
import { EmailForm } from 'webapp/personal-info/email/form';
import { IdentityForm } from 'webapp/personal-info/identity/form';
import { PhoneForm } from 'webapp/personal-info/phone/form';
import { WebsiteForm } from 'webapp/personal-info/website/form';
import { AddressForm } from './address/form';
export type PersonalInfoContentUI = SavePIAddressContentUI | SavePICompanyContentUI | SavePIEmailContentUI | SavePIIdentityContentUI | SavePIPhoneContentUI | SavePIPersonalWebsiteContentUI;
export type CategoryKey = 'addresses' | 'companies' | 'emails' | 'identities' | 'personalWebsites' | 'phones';
export interface Category {
    open: boolean;
}
export type CategoryStates = {
    [k in CategoryKey]: Category;
};
export type PersonalInfoKWType = typeof DataModelType.KWAddress | typeof DataModelType.KWCompany | typeof DataModelType.KWEmail | typeof DataModelType.KWIdentity | typeof DataModelType.KWPhone | typeof DataModelType.KWPersonalWebsite;
export type PersonalInfoForm = AddressForm | CompanyForm | EmailForm | IdentityForm | PhoneForm | WebsiteForm;
export type PersonalInfoItemType = VaultItemType.Address | VaultItemType.Company | VaultItemType.Email | VaultItemType.Identity | VaultItemType.Phone | VaultItemType.Website;
