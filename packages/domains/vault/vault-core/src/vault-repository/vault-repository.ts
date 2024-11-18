import {
  combineLatest,
  distinctUntilChanged,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import {
  failure,
  getFailure,
  getSuccess,
  isFailure,
  isSuccess,
  mapSuccessObservable,
  Result,
  success,
} from "@dashlane/framework-types";
import {
  CarbonLegacyClient,
  DataModelObject,
  DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY,
  PremiumStatusSpace,
  Space,
} from "@dashlane/communication";
import {
  createForbiddenGroupItemError,
  createForbiddenLastAdminError,
  Credential,
  ForbiddenGroupItemError,
  ForbiddenLastAdminError,
  Passkey,
  VaultItem,
  VaultItemPropertyFilter,
  VaultItemPropertySorting,
  VaultItemsQueryParam,
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
import { LinkedWebsitesClient } from "@dashlane/autofill-contracts";
import { SharingItemsClient } from "@dashlane/sharing-contracts";
@Injectable()
export class VaultRepository {
  private getVaultItems$TypeDictionary = {
    [VaultItemType.Address]: () =>
      this.getVaultItems$(VaultItemType.Address, isAddressArray, addressMapper),
    [VaultItemType.BankAccount]: () =>
      this.getVaultItems$(
        VaultItemType.BankAccount,
        isBankAccountArray,
        bankAccountMapper
      ),
    [VaultItemType.Company]: () =>
      this.getVaultItems$(VaultItemType.Company, isCompanyArray, companyMapper),
    [VaultItemType.Credential]: () =>
      this.getVaultItems$(
        VaultItemType.Credential,
        isCredentialArray,
        credentialMapper
      ),
    [VaultItemType.DriversLicense]: () =>
      this.getVaultItems$(
        VaultItemType.DriversLicense,
        isDriversLicenseArray,
        driversLicenseMapper
      ),
    [VaultItemType.Email]: () =>
      this.getVaultItems$(VaultItemType.Email, isEmailArray, emailMapper),
    [VaultItemType.FiscalId]: () =>
      this.getVaultItems$(
        VaultItemType.FiscalId,
        isFiscalIdArray,
        fiscalIdMapper
      ),
    [VaultItemType.IdCard]: () =>
      this.getVaultItems$(VaultItemType.IdCard, isIdCardArray, idCardMapper),
    [VaultItemType.Identity]: () =>
      this.getVaultItems$(
        VaultItemType.Identity,
        isIdentityArray,
        identityMapper
      ),
    [VaultItemType.Passkey]: () =>
      this.getVaultItems$(
        VaultItemType.Passkey,
        isPasskeyArray,
        mapKeysToLowercase<Passkey>
      ),
    [VaultItemType.Passport]: () =>
      this.getVaultItems$(
        VaultItemType.Passport,
        isPassportArray,
        passportMapper
      ),
    [VaultItemType.PaymentCard]: () =>
      this.getVaultItems$(
        VaultItemType.PaymentCard,
        isPaymentCardArray,
        paymentCardMapper
      ),
    [VaultItemType.Phone]: () =>
      this.getVaultItems$(VaultItemType.Phone, isPhoneArray, phoneMapper),
    [VaultItemType.Secret]: () =>
      this.getVaultItems$(VaultItemType.Secret, isSecretArray, secretMapper),
    [VaultItemType.SecureNote]: () =>
      this.getVaultItems$(
        VaultItemType.SecureNote,
        isSecureNoteArray,
        secureNoteMapper
      ),
    [VaultItemType.SocialSecurityId]: () =>
      this.getVaultItems$(
        VaultItemType.SocialSecurityId,
        isSocialSecurityIdArray,
        socialSecurityIdMapper
      ),
    [VaultItemType.Website]: () =>
      this.getVaultItems$(VaultItemType.Website, isWebsiteArray, websiteMapper),
  };
  private mapTypeToCarbonPath(VaultItemTypeToMap: VaultItemType) {
    return DATAMODELOBJECT_TYPE_TO_CARBON_STORE_KEY[VaultItemTypeToMap];
  }
  private ids?: string[];
  private propertyFilters?: VaultItemPropertyFilter[];
  private propertySorting?: VaultItemPropertySorting;
  private pageSize?: number;
  private pageNumber?: number;
  private additionalFilterFunc?: (item: VaultItem) => boolean;
  private needDashlaneLinkedWebsites?: boolean;
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private readonly linkedWebsitesClient: LinkedWebsitesClient
  ) {}
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
    additionalFilterFunc?: (item: VaultItem) => boolean,
    needDashlaneLinkedWebsites?: boolean
  ) {
    const { vaultItemTypes, ...rest } = params;
    this.initializeVaultItemsQueryParams(rest);
    this.additionalFilterFunc = additionalFilterFunc;
    this.needDashlaneLinkedWebsites = needDashlaneLinkedWebsites;
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
  private getDashlaneDefinedLinkedWebsites$<T extends VaultItem>(
    mappedItems: Result<T[]>
  ): Observable<Result<T[]>> {
    if (
      isSuccess(mappedItems) &&
      isCredentialArray(mappedItems.data) &&
      this.needDashlaneLinkedWebsites
    ) {
      const credentialItems = mappedItems.data as Credential[];
      const urls = credentialItems.map(({ URL }) => URL);
      return this.linkedWebsitesClient.queries
        .getMultipleDashlaneDefinedLinkedWebsites({ urls })
        .pipe(
          mapSuccessObservable((dashlaneLinkedWebsites) => {
            return credentialItems.map((item, index) => ({
              ...item,
              linkedURLs: [
                ...item.linkedURLs,
                ...dashlaneLinkedWebsites[index],
              ],
            })) as T[];
          })
        );
    }
    return of(mappedItems);
  }
  private getVaultItems$<
    CT extends DataModelObject,
    K extends VaultItemType,
    T extends VaultItem
  >(
    itemType: K,
    typeGuard: (uut: unknown) => uut is CT[],
    itemMapper: (item: CT) => T
  ) {
    return combineLatest(
      [
        this.getCarbonVaultItems$(itemType, typeGuard),
        this.getCarbonVaultItems$(VaultItemType.Identity, isIdentityArray),
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
      switchMap(this.getDashlaneDefinedLinkedWebsites$.bind(this)),
      mapSuccessObservable((mappedItems) => {
        const sortedAndFilteredItems = sortVaultItems(
          filterVaultItems(
            mappedItems,
            this.propertyFilters,
            this.additionalFilterFunc
          ),
          this.propertySorting
        );
        const typeName = VaultItemTypeToResultDictionary[itemType];
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
    itemType: VaultItemType,
    typeGuard: (uut: unknown) => uut is CT[]
  ) {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    const typePath = this.mapTypeToCarbonPath(itemType);
    return carbonState({
      path: `userSession.personalData.${typePath}`,
    }).pipe(
      map((itemsResult) => {
        if (isFailure(itemsResult) || !typeGuard(itemsResult.data)) {
          throw new Error(
            `Bad ${VaultItemTypeToResultDictionary[itemType]} format`
          );
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
  public vaultItemsOfTypeExist = async (
    ids: string[],
    vaultItemType: VaultItemType
  ) => {
    const typePath = this.mapTypeToCarbonPath(vaultItemType);
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    return firstValueFrom(
      carbonState({
        path: `userSession.personalData.${typePath}`,
      }).pipe(
        map((itemsResult) => {
          if (isFailure(itemsResult) || !Array.isArray(itemsResult.data)) {
            throw new Error(
              `Unexpected error fetching vault item for ${vaultItemType}`
            );
          }
          const found: string[] = [];
          const notFound: string[] = [];
          for (const id of ids) {
            if (itemsResult.data.some((item) => item.Id === id)) {
              found.push(id);
            } else {
              notFound.push(id);
            }
          }
          return {
            found,
            notFound,
          };
        })
      )
    );
  };
  async shouldRefuseSharedItemBeforeVaultItemDeletion(
    sharingItemsClient: SharingItemsClient,
    vaultItemId: string
  ): Promise<
    Result<boolean, ForbiddenGroupItemError | ForbiddenLastAdminError>
  > {
    const itemId = vaultItemId;
    const itemSharingStatusResult = await firstValueFrom(
      sharingItemsClient.queries.getSharingStatusForItem({
        itemId,
      })
    );
    if (isFailure(itemSharingStatusResult)) {
      throw new Error(
        "Unexpected failure while attempting to retrieve sharing status of item to be deleted",
        {
          cause: { failure: getFailure(itemSharingStatusResult) },
        }
      );
    }
    const { isSharedViaUserGroup, isShared } = getSuccess(
      itemSharingStatusResult
    );
    if (!isShared) {
      return success(false);
    }
    if (isSharedViaUserGroup) {
      return failure(createForbiddenGroupItemError());
    }
    const isLastAdminForItemResult = await firstValueFrom(
      sharingItemsClient.queries.getIsLastAdminForItem({
        itemId,
      })
    );
    if (isFailure(isLastAdminForItemResult)) {
      throw new Error(
        "Unexpected failure while attempting to determine if we're the last admin of shared item to be deleted",
        {
          cause: { failure: getFailure(isLastAdminForItemResult) },
        }
      );
    }
    const { isLastAdmin } = getSuccess(isLastAdminForItemResult);
    if (isLastAdmin) {
      return failure(createForbiddenLastAdminError());
    }
    return success(true);
  }
  public getCredential = async (id: string) => {
    const typePath = this.mapTypeToCarbonPath(VaultItemType.Credential);
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    return firstValueFrom(
      carbonState({
        path: `userSession.personalData.${typePath}`,
      }).pipe(
        map((itemsResult) => {
          if (isFailure(itemsResult) || !isCredentialArray(itemsResult.data)) {
            throw new Error(`Unexpected error fetching credential`);
          }
          const credential = itemsResult.data.find((item) => item.Id === id);
          if (!credential) {
            throw new Error("Credential not found in vault");
          }
          return credential;
        })
      )
    );
  };
}
