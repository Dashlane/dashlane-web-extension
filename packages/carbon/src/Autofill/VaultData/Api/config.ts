import { CommandQueryBusConfig, NoCommands } from "Shared/Infrastructure";
import {
  autofillViewedAddressSelector,
  autofillViewedBankAccountSelector,
  autofillViewedCompanySelector,
  autofillViewedCredentialSelector,
  autofillViewedDriverLicenseSelector,
  autofillViewedEmailSelector,
  autofillViewedFiscalIdSelector,
  autofillViewedGeneratedPasswordSelector,
  autofillViewedIdCardSelector,
  autofillViewedIdentitySelector,
  autofillViewedNoteSelector,
  autofillViewedPasskeySelector,
  autofillViewedPassportSelector,
  autofillViewedPaymentCardSelector,
  autofillViewedPersonalWebsiteSelector,
  autofillViewedPhoneSelector,
  autofillViewedQueriedAddressesSelector,
  autofillViewedQueriedBankAccountsSelector,
  autofillViewedQueriedCompaniesSelector,
  autofillViewedQueriedCredentialsByDomainSelector,
  autofillViewedQueriedDriverLicensesSelector,
  autofillViewedQueriedEmailsSelector,
  autofillViewedQueriedFiscalIdsSelector,
  autofillViewedQueriedGeneratedPasswordsSelector,
  autofillViewedQueriedIdCardsSelector,
  autofillViewedQueriedIdentitiesSelector,
  autofillViewedQueriedNotesSelector,
  autofillViewedQueriedPassportsSelector,
  autofillViewedQueriedPaymentCardsSelector,
  autofillViewedQueriedPersonalWebsitesSelector,
  autofillViewedQueriedPhonesSelector,
  autofillViewedQueriedSocialSecurityIdsSelector,
  autofillViewedSocialSecurityIdSelector,
  getAutofillSettingOnUrlForAutofillSelector,
} from "../selectors";
import { AutofillDataQueries } from "./queries";
export const config: CommandQueryBusConfig<NoCommands, AutofillDataQueries> = {
  commands: {},
  queries: {
    getSingleAddressForAutofill: {
      selector: autofillViewedAddressSelector,
    },
    getMultipleAddressesForAutofill: {
      selector: autofillViewedQueriedAddressesSelector,
    },
    getSingleBankAccountForAutofill: {
      selector: autofillViewedBankAccountSelector,
    },
    getMultipleBankAccountsForAutofill: {
      selector: autofillViewedQueriedBankAccountsSelector,
    },
    getSingleCompanyForAutofill: {
      selector: autofillViewedCompanySelector,
    },
    getMultipleCompaniesForAutofill: {
      selector: autofillViewedQueriedCompaniesSelector,
    },
    getSingleCredentialForAutofill: {
      selector: autofillViewedCredentialSelector,
    },
    getMultipleCredentialsForAutofill: {
      selector: autofillViewedQueriedCredentialsByDomainSelector,
    },
    getSingleDriverLicenseForAutofill: {
      selector: autofillViewedDriverLicenseSelector,
    },
    getMultipleDriverLicensesForAutofill: {
      selector: autofillViewedQueriedDriverLicensesSelector,
    },
    getSingleEmailForAutofill: {
      selector: autofillViewedEmailSelector,
    },
    getMultipleEmailsForAutofill: {
      selector: autofillViewedQueriedEmailsSelector,
    },
    getSingleFiscalIdForAutofill: {
      selector: autofillViewedFiscalIdSelector,
    },
    getMultipleFiscalIdsForAutofill: {
      selector: autofillViewedQueriedFiscalIdsSelector,
    },
    getSingleGeneratedPasswordForAutofill: {
      selector: autofillViewedGeneratedPasswordSelector,
    },
    getMultipleGeneratedPasswordsForAutofill: {
      selector: autofillViewedQueriedGeneratedPasswordsSelector,
    },
    getSingleIdCardForAutofill: {
      selector: autofillViewedIdCardSelector,
    },
    getMultipleIdCardsForAutofill: {
      selector: autofillViewedQueriedIdCardsSelector,
    },
    getSingleIdentityForAutofill: {
      selector: autofillViewedIdentitySelector,
    },
    getMultipleIdentitiesForAutofill: {
      selector: autofillViewedQueriedIdentitiesSelector,
    },
    getSingleNoteForAutofill: {
      selector: autofillViewedNoteSelector,
    },
    getMultipleNotesForAutofill: {
      selector: autofillViewedQueriedNotesSelector,
    },
    getSinglePasskeyForAutofill: {
      selector: autofillViewedPasskeySelector,
    },
    getSinglePassportForAutofill: {
      selector: autofillViewedPassportSelector,
    },
    getMultiplePassportsForAutofill: {
      selector: autofillViewedQueriedPassportsSelector,
    },
    getSinglePaymentCardForAutofill: {
      selector: autofillViewedPaymentCardSelector,
    },
    getMultiplePaymentCardsForAutofill: {
      selector: autofillViewedQueriedPaymentCardsSelector,
    },
    getSinglePersonalWebsiteForAutofill: {
      selector: autofillViewedPersonalWebsiteSelector,
    },
    getMultiplePersonalWebsitesForAutofill: {
      selector: autofillViewedQueriedPersonalWebsitesSelector,
    },
    getSinglePhoneForAutofill: {
      selector: autofillViewedPhoneSelector,
    },
    getMultiplePhonesForAutofill: {
      selector: autofillViewedQueriedPhonesSelector,
    },
    getSingleSocialSecurityIdForAutofill: {
      selector: autofillViewedSocialSecurityIdSelector,
    },
    getMultipleSocialSecurityIdsForAutofill: {
      selector: autofillViewedQueriedSocialSecurityIdsSelector,
    },
    getAutofillSettingOnUrlForAutofill: {
      selector: getAutofillSettingOnUrlForAutofillSelector,
    },
  },
  liveQueries: {},
};
