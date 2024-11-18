import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import {
  Address,
  BankAccount,
  Company,
  Credential,
  DriversLicense,
  Email,
  FiscalId,
  IdCard,
  Identity,
  Passkey,
  Passport,
  PaymentCard,
  Phone,
  Secret,
  SecureNote,
  SocialSecurityId,
  VaultItemType,
  Website,
} from "../types";
import { VaultItemPropertyFilter } from "./filtering.types";
import { VaultItemPropertySorting } from "./sorting.types";
export type ItemsQueryResult<T> = {
  items: T[];
  matchCount: number;
};
type CredentialsQueryResult = {
  credentialsResult: ItemsQueryResult<Credential>;
};
type IdsQueryResult = {
  driversLicensesResult: ItemsQueryResult<DriversLicense>;
  fiscalIdsResult: ItemsQueryResult<FiscalId>;
  idCardsResult: ItemsQueryResult<IdCard>;
  passportsResult: ItemsQueryResult<Passport>;
  socialSecurityIdsResult: ItemsQueryResult<SocialSecurityId>;
};
type PasskeysQueryResult = {
  passkeysResult: ItemsQueryResult<Passkey>;
};
type PaymentsQueryResult = {
  bankAccountsResult: ItemsQueryResult<BankAccount>;
  paymentCardsResult: ItemsQueryResult<PaymentCard>;
};
type PersonalInfoQueryResult = {
  addressesResult: ItemsQueryResult<Address>;
  companiesResult: ItemsQueryResult<Company>;
  emailsResult: ItemsQueryResult<Email>;
  identitiesResult: ItemsQueryResult<Identity>;
  phonesResult: ItemsQueryResult<Phone>;
  websitesResult: ItemsQueryResult<Website>;
};
type SecretsQueryResult = {
  secretsResult: ItemsQueryResult<Secret>;
};
type SecureNotesQueryResult = {
  secureNotesResult: ItemsQueryResult<SecureNote>;
};
export type VaultItemsQueryResult = CredentialsQueryResult &
  IdsQueryResult &
  PasskeysQueryResult &
  PaymentsQueryResult &
  PersonalInfoQueryResult &
  SecretsQueryResult &
  SecureNotesQueryResult;
export interface VaultItemsQueryParam {
  vaultItemTypes: VaultItemType[];
  ids?: string[];
  pageSize?: number;
  pageNumber?: number;
  propertyFilters?: VaultItemPropertyFilter[];
  propertySorting?: VaultItemPropertySorting;
}
export class VaultItemsQuery extends defineQuery<
  VaultItemsQueryResult,
  never,
  VaultItemsQueryParam
>({
  scope: UseCaseScope.User,
}) {}
