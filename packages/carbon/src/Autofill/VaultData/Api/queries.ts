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
  AutofillOptions,
  BankAccountDataQuery,
  CompanyDataQuery,
  CredentialsByDomainDataQuery,
  DriverLicenseDataQuery,
  EmailDataQuery,
  FiscalIdDataQuery,
  GeneratedPasswordsDataQuery,
  IdCardDataQuery,
  IdentityDataQuery,
  ListResults,
  NoteDataQuery,
  PassportDataQuery,
  PaymentCardDataQuery,
  PersonalWebsiteDataQuery,
  PhoneDataQuery,
  SingleCredentialDataQuery,
  SocialSecurityIdDataQuery,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type AutofillDataQueries = {
  getSingleAddressForAutofill: Query<string, AddressAutofillView>;
  getMultipleAddressesForAutofill: Query<
    AddressDataQuery,
    ListResults<AddressAutofillView>
  >;
  getSingleBankAccountForAutofill: Query<string, BankAccountAutofillView>;
  getMultipleBankAccountsForAutofill: Query<
    BankAccountDataQuery,
    ListResults<BankAccountAutofillView>
  >;
  getSingleCompanyForAutofill: Query<string, CompanyAutofillView>;
  getMultipleCompaniesForAutofill: Query<
    CompanyDataQuery,
    ListResults<CompanyAutofillView>
  >;
  getSingleCredentialForAutofill: Query<
    SingleCredentialDataQuery,
    CredentialAutofillView
  >;
  getMultipleCredentialsForAutofill: Query<
    CredentialsByDomainDataQuery,
    ListResults<CredentialAutofillView>
  >;
  getSingleDriverLicenseForAutofill: Query<string, DriverLicenseAutofillView>;
  getMultipleDriverLicensesForAutofill: Query<
    DriverLicenseDataQuery,
    ListResults<DriverLicenseAutofillView>
  >;
  getSingleEmailForAutofill: Query<string, EmailAutofillView>;
  getMultipleEmailsForAutofill: Query<
    EmailDataQuery,
    ListResults<EmailAutofillView>
  >;
  getSingleFiscalIdForAutofill: Query<string, FiscalIdAutofillView>;
  getMultipleFiscalIdsForAutofill: Query<
    FiscalIdDataQuery,
    ListResults<FiscalIdAutofillView>
  >;
  getSingleGeneratedPasswordForAutofill: Query<
    string,
    GeneratedPasswordAutofillView
  >;
  getMultipleGeneratedPasswordsForAutofill: Query<
    GeneratedPasswordsDataQuery,
    ListResults<GeneratedPasswordAutofillView>
  >;
  getSingleIdCardForAutofill: Query<string, IdCardAutofillView>;
  getMultipleIdCardsForAutofill: Query<
    IdCardDataQuery,
    ListResults<IdCardAutofillView>
  >;
  getSingleIdentityForAutofill: Query<string, IdentityAutofillView>;
  getMultipleIdentitiesForAutofill: Query<
    IdentityDataQuery,
    ListResults<IdentityAutofillView>
  >;
  getSingleNoteForAutofill: Query<string, NoteAutofillView>;
  getMultipleNotesForAutofill: Query<
    NoteDataQuery,
    ListResults<NoteAutofillView>
  >;
  getSinglePasskeyForAutofill: Query<string, PasskeyAutofillView>;
  getSinglePassportForAutofill: Query<string, PassportAutofillView>;
  getMultiplePassportsForAutofill: Query<
    PassportDataQuery,
    ListResults<PassportAutofillView>
  >;
  getSinglePaymentCardForAutofill: Query<string, PaymentCardAutofillView>;
  getMultiplePaymentCardsForAutofill: Query<
    PaymentCardDataQuery,
    ListResults<PaymentCardAutofillView>
  >;
  getSinglePersonalWebsiteForAutofill: Query<
    string,
    PersonalWebsiteAutofillView
  >;
  getMultiplePersonalWebsitesForAutofill: Query<
    PersonalWebsiteDataQuery,
    ListResults<PersonalWebsiteAutofillView>
  >;
  getSinglePhoneForAutofill: Query<string, PhoneAutofillView>;
  getMultiplePhonesForAutofill: Query<
    PhoneDataQuery,
    ListResults<PhoneAutofillView>
  >;
  getSingleSocialSecurityIdForAutofill: Query<
    string,
    SocialSecurityIdAutofillView
  >;
  getMultipleSocialSecurityIdsForAutofill: Query<
    SocialSecurityIdDataQuery,
    ListResults<SocialSecurityIdAutofillView>
  >;
  getAutofillSettingOnUrlForAutofill: Query<string, AutofillOptions>;
};
