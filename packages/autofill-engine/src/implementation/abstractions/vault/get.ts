import { firstValueFrom } from "rxjs";
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
  PasskeysForDomainDataQuery,
  PassportDataQuery,
  PaymentCardDataQuery,
  PersonalWebsiteDataQuery,
  PhoneDataQuery,
  SocialSecurityIdDataQuery,
  VaultAutofillView,
} from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { getQueryValue } from "@dashlane/framework-application";
import { getSuccess, isFailure, isSuccess } from "@dashlane/framework-types";
import {
  AutofillViews,
  VaultAutofillViewInterfaces,
  VaultQueryAssociator,
  VaultSortingQuery,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import {
  GetPasswordLimitStatusQueryResult,
  VaultItemType,
  VaultItemTypeToResultDictionary,
} from "@dashlane/vault-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { FieldFormat, VaultIngredient } from "../../../types";
import {
  checkHasFrozenAccountFF,
  checkHasGrapheneMigrationV3Dev,
} from "../../../config/feature-flips";
import { ETLD_WITH_STRICT_FULLDOMAIN_MATCH } from "../../modules/autofill/urls-lists";
import { formatAddress } from "../formatting/formatters/Address/vault-ingredient";
import { formatIban } from "../formatting/formatters/BankAccount/vault-ingredient";
import { fullLocalizedCountry } from "../formatting/formatters/Countries/vault-ingredient";
import {
  getDriverLicenseParsedExpirationDate,
  getDriverLicenseParsedIssueDate,
} from "../formatting/formatters/DriverLicense/vault-ingredient";
import {
  getIdCardParsedExpirationDate,
  getIdCardParsedIssueDate,
} from "../formatting/formatters/IdCard/vault-ingredient";
import {
  formatBirthDay,
  formatBirthMonth,
  formatFullName,
  formatMiddleInitial,
  getParsedIdentityBirthDate,
} from "../formatting/formatters/Identity/vault-ingredient";
import { formatOTP } from "../formatting/formatters/OTP/vault-ingredient";
import {
  formatPassportExpirationDay,
  formatPassportExpirationMonth,
  formatPassportIssueDay,
  formatPassportIssueMonth,
  getPassportParsedExpirationDate,
  getPassportParsedIssueDate,
} from "../formatting/formatters/Passport/vault-ingredient";
import {
  formatCardNumber,
  formatExpirationMonth,
  getParsedExpirationDate,
} from "../formatting/formatters/PaymentCard/vault-ingredient";
import {
  DateFormat,
  DateSeparator,
  ParsedDate,
} from "../formatting/formatters/Dates/types";
type GetNumberOfItemsFromVaultArgs<T extends VaultSourceType> =
  VaultQueryAssociator<T> & {
    context: AutofillEngineContext;
  };
type GetItemsFromVaultArgs<T extends VaultSourceType> =
  GetNumberOfItemsFromVaultArgs<T> & {
    searchQuery?: string;
    url?: string;
  };
type PasswordLimitStatus = {
  shouldShowPasswordLimitReached: boolean;
  shouldShowNearPasswordLimit: boolean;
  passwordsLeft?: number;
  limit?: number;
};
export async function getAutofillDataFromVault<T extends VaultSourceType>(
  context: AutofillEngineContext,
  itemType: T,
  itemId: string,
  url = ""
): Promise<VaultAutofillViewInterfaces[T] | undefined> {
  const rootDomain = new ParsedURL(url).getRootDomain();
  if (itemType === VaultSourceType.GeneratedPassword) {
    return context.connectors.carbon.getSingleGeneratedPasswordForAutofill(
      itemId
    ) as Promise<VaultAutofillViewInterfaces[T]>;
  }
  try {
    const result = await firstValueFrom(
      context.connectors.grapheneClient.autofillData.queries.getSingleAutofillData(
        {
          itemId,
          itemType,
          rootDomain,
        }
      )
    );
    if (isFailure(result)) {
      throw new Error(result.error);
    }
    return result.data as VaultAutofillViewInterfaces[T];
  } catch (err) {
    if (err instanceof Error) {
      err.message = "error in get single autofill data query: " + err.message;
    }
    throw err;
  }
}
export function getAllAutofillDataFromVaultOld<T extends VaultSourceType>({
  context,
  vaultType,
  queryOptions,
  url = "",
}: GetItemsFromVaultArgs<T>): Promise<VaultAutofillViewInterfaces[T][]> {
  const SORTING = {
    sortToken: {
      sortCriteria: queryOptions?.sortCriteria ?? [],
      uniqField: "id" as const,
    },
    filterToken: {
      filterCriteria: queryOptions?.filterCriteria ?? [],
    },
    limit: queryOptions?.maxNumberOfItems,
  };
  const parsedUrl = new ParsedURL(url);
  const rootDomain = parsedUrl.getRootDomain();
  const fullDomain = parsedUrl.getHostname();
  const etld = parsedUrl.getETLD();
  type Result = Promise<VaultAutofillViewInterfaces[T][]>;
  switch (vaultType) {
    case VaultSourceType.Address:
      return context.connectors.carbon
        .getMultipleAddressesForAutofill(SORTING as AddressDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.BankAccount:
      return context.connectors.carbon
        .getMultipleBankAccountsForAutofill(SORTING as BankAccountDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.Company:
      return context.connectors.carbon
        .getMultipleCompaniesForAutofill(SORTING as CompanyDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.Credential:
      return context.connectors.carbon
        .getMultipleCredentialsForAutofill({
          domain: ETLD_WITH_STRICT_FULLDOMAIN_MATCH.includes(etld)
            ? etld
            : rootDomain,
          ...SORTING,
        } as CredentialsByDomainDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.DriverLicense:
      return context.connectors.carbon
        .getMultipleDriverLicensesForAutofill(SORTING as DriverLicenseDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.Email:
      return context.connectors.carbon
        .getMultipleEmailsForAutofill(SORTING as EmailDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.FiscalId:
      return context.connectors.carbon
        .getMultipleFiscalIdsForAutofill(SORTING as FiscalIdDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.GeneratedPassword:
      return context.connectors.carbon
        .getMultipleGeneratedPasswordsForAutofill(
          SORTING as GeneratedPasswordsDataQuery
        )
        .then((result) => result.items) as Result;
    case VaultSourceType.IdCard:
      return context.connectors.carbon
        .getMultipleIdCardsForAutofill(SORTING as IdCardDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.Identity:
      return context.connectors.carbon
        .getMultipleIdentitiesForAutofill(SORTING as IdentityDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.NoteCategory:
      return context.connectors.carbon
        .getNoteCategories()
        .then((result) => result.items) as Result;
    case VaultSourceType.Note:
      return context.connectors.carbon
        .getMultipleNotesForAutofill(SORTING as NoteDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.Passkey:
      return context.connectors.carbon
        .getPasskeysForDomain({
          ...SORTING,
          domain: fullDomain,
        } as PasskeysForDomainDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.Passport:
      return context.connectors.carbon
        .getMultiplePassportsForAutofill(SORTING as PassportDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.PaymentCard:
      return context.connectors.carbon
        .getMultiplePaymentCardsForAutofill(SORTING as PaymentCardDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.PersonalWebsite:
      return context.connectors.carbon
        .getMultiplePersonalWebsitesForAutofill(
          SORTING as PersonalWebsiteDataQuery
        )
        .then((result) => result.items) as Result;
    case VaultSourceType.Phone:
      return context.connectors.carbon
        .getMultiplePhonesForAutofill(SORTING as PhoneDataQuery)
        .then((result) => result.items) as Result;
    case VaultSourceType.SocialSecurityId:
      return context.connectors.carbon
        .getMultipleSocialSecurityIdsForAutofill(
          SORTING as SocialSecurityIdDataQuery
        )
        .then((result) => result.items) as Result;
    default:
      throw new Error(`Error: vault type not supported`);
  }
}
export async function getAllAutofillDataFromVault<T extends VaultSourceType>({
  context,
  vaultType,
  queryOptions,
  url = "",
}: GetItemsFromVaultArgs<T>): Promise<VaultAutofillViewInterfaces[T][]> {
  if (
    (await checkHasGrapheneMigrationV3Dev(context.connectors)) &&
    vaultType !== VaultSourceType.GeneratedPassword
  ) {
    try {
      const parsedUrl = new ParsedURL(url);
      const etld = parsedUrl.getETLD();
      let domain = ETLD_WITH_STRICT_FULLDOMAIN_MATCH.includes(etld)
        ? etld
        : parsedUrl.getRootDomain();
      if (vaultType === VaultSourceType.Passkey) {
        domain = parsedUrl.getHostname();
      }
      const sort = queryOptions?.sortCriteria[0];
      const result = await firstValueFrom(
        context.connectors.grapheneClient.autofillData.queries.getMultipleAutofillData(
          {
            itemType: vaultType,
            domain,
            sorting: sort
              ? { property: sort.field, direction: sort.direction }
              : undefined,
            filters: undefined,
          }
        )
      );
      if (isFailure(result)) {
        throw new Error(result.error);
      }
      return result.data as VaultAutofillViewInterfaces[T][];
    } catch (err) {
      if (err instanceof Error) {
        err.message = "error in get all autofill data query: " + err.message;
      }
      throw err;
    }
  } else {
    return getAllAutofillDataFromVaultOld({
      context,
      vaultType,
      queryOptions,
      url,
    });
  }
}
export async function searchAllAutofillDataFromVault({
  context,
  searchQuery,
  itemTypes,
  domain,
  sorting,
}: {
  context: AutofillEngineContext;
  searchQuery: string;
  itemTypes?: VaultSourceType[];
  domain?: string;
  sorting?: VaultSortingQuery;
}) {
  try {
    const result = await firstValueFrom(
      context.connectors.grapheneClient.autofillData.queries.searchAutofillData(
        {
          searchQuery,
          itemTypes,
          domain,
          sorting,
        }
      )
    );
    if (isFailure(result)) {
      throw new Error(result.tag);
    }
    return result.data as AutofillViews[];
  } catch (err) {
    throw new Error("error in search autofill data query: " + err);
  }
}
const mapSourceTypeToVaultItemType = {
  [VaultSourceType.Address]: VaultItemType.Address,
  [VaultSourceType.BankAccount]: VaultItemType.BankAccount,
  [VaultSourceType.Company]: VaultItemType.Company,
  [VaultSourceType.Credential]: VaultItemType.Credential,
  [VaultSourceType.DriverLicense]: VaultItemType.DriversLicense,
  [VaultSourceType.Email]: VaultItemType.Email,
  [VaultSourceType.FiscalId]: VaultItemType.FiscalId,
  [VaultSourceType.GeneratedPassword]: null,
  [VaultSourceType.IdCard]: VaultItemType.IdCard,
  [VaultSourceType.Identity]: VaultItemType.Identity,
  [VaultSourceType.Note]: VaultItemType.SecureNote,
  [VaultSourceType.Passkey]: VaultItemType.Passkey,
  [VaultSourceType.Passport]: VaultItemType.Passport,
  [VaultSourceType.PaymentCard]: VaultItemType.PaymentCard,
  [VaultSourceType.PersonalWebsite]: VaultItemType.Website,
  [VaultSourceType.Phone]: VaultItemType.Phone,
  [VaultSourceType.SocialSecurityId]: VaultItemType.SocialSecurityId,
  [VaultSourceType.Secret]: VaultItemType.Secret,
  [VaultSourceType.NoteCategory]: null,
};
export async function getNumberOfItemsFromVault<T extends VaultSourceType>({
  context,
  vaultType,
}: GetNumberOfItemsFromVaultArgs<T>): Promise<number> {
  try {
    const vaultItemType = mapSourceTypeToVaultItemType[vaultType];
    if (vaultItemType) {
      const resultProperty = VaultItemTypeToResultDictionary[vaultItemType];
      const result = await firstValueFrom(
        context.connectors.grapheneClient.vaultItemsCrud.queries.query({
          vaultItemTypes: [vaultItemType],
        })
      );
      if (isFailure(result)) {
        throw new Error(result.tag);
      }
      return result.data[resultProperty].matchCount;
    } else {
      throw new Error("bad vault item type");
    }
  } catch (err) {
    throw new Error(
      "error in the `getNumberOfItemsFromVault` function of the `get.ts` file: " +
        err
    );
  }
}
type FormatterFunction<T extends keyof VaultAutofillViewInterfaces> = (
  vaultItem: VaultAutofillViewInterfaces[T],
  fieldFormat?: FieldFormat
) => string;
const getFormatterForVaultItem: Partial<{
  [T in keyof VaultAutofillViewInterfaces]: Partial<
    Record<keyof VaultAutofillViewInterfaces[T], FormatterFunction<T>>
  >;
}> = {
  [VaultSourceType.Address]: {
    addressFull: formatAddress,
    country: (address) => fullLocalizedCountry(address.country),
  },
  [VaultSourceType.BankAccount]: {
    IBAN: formatIban,
  },
  [VaultSourceType.Identity]: {
    birthDay: formatBirthDay,
    birthMonth: formatBirthMonth,
    middleNameInitial: formatMiddleInitial,
    fullName: formatFullName,
  },
  [VaultSourceType.PaymentCard]: {
    expireMonth: formatExpirationMonth,
    cardNumber: formatCardNumber,
  },
  [VaultSourceType.Credential]: {
    otpSecret: formatOTP,
  },
  [VaultSourceType.Passport]: {
    expirationDay: formatPassportExpirationDay,
    expirationMonth: formatPassportExpirationMonth,
    issueDay: formatPassportIssueDay,
    issueMonth: formatPassportIssueMonth,
  },
};
export const fetchSpecialFormatterForVaultIngredient = (
  ingredient: VaultIngredient
): FormatterFunction<typeof ingredient.type> | undefined => {
  if (ingredient.type in getFormatterForVaultItem) {
    const specialGetterForVaultType = getFormatterForVaultItem[ingredient.type];
    if (
      specialGetterForVaultType &&
      ingredient.property in specialGetterForVaultType
    ) {
      return specialGetterForVaultType[
        ingredient.property as keyof typeof specialGetterForVaultType
      ] as FormatterFunction<typeof ingredient.type>;
    }
  }
  return undefined;
};
export interface ParsedDateWithFieldFormat {
  date: ParsedDate | undefined;
  defaultFormat: DateFormat;
  defaultSeparator: DateSeparator;
}
export const getParsedDateForIngredient = (
  ingredient: VaultIngredient,
  vaultItem: VaultAutofillView
): ParsedDateWithFieldFormat | undefined => {
  if (ingredient.type !== vaultItem.vaultType) {
    return undefined;
  }
  switch (vaultItem.vaultType) {
    case VaultSourceType.Identity:
      switch (
        ingredient.property as keyof VaultAutofillViewInterfaces[typeof vaultItem.vaultType]
      ) {
        case "birthDate":
          return {
            date: getParsedIdentityBirthDate(vaultItem),
            defaultFormat: DateFormat.FORMAT_MM_DD_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_SLASH,
          };
        case "birthYear":
          return {
            date: { year: vaultItem.birthYear },
            defaultFormat: DateFormat.FORMAT_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_NOTHING,
          };
      }
      return undefined;
    case VaultSourceType.PaymentCard:
      switch (
        ingredient.property as keyof VaultAutofillViewInterfaces[typeof vaultItem.vaultType]
      ) {
        case "expireDate":
          return {
            date: getParsedExpirationDate(vaultItem),
            defaultFormat: DateFormat.FORMAT_MM_YY,
            defaultSeparator: DateSeparator.SEPARATOR_SLASH,
          };
        case "expireYear":
          return {
            date: { year: vaultItem.expireYear },
            defaultFormat: DateFormat.FORMAT_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_NOTHING,
          };
      }
      return undefined;
    case VaultSourceType.DriverLicense:
      switch (
        ingredient.property as keyof VaultAutofillViewInterfaces[typeof vaultItem.vaultType]
      ) {
        case "expirationDateFull":
          return {
            date: getDriverLicenseParsedExpirationDate(vaultItem),
            defaultFormat: DateFormat.FORMAT_DD_MM_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_SLASH,
          };
        case "expirationYear":
          return {
            date: { year: String(vaultItem.expirationYear) },
            defaultFormat: DateFormat.FORMAT_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_NOTHING,
          };
        case "issueDateFull":
          return {
            date: getDriverLicenseParsedIssueDate(vaultItem),
            defaultFormat: DateFormat.FORMAT_DD_MM_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_SLASH,
          };
        case "issueYear":
          return {
            date: { year: String(vaultItem.issueYear) },
            defaultFormat: DateFormat.FORMAT_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_NOTHING,
          };
      }
      return undefined;
    case VaultSourceType.IdCard:
      switch (
        ingredient.property as keyof VaultAutofillViewInterfaces[typeof vaultItem.vaultType]
      ) {
        case "expirationDateFull":
          return {
            date: getIdCardParsedExpirationDate(vaultItem),
            defaultFormat: DateFormat.FORMAT_DD_MM_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_SLASH,
          };
        case "expirationYear":
          return {
            date: { year: String(vaultItem.expirationYear) },
            defaultFormat: DateFormat.FORMAT_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_NOTHING,
          };
        case "issueDateFull":
          return {
            date: getIdCardParsedIssueDate(vaultItem),
            defaultFormat: DateFormat.FORMAT_DD_MM_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_SLASH,
          };
        case "issueYear":
          return {
            date: { year: String(vaultItem.issueYear) },
            defaultFormat: DateFormat.FORMAT_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_NOTHING,
          };
      }
      return undefined;
    case VaultSourceType.Passport:
      switch (
        ingredient.property as keyof VaultAutofillViewInterfaces[typeof vaultItem.vaultType]
      ) {
        case "expirationDateFull":
          return {
            date: getPassportParsedExpirationDate(vaultItem),
            defaultFormat: DateFormat.FORMAT_DD_MM_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_SLASH,
          };
        case "expirationYear":
          return {
            date: { year: String(vaultItem.expirationYear) },
            defaultFormat: DateFormat.FORMAT_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_NOTHING,
          };
        case "issueDateFull":
          return {
            date: getPassportParsedIssueDate(vaultItem),
            defaultFormat: DateFormat.FORMAT_DD_MM_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_SLASH,
          };
        case "issueYear":
          return {
            date: { year: String(vaultItem.issueYear) },
            defaultFormat: DateFormat.FORMAT_YYYY,
            defaultSeparator: DateSeparator.SEPARATOR_NOTHING,
          };
      }
      return undefined;
  }
  return undefined;
};
export const getDashlaneDefinedLinkedWebsites = async (
  context: AutofillEngineContext,
  url: string
): Promise<string[]> => {
  if ((await context.connectors.carbon.getUserLoginStatus()).loggedIn) {
    const dashlaneDefinedLinkedWebsites = await getQueryValue(
      context.connectors.grapheneClient.linkedWebsites.queries.getDashlaneDefinedLinkedWebsites(
        { url }
      )
    );
    if (isSuccess(dashlaneDefinedLinkedWebsites)) {
      return dashlaneDefinedLinkedWebsites.data;
    }
  }
  return [];
};
export const getPhishingPreventionCapability = async (
  context: AutofillEngineContext
): Promise<boolean> => {
  const isPhishingPreventionCapabilityEnabled = await getQueryValue(
    context.connectors.grapheneClient.autofillSecurity.queries.isPhishingPreventionCapabilityEnabled()
  );
  if (isSuccess(isPhishingPreventionCapabilityEnabled)) {
    return isPhishingPreventionCapabilityEnabled.data;
  }
  return false;
};
export const getPhishingPreventionDisabledForUrl = async (
  context: AutofillEngineContext,
  credentialUrl: string,
  pasteDestinationUrl: string
): Promise<boolean> => {
  try {
    const isPhishingPreventionWarningDisabled = await getQueryValue(
      context.connectors.grapheneClient.autofillSecurity.queries.isPhishingPreventionDisabledForUrl(
        {
          credentialUrl,
          pasteDestinationUrl,
        }
      )
    );
    if (isSuccess(isPhishingPreventionWarningDisabled)) {
      return isPhishingPreventionWarningDisabled.data;
    } else {
      return false;
    }
  } catch (exception) {
    context.logException(exception, {
      message: "Error when checking phishing prevention for url",
      fileName: "get.ts",
      funcName: "getPhishingPreventionDisabledForUrl",
    });
    return false;
  }
};
export const getPasswordLimitStatus = async (
  context: AutofillEngineContext
): Promise<PasswordLimitStatus> => {
  let passwordLimitStatus: GetPasswordLimitStatusQueryResult = {
    hasLimit: false,
  } as const;
  const passwordLimitStatusResult = await getQueryValue(
    context.connectors.grapheneClient.passwordLimit.queries.getPasswordLimitStatus()
  );
  if (isSuccess(passwordLimitStatusResult)) {
    passwordLimitStatus = getSuccess(passwordLimitStatusResult);
  }
  const shouldShowPasswordLimitReached =
    passwordLimitStatus.hasLimit && passwordLimitStatus.passwordsLeft < 1;
  const shouldShowNearPasswordLimit =
    passwordLimitStatus.hasLimit &&
    passwordLimitStatus.passwordsLeft > 0 &&
    passwordLimitStatus.passwordsLeft <= 5;
  return {
    shouldShowPasswordLimitReached,
    shouldShowNearPasswordLimit,
    passwordsLeft: passwordLimitStatus.hasLimit
      ? passwordLimitStatus.passwordsLeft
      : undefined,
    limit: passwordLimitStatus.hasLimit ? passwordLimitStatus.limit : undefined,
  };
};
export const checkIsAccountFrozen = async (context: AutofillEngineContext) => {
  let isB2BDiscontinued = false;
  let isB2CFrozen = false;
  try {
    const hasFrozenAccountFF = await checkHasFrozenAccountFF(
      context.connectors
    );
    const nodePremiumStatus =
      await context.connectors.carbon.getNodePremiumStatus();
    const currentTeam = nodePremiumStatus.b2bStatus?.currentTeam;
    if (currentTeam) {
      isB2BDiscontinued =
        currentTeam.isSoftDiscontinued &&
        !!currentTeam.isTrial &&
        (currentTeam.teamMembership.isBillingAdmin ||
          currentTeam.teamMembership.isTeamAdmin);
    }
    if (hasFrozenAccountFF) {
      const b2cFrozenQuery = await firstValueFrom(
        context.connectors.grapheneClient.passwordLimit.queries.isFreeUserFrozen()
      );
      isB2CFrozen = isSuccess(b2cFrozenQuery) && b2cFrozenQuery.data;
    }
  } catch (exception) {
    context.logException(exception, {
      message: "Error when gathering frozen account infos",
      fileName: "get.ts",
      funcName: "checkIsAccountFrozen",
    });
  }
  return {
    isB2BDiscontinued,
    isB2CFrozen,
    isAccountFrozen: isB2BDiscontinued || isB2CFrozen,
  };
};
