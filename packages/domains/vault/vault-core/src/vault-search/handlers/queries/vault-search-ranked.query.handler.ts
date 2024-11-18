import {
  IQueryHandler,
  QueryHandler,
  type QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import {
  Collection,
  VaultItem,
  VaultItemsQueryResult,
  VaultItemType,
  VaultOrganizationClient,
  VaultSearchRankedQuery,
} from "@dashlane/vault-contracts";
import { VaultRepository } from "../../../vault-repository";
import { SharingCollectionsClient } from "@dashlane/sharing-contracts";
import { isFailure, success } from "@dashlane/framework-types";
import { combineLatest, map, of, switchMap } from "rxjs";
interface VaultsItemsWithPriority {
  item: VaultItem;
  priority: string;
}
@QueryHandler(VaultSearchRankedQuery)
export class VaultSearchRankedQueryHandler
  implements IQueryHandler<VaultSearchRankedQuery>
{
  private collections: Collection[] = [];
  private searchQuery = "";
  constructor(
    private readonly vaultRepository: VaultRepository,
    private readonly vaultOrganizationClient: VaultOrganizationClient,
    private readonly sharingCollectionsClient: SharingCollectionsClient
  ) {}
  execute({
    body,
  }: VaultSearchRankedQuery): QueryHandlerResponseOf<VaultSearchRankedQuery> {
    const { vaultItemTypes, searchQuery, pageSize, pageNumber, ...params } =
      body;
    this.searchQuery = searchQuery;
    if (!searchQuery) {
      return of(
        success({
          items: [],
          matchCount: 0,
        })
      );
    }
    const {
      queries: { queryCollections },
    } = this.vaultOrganizationClient;
    const {
      queries: { sharedCollectionsWithItems },
    } = this.sharingCollectionsClient;
    return combineLatest([
      queryCollections({}),
      sharedCollectionsWithItems(),
    ]).pipe(
      switchMap(([privateCollectionsResult, sharedCollectionsResult]) => {
        if (
          isFailure(privateCollectionsResult) ||
          isFailure(sharedCollectionsResult)
        ) {
          throw new Error("Error querying collections");
        }
        this.collections = privateCollectionsResult.data.collections.concat(
          sharedCollectionsResult.data
        );
        const types = vaultItemTypes ?? Object.values(VaultItemType);
        return this.vaultRepository.fetchVaultItems$({
          vaultItemTypes: types,
          ...params,
        });
      }),
      map((fetchResult) => {
        if (isFailure(fetchResult)) {
          throw new Error("Error");
        }
        const itemsResults = fetchResult.data;
        const results: VaultsItemsWithPriority[] = [];
        const itemsResultsWithCollections = {
          collectionsResult: {
            items: this.collections,
            matchCount: this.collections.length,
          },
          ...itemsResults,
        };
        Object.keys(itemsResultsWithCollections).forEach((key: string) => {
          const itemResultKey = key as keyof VaultItemsQueryResult;
          const itemsResult = itemsResultsWithCollections[itemResultKey];
          itemsResult.items.forEach((item: VaultItem) => {
            const primarySearchFields =
              this.getPrimarySearchFields(itemResultKey);
            const secondarySearchFields =
              this.getSecondarySearchFields(itemResultKey);
            const primarySearchFieldsStartsWith = this.searchStartsWith(
              item,
              this.searchQuery,
              primarySearchFields
            );
            const secondarySearchFieldsStartsWith =
              primarySearchFieldsStartsWith ||
              this.searchStartsWith(
                item,
                this.searchQuery,
                secondarySearchFields
              );
            const primarySearchFieldsContains =
              primarySearchFieldsStartsWith || secondarySearchFieldsStartsWith
                ? true
                : this.searchContains(
                    item,
                    this.searchQuery,
                    primarySearchFields
                  );
            const secondarySearchFieldsContains =
              primarySearchFieldsStartsWith ||
              secondarySearchFieldsStartsWith ||
              primarySearchFieldsContains
                ? true
                : this.searchContains(
                    item,
                    this.searchQuery,
                    secondarySearchFields
                  );
            const priority = this.calculatePriority(
              primarySearchFieldsStartsWith,
              primarySearchFieldsContains,
              secondarySearchFieldsStartsWith,
              secondarySearchFieldsContains,
              itemResultKey
            );
            if (priority) {
              results.push({ item, priority });
            }
          });
        }, []);
        const matchCount = results.length;
        let sortedResults = results
          .sort((a, b) => Number(b.priority) - Number(a.priority))
          .map(({ item }) => item);
        if (pageSize && pageNumber) {
          sortedResults = sortedResults.slice(
            pageSize * (pageNumber - 1),
            pageSize * pageNumber
          );
        }
        return success({
          items: sortedResults,
          matchCount,
        });
      })
    );
  }
  private getPrimarySearchFields = (
    resultKey: keyof VaultItemsQueryResult | "collectionsResult"
  ) => {
    switch (resultKey) {
      case "addressesResult":
        return ["itemName"];
      case "bankAccountsResult":
        return ["accountName"];
      case "companiesResult":
        return ["companyName"];
      case "credentialsResult":
        return ["itemName"];
      case "driversLicensesResult":
        return ["idName"];
      case "emailsResult":
        return ["itemName"];
      case "fiscalIdsResult":
        return ["fiscalNumber"];
      case "idCardsResult":
        return ["idName"];
      case "identitiesResult":
        return ["fullName"];
      case "passkeysResult":
        return ["itemName"];
      case "passportsResult":
        return ["idName"];
      case "paymentCardsResult":
        return ["itemName"];
      case "phonesResult":
        return ["itemName"];
      case "secretsResult":
        return ["title"];
      case "secureNotesResult":
        return ["title"];
      case "socialSecurityIdsResult":
        return ["idName"];
      case "websitesResult":
        return ["itemName"];
      case "collectionsResult":
        return ["name"];
      default:
        return [];
    }
  };
  private getSecondarySearchFields = (
    resultKey: keyof VaultItemsQueryResult | "collectionsResult"
  ) => {
    switch (resultKey) {
      case "addressesResult":
        return ["building", "city", "door", "floor", "streetName", "zipCode"];
      case "bankAccountsResult":
        return ["ownerName", "bankCode"];
      case "companiesResult":
        return ["jobTitle"];
      case "credentialsResult":
        return [
          "email",
          "username",
          "URL",
          "linkedURLs",
          "note",
          "alternativeUsername",
        ];
      case "driversLicensesResult":
        return [];
      case "emailsResult":
        return ["emailAddress"];
      case "fiscalIdsResult":
        return [];
      case "idCardsResult":
        return [];
      case "identitiesResult":
        return ["firstName", "middleName", "lastName", "pseudo"];
      case "passkeysResult":
        return ["userDisplayName", "rpName", "note"];
      case "passportsResult":
        return ["idNumber"];
      case "paymentCardsResult":
        return ["ownerName", "note", "cardNumber"];
      case "phonesResult":
        return ["phoneNumber"];
      case "secretsResult":
        return ["content"];
      case "secureNotesResult":
        return ["content"];
      case "socialSecurityIdsResult":
        return ["idNumber"];
      case "websitesResult":
        return ["URL"];
      case "collectionsResult":
        return [];
      default:
        return [];
    }
  };
  private getItemTypePriority = (
    resultKey: keyof VaultItemsQueryResult | "collectionsResult"
  ) => {
    switch (resultKey) {
      case "passkeysResult":
        return "01";
      case "phonesResult":
        return "02";
      case "websitesResult":
        return "03";
      case "identitiesResult":
        return "04";
      case "emailsResult":
        return "05";
      case "companiesResult":
        return "06";
      case "addressesResult":
        return "07";
      case "socialSecurityIdsResult":
        return "08";
      case "passportsResult":
        return "09";
      case "idCardsResult":
        return "10";
      case "fiscalIdsResult":
        return "11";
      case "driversLicensesResult":
        return "12";
      case "paymentCardsResult":
        return "13";
      case "bankAccountsResult":
        return "14";
      case "collectionsResult":
        return "15";
      case "secretsResult":
        return "16";
      case "secureNotesResult":
        return "17";
      case "credentialsResult":
        return "18";
      default:
        return "00";
    }
  };
  private calculatePriority = (
    primarySearchFieldsStartsWith: boolean,
    secondarySearchFieldsStartsWith: boolean,
    primarySearchFieldsContains: boolean,
    secondarySearchFieldsContains: boolean,
    itemType: keyof VaultItemsQueryResult
  ) => {
    if (
      !primarySearchFieldsStartsWith &&
      !secondarySearchFieldsStartsWith &&
      !primarySearchFieldsContains &&
      !secondarySearchFieldsContains
    ) {
      return null;
    }
    return `${Number(primarySearchFieldsStartsWith)}${Number(
      secondarySearchFieldsStartsWith
    )}${Number(primarySearchFieldsContains)}${Number(
      secondarySearchFieldsContains
    )}${this.getItemTypePriority(itemType)}`;
  };
  private normalizeString = (str: string) => {
    if (typeof str !== "string") {
      return "";
    }
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };
  private searchStartsWith = (
    item: VaultItem,
    searchQuery: string,
    searchFields: string[]
  ) => {
    for (const searchField of searchFields) {
      const value = this.normalizeString(
        item[searchField as keyof VaultItem]?.toString() ?? ""
      );
      if (value.startsWith(this.normalizeString(searchQuery))) {
        return true;
      }
    }
    return false;
  };
  private searchContains = (
    item: VaultItem,
    searchQuery: string,
    searchFields: string[]
  ) => {
    let concatenatedFields = "";
    for (const searchField of searchFields) {
      const value = item[searchField as keyof VaultItem];
      concatenatedFields += this.normalizeString(value?.toString() ?? "");
    }
    return concatenatedFields.includes(this.normalizeString(searchQuery));
  };
}
