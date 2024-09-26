import { slot } from "ts-event-bus";
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
  SocialSecurityIdAutofillView,
} from "@dashlane/autofill-contracts";
import {
  AddressDataQuery,
  BankAccountDataQuery,
  CompanyDataQuery,
  CredentialsByDomainDataQuery,
  DriverLicenseDataQuery,
  EmailDataQuery,
  FiscalIdDataQuery,
  GeneratedPasswordsDataQuery,
  IdCardDataQuery,
  IdentityDataQuery,
  NoteDataQuery,
  PassportDataQuery,
  PaymentCardDataQuery,
  PersonalWebsiteDataQuery,
  PhoneDataQuery,
  SocialSecurityIdDataQuery,
} from "../data-management";
import { ListResults } from "../CarbonApi";
import { AutofillOptions, SingleCredentialDataQuery } from "./types";
export const autofillDataQueriesSlots = {
  getSingleAddressForAutofill: slot<string, AddressAutofillView>(),
  getMultipleAddressesForAutofill: slot<
    AddressDataQuery,
    ListResults<AddressAutofillView>
  >(),
  getSingleBankAccountForAutofill: slot<string, BankAccountAutofillView>(),
  getMultipleBankAccountsForAutofill: slot<
    BankAccountDataQuery,
    ListResults<BankAccountAutofillView>
  >(),
  getSingleCompanyForAutofill: slot<string, CompanyAutofillView>(),
  getMultipleCompaniesForAutofill: slot<
    CompanyDataQuery,
    ListResults<CompanyAutofillView>
  >(),
  getSingleCredentialForAutofill: slot<
    SingleCredentialDataQuery,
    CredentialAutofillView
  >(),
  getMultipleCredentialsForAutofill: slot<
    CredentialsByDomainDataQuery,
    ListResults<CredentialAutofillView>
  >(),
  getSingleDriverLicenseForAutofill: slot<string, DriverLicenseAutofillView>(),
  getMultipleDriverLicensesForAutofill: slot<
    DriverLicenseDataQuery,
    ListResults<DriverLicenseAutofillView>
  >(),
  getSingleEmailForAutofill: slot<string, EmailAutofillView>(),
  getMultipleEmailsForAutofill: slot<
    EmailDataQuery,
    ListResults<EmailAutofillView>
  >(),
  getSingleFiscalIdForAutofill: slot<string, FiscalIdAutofillView>(),
  getMultipleFiscalIdsForAutofill: slot<
    FiscalIdDataQuery,
    ListResults<FiscalIdAutofillView>
  >(),
  getSingleGeneratedPasswordForAutofill: slot<
    string,
    GeneratedPasswordAutofillView
  >(),
  getMultipleGeneratedPasswordsForAutofill: slot<
    GeneratedPasswordsDataQuery,
    ListResults<GeneratedPasswordAutofillView>
  >(),
  getSingleIdCardForAutofill: slot<string, IdCardAutofillView>(),
  getMultipleIdCardsForAutofill: slot<
    IdCardDataQuery,
    ListResults<IdCardAutofillView>
  >(),
  getSingleIdentityForAutofill: slot<string, IdentityAutofillView>(),
  getMultipleIdentitiesForAutofill: slot<
    IdentityDataQuery,
    ListResults<IdentityAutofillView>
  >(),
  getSingleNoteForAutofill: slot<string, NoteAutofillView>(),
  getMultipleNotesForAutofill: slot<
    NoteDataQuery,
    ListResults<NoteAutofillView>
  >(),
  getSinglePasskeyForAutofill: slot<string, PasskeyAutofillView>(),
  getSinglePassportForAutofill: slot<string, PassportAutofillView>(),
  getMultiplePassportsForAutofill: slot<
    PassportDataQuery,
    ListResults<PassportAutofillView>
  >(),
  getSinglePaymentCardForAutofill: slot<string, PaymentCardAutofillView>(),
  getMultiplePaymentCardsForAutofill: slot<
    PaymentCardDataQuery,
    ListResults<PaymentCardAutofillView>
  >(),
  getSinglePersonalWebsiteForAutofill: slot<
    string,
    PersonalWebsiteAutofillView
  >(),
  getMultiplePersonalWebsitesForAutofill: slot<
    PersonalWebsiteDataQuery,
    ListResults<PersonalWebsiteAutofillView>
  >(),
  getSinglePhoneForAutofill: slot<string, PhoneAutofillView>(),
  getMultiplePhonesForAutofill: slot<
    PhoneDataQuery,
    ListResults<PhoneAutofillView>
  >(),
  getSingleSocialSecurityIdForAutofill: slot<
    string,
    SocialSecurityIdAutofillView
  >(),
  getMultipleSocialSecurityIdsForAutofill: slot<
    SocialSecurityIdDataQuery,
    ListResults<SocialSecurityIdAutofillView>
  >(),
  getAutofillSettingOnUrlForAutofill: slot<string, AutofillOptions>(),
};
