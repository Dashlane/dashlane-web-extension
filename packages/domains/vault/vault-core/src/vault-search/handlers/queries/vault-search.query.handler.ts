import { combineLatest, map, switchMap } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { isFailure, success } from "@dashlane/framework-types";
import { SharingCollectionsClient } from "@dashlane/sharing-contracts";
import {
  Collection,
  VaultItem,
  VaultItemType,
  VaultOrganizationClient,
  VaultSearchQuery,
} from "@dashlane/vault-contracts";
import { VaultRepository } from "../../../vault-repository";
@QueryHandler(VaultSearchQuery)
export class VaultSearchQueryHandler
  implements IQueryHandler<VaultSearchQuery>
{
  private readonly separator = ",";
  private collections: Collection[] = [];
  private searchQuery = "";
  constructor(
    private readonly vaultRepository: VaultRepository,
    private readonly vaultOrganizationClient: VaultOrganizationClient,
    private readonly sharingCollectionsClient: SharingCollectionsClient
  ) {}
  public execute({
    body: {
      vaultItemTypes,
      searchQuery,
      needDashlaneLinkedWebsites = false,
      ...params
    },
  }: VaultSearchQuery): QueryHandlerResponseOf<VaultSearchQuery> {
    this.searchQuery = searchQuery;
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
        return this.vaultRepository.fetchVaultItems$(
          { vaultItemTypes: types, ...params },
          this.isVaultItemMatch,
          needDashlaneLinkedWebsites
        );
      }),
      map((itemsResultsWithFF) => {
        if (isFailure(itemsResultsWithFF)) {
          throw new Error("Error");
        }
        const itemsResults = itemsResultsWithFF.data;
        let collectionsResult;
        if (!vaultItemTypes) {
          const matchingCollections = this.collections.filter((collection) =>
            this.isMatch(collection)
          );
          collectionsResult = {
            items: matchingCollections,
            matchCount: matchingCollections.length,
          };
        } else {
          collectionsResult = {
            items: [],
            matchCount: 0,
          };
        }
        return success({
          ...itemsResults,
          collectionsResult,
        });
      })
    );
  }
  private normalizeString = (str: string) => {
    if (typeof str !== "string") {
      return "";
    }
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };
  private isMatch(object: object, searchString = "") {
    searchString += Object.values(object)
      .filter((value) => typeof value !== "object" || Array.isArray(value))
      .map((value) => {
        if (Array.isArray(value)) {
          return value.toString();
        }
        return value;
      })
      .join(this.separator);
    return this.normalizeString(searchString).includes(
      this.normalizeString(this.searchQuery)
    );
  }
  private isVaultItemMatch = (item: VaultItem) => {
    let searchString = "";
    this.collections.forEach((collection) => {
      if (collection.vaultItems.some((vaultItem) => vaultItem.id === item.id)) {
        searchString += `${collection.name}${this.separator}`;
      }
    });
    return this.isMatch(item, searchString);
  };
}
