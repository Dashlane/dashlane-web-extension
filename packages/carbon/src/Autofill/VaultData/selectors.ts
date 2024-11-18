import { compose } from "ramda";
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
  NoteAutofillView,
  PasskeyAutofillView,
  PassportAutofillView,
  PaymentCardAutofillView,
  PersonalWebsiteAutofillView,
  PhoneAutofillView,
  SharingStatusItem,
  SocialSecurityIdAutofillView,
} from "@dashlane/autofill-contracts";
import {
  AutofillOptions,
  CredentialsByDomainDataQuery,
  CredentialWithDomain,
  ListResults,
  SingleCredentialDataQuery,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import {
  addressSelector,
  queryAddressesSelector,
} from "DataManagement/PersonalInfo/Address/selectors";
import {
  bankAccountSelector,
  queryBankAccountsSelector,
} from "DataManagement/BankAccounts/selectors";
import {
  companySelector,
  queryCompaniesSelector,
} from "DataManagement/PersonalInfo/Company/selectors";
import { credentialSelector } from "DataManagement/Credentials/selectors/credential.selector";
import { getQueryByDomainSelector } from "DataManagement/Credentials/selectors/query-by-domain.selector";
import { querySelector } from "DataManagement/Credentials/selectors/query.selector";
import {
  driverLicenseWithIdentitySelector,
  queryDriverLicensesSelector,
} from "DataManagement/Ids/DriverLicenses/selectors";
import {
  emailSelector,
  queryEmailsSelector,
} from "DataManagement/PersonalInfo/Email/selectors";
import {
  fiscalIdSelector,
  queryFiscalIdsSelector,
} from "DataManagement/Ids/FiscalIds/selectors";
import {
  generatedPasswordSelector,
  queryGeneratedPasswordsSelector,
} from "DataManagement/GeneratedPassword/selectors";
import {
  idCardWithIdentitySelector,
  queryIdCardsSelector,
} from "DataManagement/Ids/IdCards/selectors";
import {
  noteSelector,
  queryNotesSelector,
} from "DataManagement/SecureNotes/selectors";
import {
  identitySelector,
  queryIdentitiesSelector,
} from "DataManagement/PersonalInfo/Identity/selectors";
import {
  passportWithIdentitySelector,
  queryPassportsWithIdentitySelector,
} from "DataManagement/Ids/Passports/selectors";
import {
  paymentCardSelector,
  queryPaymentCardsSelector,
} from "DataManagement/PaymentCards/selectors";
import {
  personalWebsiteSelector,
  queryPersonalWebsitesSelector,
} from "DataManagement/PersonalInfo/PersonalWebsite/selectors";
import {
  phoneSelector,
  queryPhonesSelector,
} from "DataManagement/PersonalInfo/Phone/selectors";
import {
  querySocialSecurityIdsSelector,
  socialSecurityIdWithIdentitySelector,
} from "DataManagement/Ids/SocialSecurityIds/selectors";
import { personalSettingsSelector, userIdSelector } from "Session/selectors";
import { viewListResults } from "DataManagement/Search/views";
import { limitedSharingItemsSelector } from "Sharing/2/Services/selectors/limited-sharing-items.selector";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
import { getSharingStatusDetail } from "Sharing/2/Services/views";
import { State } from "Store";
import {
  addressAutofillView,
  addressListView,
  bankAccountAutofillView,
  bankAccountListView,
  companyAutofillView,
  companyListView,
  credentialAutofillView,
  credentialListView,
  driverLicenseAutofillView,
  driverLicenseListView,
  emailAutofillView,
  emailListView,
  fiscalIdAutofillView,
  fiscalIdListView,
  generatedPasswordAutofillView,
  generatedPasswordListView,
  idCardAutofillView,
  idCardListView,
  identityAutofillView,
  identityListView,
  noteAutofillView,
  noteListView,
  passkeyAutofillView,
  passportAutofillView,
  passportListView,
  paymentCardAutofillView,
  paymentCardListView,
  personalWebsiteAutofillView,
  personalWebsiteListView,
  phoneAutofillView,
  phoneListView,
  socialSecurityIdAutofillView,
  socialSecurityIdListView,
} from "./views";
import { passkeySelector } from "DataManagement/Passkeys/selectors";
export type CredentialWithDomainAndSharing = CredentialWithDomain & {
  sharingStatus: SharingStatusItem;
};
export const autofillViewedAddressSelector = (
  state: State,
  addressId: string
): AddressAutofillView => {
  const address = addressSelector(state, addressId);
  return addressAutofillView(address);
};
export const autofillViewedQueriedAddressesSelector = compose(
  viewListResults(addressListView),
  queryAddressesSelector
);
export const autofillViewedBankAccountSelector = (
  state: State,
  bankAccountId: string
): BankAccountAutofillView => {
  const bankAccount = bankAccountSelector(state, bankAccountId);
  return bankAccountAutofillView(bankAccount);
};
export const autofillViewedQueriedBankAccountsSelector = compose(
  viewListResults(bankAccountListView),
  queryBankAccountsSelector
);
export const autofillViewedCompanySelector = (
  state: State,
  companyId: string
): CompanyAutofillView => {
  const company = companySelector(state, companyId);
  return companyAutofillView(company);
};
export const autofillViewedQueriedCompaniesSelector = compose(
  viewListResults(companyListView),
  queryCompaniesSelector
);
export const autofillViewedCredentialSelector = (
  state: State,
  { credentialId, rootDomain }: SingleCredentialDataQuery
): CredentialAutofillView => {
  const credential = credentialSelector(state, credentialId);
  const limitedSharingItems = limitedSharingItemsSelector(state);
  const sharingData = sharingDataSelector(state);
  const userId = userIdSelector(state);
  const getSharingStatusById = getSharingStatusDetail(
    limitedSharingItems,
    sharingData,
    userId
  );
  const sharingInfo = getSharingStatusById(credentialId);
  const sharingStatus: SharingStatusItem = sharingInfo.isShared
    ? {
        isShared: true,
        hasAdminPermission: sharingInfo.permission === "admin",
      }
    : { isShared: false };
  return credentialAutofillView(rootDomain, credential, sharingStatus);
};
export const autofillViewedQueriedCredentialsByDomainSelector = (
  state: State,
  dataQuery: CredentialsByDomainDataQuery
): ListResults<CredentialAutofillView> => {
  const limitedSharingItems = limitedSharingItemsSelector(state);
  const sharingData = sharingDataSelector(state);
  const userId = userIdSelector(state);
  const getSharingStatusById = getSharingStatusDetail(
    limitedSharingItems,
    sharingData,
    userId
  );
  const { domain, ...query } = dataQuery;
  const queryResultsSelector = domain
    ? getQueryByDomainSelector(domain)
    : querySelector;
  const queryResults = queryResultsSelector(state, query);
  const queryResultsWithDomain: ListResults<CredentialWithDomainAndSharing> = {
    ...queryResults,
    items: queryResults.items.map((credential) => {
      const sharingInfo = getSharingStatusById(credential.Id);
      const sharingStatus: SharingStatusItem = sharingInfo.isShared
        ? {
            isShared: true,
            hasAdminPermission: sharingInfo.permission === "admin",
          }
        : { isShared: false };
      return {
        credential,
        domain,
        sharingStatus,
      };
    }),
  };
  return viewListResults(credentialListView)(queryResultsWithDomain);
};
export const autofillViewedDriverLicenseSelector = (
  state: State,
  driverLicenseId: string
): DriverLicenseAutofillView => {
  const driverLicense = driverLicenseWithIdentitySelector(
    state,
    driverLicenseId
  );
  return driverLicenseAutofillView(driverLicense);
};
export const autofillViewedQueriedDriverLicensesSelector = compose(
  viewListResults(driverLicenseListView),
  queryDriverLicensesSelector
);
export const autofillViewedEmailSelector = (
  state: State,
  emailId: string
): EmailAutofillView => {
  const email = emailSelector(state, emailId);
  return emailAutofillView(email);
};
export const autofillViewedQueriedEmailsSelector = compose(
  viewListResults(emailListView),
  queryEmailsSelector
);
export const autofillViewedFiscalIdSelector = (
  state: State,
  fiscalIdId: string
): FiscalIdAutofillView => {
  const fiscalId = fiscalIdSelector(state, fiscalIdId);
  return fiscalIdAutofillView(fiscalId);
};
export const autofillViewedQueriedFiscalIdsSelector = compose(
  viewListResults(fiscalIdListView),
  queryFiscalIdsSelector
);
export const autofillViewedGeneratedPasswordSelector = (
  state: State,
  generatedPasswordId: string
): GeneratedPasswordAutofillView => {
  const generatedPassword = generatedPasswordSelector(
    state,
    generatedPasswordId
  );
  return generatedPasswordAutofillView(generatedPassword);
};
export const autofillViewedQueriedGeneratedPasswordsSelector = compose(
  viewListResults(generatedPasswordListView),
  queryGeneratedPasswordsSelector
);
export const autofillViewedIdCardSelector = (
  state: State,
  idCardId: string
): IdCardAutofillView => {
  const idCard = idCardWithIdentitySelector(state, idCardId);
  return idCardAutofillView(idCard);
};
export const autofillViewedQueriedIdCardsSelector = compose(
  viewListResults(idCardListView),
  queryIdCardsSelector
);
export const autofillViewedIdentitySelector = (
  state: State,
  identityId: string
): IdentityAutofillView => {
  const identity = identitySelector(state, identityId);
  return identityAutofillView(identity);
};
export const autofillViewedQueriedIdentitiesSelector = compose(
  viewListResults(identityListView),
  queryIdentitiesSelector
);
export const autofillViewedNoteSelector = (
  state: State,
  noteId: string
): NoteAutofillView => {
  const note = noteSelector(state, noteId);
  return noteAutofillView(note);
};
export const autofillViewedQueriedNotesSelector = compose(
  viewListResults(noteListView),
  queryNotesSelector
);
export const autofillViewedPasskeySelector = (
  state: State,
  passkeyId: string
): PasskeyAutofillView => {
  const passkey = passkeySelector(state, passkeyId);
  return passkeyAutofillView(passkey);
};
export const autofillViewedPassportSelector = (
  state: State,
  passportId: string
): PassportAutofillView => {
  const passport = passportWithIdentitySelector(state, passportId);
  return passportAutofillView(passport);
};
export const autofillViewedQueriedPassportsSelector = compose(
  viewListResults(passportListView),
  queryPassportsWithIdentitySelector
);
export const autofillViewedPaymentCardSelector = (
  state: State,
  paymentCardId: string
): PaymentCardAutofillView => {
  const paymentCard = paymentCardSelector(state, paymentCardId);
  return paymentCardAutofillView(paymentCard);
};
export const autofillViewedQueriedPaymentCardsSelector = compose(
  viewListResults(paymentCardListView),
  queryPaymentCardsSelector
);
export const autofillViewedPhoneSelector = (
  state: State,
  phoneId: string
): PhoneAutofillView => {
  const phone = phoneSelector(state, phoneId);
  return phoneAutofillView(phone);
};
export const autofillViewedQueriedPhonesSelector = compose(
  viewListResults(phoneListView),
  queryPhonesSelector
);
export const autofillViewedPersonalWebsiteSelector = (
  state: State,
  personalWebsiteId: string
): PersonalWebsiteAutofillView => {
  const personalWebsite = personalWebsiteSelector(state, personalWebsiteId);
  return personalWebsiteAutofillView(personalWebsite);
};
export const autofillViewedQueriedPersonalWebsitesSelector = compose(
  viewListResults(personalWebsiteListView),
  queryPersonalWebsitesSelector
);
export const autofillViewedSocialSecurityIdSelector = (
  state: State,
  socialSecurityIdId: string
): SocialSecurityIdAutofillView => {
  const socialSecurity = socialSecurityIdWithIdentitySelector(
    state,
    socialSecurityIdId
  );
  return socialSecurityIdAutofillView(socialSecurity);
};
export const autofillViewedQueriedSocialSecurityIdsSelector = compose(
  viewListResults(socialSecurityIdListView),
  querySocialSecurityIdsSelector
);
export const getAutofillSettingOnUrlForAutofillSelector = (
  state: State,
  url: string
): AutofillOptions => {
  const domain = new ParsedURL(url).getRootDomain();
  const settings = personalSettingsSelector(state);
  const onlyFillLoginsAndPasswordsOnUrl =
    settings.DisabledUrlsList.includes(url);
  const onlyFillLoginsAndPasswordsOnDomain =
    settings.DisabledDomainsList.includes(domain);
  if (onlyFillLoginsAndPasswordsOnDomain || onlyFillLoginsAndPasswordsOnUrl) {
    return AutofillOptions.ANALYSIS_ENABLED_ONLY_ON_LOGINS_AND_PASSWORDS;
  }
  return AutofillOptions.ANALYSIS_ENABLED_ON_ALL_FORMS;
};
