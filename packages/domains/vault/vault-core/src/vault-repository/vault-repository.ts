import { combineLatest, distinctUntilChanged, map } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import {
  isFailure,
  mapSuccessObservable,
  success,
} from "@dashlane/framework-types";
import {
  CarbonLegacyClient,
  DataModelObject,
  PremiumStatusSpace,
  Space,
} from "@dashlane/communication";
import {
  Passkey,
  VaultItem,
  VaultItemPropertyFilter,
  VaultItemPropertySorting,
  VaultItemsQueryParam,
  VaultItemsQueryResult,
  VaultItemType,
  VaultItemTypeToResultDictionary,
} from "@dashlane/vault-contracts";
import {
  isAddressArray,
  isBankAccountArray,
  isCompanyArray,
  isCredentialArray,
  isDriversLicenseArray,
  isEmailArray,
  isFiscalIdArray,
  isIdCardArray,
  isIdentityArray,
  isPasskeyArray,
  isPassportArray,
  isPaymentCardArray,
  isPhoneArray,
  isSecureNoteArray,
  isSocialSecurityIdArray,
  isSpaceArray,
  isWebsiteArray,
} from "./carbon-guards";
import {
  filterAndMapCarbonVaultItems,
  filterVaultItems,
} from "./filter-vault-items";
import { sortVaultItems } from "./sort-vault-items";
import {
  addressMapper,
  bankAccountMapper,
  companyMapper,
  credentialMapper,
  driversLicenseMapper,
  emailMapper,
  fiscalIdMapper,
  idCardMapper,
  identityMapper,
  passportMapper,
  paymentCardMapper,
  phoneMapper,
  secureNoteMapper,
  socialSecurityIdMapper,
  websiteMapper,
} from "./type-mappers";
import { mapKeysToLowercase } from "./utility";
import { isSecretArray } from "./carbon-guards/is-secret-array";
import { secretMapper } from "./type-mappers/secret-mapper";
const IDENTITY_TYPE_PATH = VaultItemTypeToResultDictionary[
  VaultItemType.Identity
].replace("Result", "");
@Injectable()
export class VaultRepository {
  private getVaultItems$TypeDictionary = {
    [VaultItemType.Address]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Address],
        isAddressArray,
        addressMapper
      ),
    [VaultItemType.BankAccount]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.BankAccount],
        isBankAccountArray,
        bankAccountMapper
      ),
    [VaultItemType.Company]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Company],
        isCompanyArray,
        companyMapper
      ),
    [VaultItemType.Credential]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Credential],
        isCredentialArray,
        credentialMapper
      ),
    [VaultItemType.DriversLicense]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.DriversLicense],
        isDriversLicenseArray,
        driversLicenseMapper,
        "driverLicenses"
      ),
    [VaultItemType.Email]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Email],
        isEmailArray,
        emailMapper
      ),
    [VaultItemType.FiscalId]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.FiscalId],
        isFiscalIdArray,
        fiscalIdMapper
      ),
    [VaultItemType.IdCard]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.IdCard],
        isIdCardArray,
        idCardMapper
      ),
    [VaultItemType.Identity]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Identity],
        isIdentityArray,
        identityMapper
      ),
    [VaultItemType.Passkey]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Passkey],
        isPasskeyArray,
        mapKeysToLowercase<Passkey>
      ),
    [VaultItemType.Passport]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Passport],
        isPassportArray,
        passportMapper
      ),
    [VaultItemType.PaymentCard]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.PaymentCard],
        isPaymentCardArray,
        paymentCardMapper
      ),
    [VaultItemType.Phone]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Phone],
        isPhoneArray,
        phoneMapper
      ),
    [VaultItemType.Secret]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Secret],
        isSecretArray,
        secretMapper
      ),
    [VaultItemType.SecureNote]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.SecureNote],
        isSecureNoteArray,
        secureNoteMapper,
        "notes"
      ),
    [VaultItemType.SocialSecurityId]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.SocialSecurityId],
        isSocialSecurityIdArray,
        socialSecurityIdMapper
      ),
    [VaultItemType.Website]: () =>
      this.getVaultItems$(
        VaultItemTypeToResultDictionary[VaultItemType.Website],
        isWebsiteArray,
        websiteMapper,
        "personalWebsites"
      ),
  };
  private ids?: string[];
  private propertyFilters?: VaultItemPropertyFilter[];
  private propertySorting?: VaultItemPropertySorting;
  private pageSize?: number;
  private pageNumber?: number;
  private additionalFilterFunc?: (item: VaultItem) => boolean;
  constructor(private carbonLegacyClient: CarbonLegacyClient) {}
  private initializeVaultItemsQueryParams(
    params: Omit<VaultItemsQueryParam, "vaultItemTypes">
  ) {
    const { ids, pageSize, pageNumber, propertyFilters, propertySorting } =
      params;
    this.ids = ids;
    this.propertyFilters = propertyFilters;
    this.propertySorting = propertySorting;
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
  }
  public fetchVaultItems$(
    params: VaultItemsQueryParam,
    additionalFilterFunc?: (item: VaultItem) => boolean
  ) {
    const { vaultItemTypes, ...rest } = params;
    this.initializeVaultItemsQueryParams(rest);
    this.additionalFilterFunc = additionalFilterFunc;
    const combinedItems$ = combineLatest(
      vaultItemTypes.map((vaultItemType) =>
        this.getVaultItems$TypeDictionary[vaultItemType]()
      )
    );
    const result = this.getEmptyVaultItemsQueryResult();
    return combinedItems$.pipe(
      map((items) => {
        items.forEach((item) => {
          if (item.tag === "failure") {
            throw new Error(`Error while fetching vault items`);
          }
          Object.assign(result, item.data);
        });
        return success(result);
      })
    );
  }
  private getVaultItems$<
    CT extends DataModelObject,
    K extends keyof VaultItemsQueryResult,
    T extends VaultItem
  >(
    typeName: K,
    typeGuard: (uut: unknown) => uut is CT[],
    itemMapper: (item: CT) => T,
    typePath?: string
  ) {
    typePath = typePath ?? typeName.replace("Result", "");
    return combineLatest(
      [
        this.getCarbonVaultItems$(typeName, typeGuard, typePath),
        this.getCarbonVaultItems$(
          VaultItemTypeToResultDictionary[VaultItemType.Identity],
          isIdentityArray,
          IDENTITY_TYPE_PATH
        ),
        this.getQuarantinedSpacesTeamIds$(),
      ],
      (carbonVaultItems, carbonIdentites, quarantinedSpaces) =>
        success(
          filterAndMapCarbonVaultItems(
            carbonVaultItems,
            carbonIdentites,
            quarantinedSpaces,
            itemMapper,
            this.ids
          )
        )
    ).pipe(
      mapSuccessObservable((mappedItems) => {
        const sortedAndFilteredItems = sortVaultItems(
          filterVaultItems(
            mappedItems,
            this.propertyFilters,
            this.additionalFilterFunc
          ),
          this.propertySorting
        );
        return {
          [typeName]: {
            items: this.getPage(sortedAndFilteredItems),
            matchCount: sortedAndFilteredItems.length,
          },
        } as {
          [key in K]: {
            items: T[];
            matchCount: number;
          };
        };
      })
    );
  }
  private getPage<T extends VaultItem>(items: T[]) {
    if (!this.pageNumber || !this.pageSize) {
      return items;
    }
    return items.slice(
      this.pageSize * (this.pageNumber - 1),
      this.pageSize * this.pageNumber
    );
  }
  private getCarbonVaultItems$<CT extends DataModelObject>(
    typeName: keyof VaultItemsQueryResult,
    typeGuard: (uut: unknown) => uut is CT[],
    typePath: string
  ) {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    return carbonState({
      path: `userSession.personalData.${typePath}`,
    }).pipe(
      map((itemsResult) => {
        if (isFailure(itemsResult) || !typeGuard(itemsResult.data)) {
          throw new Error(`Bad ${typeName} format`);
        }
        return itemsResult.data;
      })
    );
  }
  private getQuarantinedSpacesTeamIds$() {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    return carbonState({
      path: `userSession.spaceData.spaces`,
    }).pipe(
      map((spacesResult) => {
        if (isFailure(spacesResult) || !isSpaceArray(spacesResult.data)) {
          throw new Error("Bad spaces format");
        }
        return (spacesResult.data as Space[]).filter((space) =>
          this.isPremiumStatusSpaceQuarantined(space.details)
        );
      }),
      map((spaces) => spaces.map((s) => s.teamId).sort()),
      distinctUntilChanged(
        (ids1, ids2) => JSON.stringify(ids1) !== JSON.stringify(ids2)
      )
    );
  }
  private isPremiumStatusSpaceQuarantined(spaces: PremiumStatusSpace) {
    return (
      spaces.status.toLowerCase() !== "accepted" &&
      Boolean(spaces.info["removeForcedContentEnabled"])
    );
  }
  private getEmptyVaultItemsQueryResult = () => ({
    addressesResult: this.getEmptyItemsQueryResult(),
    bankAccountsResult: this.getEmptyItemsQueryResult(),
    companiesResult: this.getEmptyItemsQueryResult(),
    credentialsResult: this.getEmptyItemsQueryResult(),
    driversLicensesResult: this.getEmptyItemsQueryResult(),
    emailsResult: this.getEmptyItemsQueryResult(),
    fiscalIdsResult: this.getEmptyItemsQueryResult(),
    idCardsResult: this.getEmptyItemsQueryResult(),
    identitiesResult: this.getEmptyItemsQueryResult(),
    passkeysResult: this.getEmptyItemsQueryResult(),
    passportsResult: this.getEmptyItemsQueryResult(),
    paymentCardsResult: this.getEmptyItemsQueryResult(),
    phonesResult: this.getEmptyItemsQueryResult(),
    secretsResult: this.getEmptyItemsQueryResult(),
    secureNotesResult: this.getEmptyItemsQueryResult(),
    socialSecurityIdsResult: this.getEmptyItemsQueryResult(),
    websitesResult: this.getEmptyItemsQueryResult(),
  });
  private getEmptyItemsQueryResult = () => ({
    items: [],
    matchCount: 0,
  });
}
